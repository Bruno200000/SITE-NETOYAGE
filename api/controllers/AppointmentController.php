<?php

function appointment_schedule(): array
{
    $defaults = [
        'appointment_available_days' => '[1,2,3,4,5]',
        'appointment_start_time' => '08:00',
        'appointment_end_time' => '17:00',
        'appointment_slot_minutes' => '60',
        'appointment_closed_dates' => '[]',
    ];
    $keys = array_keys($defaults);
    $placeholders = implode(',', array_fill(0, count($keys), '?'));
    $stmt = db()->prepare("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ($placeholders)");
    $stmt->execute($keys);
    $settings = $defaults;
    foreach ($stmt->fetchAll() as $row) {
        $settings[$row['setting_key']] = (string) ($row['setting_value'] ?? '');
    }

    $days = json_decode($settings['appointment_available_days'], true);
    $closedDates = json_decode($settings['appointment_closed_dates'], true);
    $days = is_array($days) ? array_values(array_unique(array_filter(array_map('intval', $days), fn($day) => $day >= 1 && $day <= 7))) : [1, 2, 3, 4, 5];
    $closedDates = is_array($closedDates) ? array_values(array_filter($closedDates, fn($date) => is_string($date) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $date))) : [];
    $start = preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $settings['appointment_start_time']) ? $settings['appointment_start_time'] : '08:00';
    $end = preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $settings['appointment_end_time']) ? $settings['appointment_end_time'] : '17:00';
    $interval = (int) $settings['appointment_slot_minutes'];
    if ($interval < 15 || $interval > 480) {
        $interval = 60;
    }

    return [
        'available_days' => $days,
        'start_time' => $start,
        'end_time' => $end,
        'slot_minutes' => $interval,
        'closed_dates' => $closedDates,
    ];
}

function get_appointment_availability(): void
{
    $schedule = appointment_schedule();
    $from = date('Y-m-d');
    $to = (new DateTimeImmutable('+120 days'))->format('Y-m-d');
    $stmt = db()->prepare("SELECT DATE_FORMAT(appointment_date, '%Y-%m-%d') AS date, TIME_FORMAT(appointment_time, '%H:%i') AS time FROM appointments WHERE appointment_date BETWEEN ? AND ? AND appointment_time IS NOT NULL AND status IN ('pending', 'confirmed')");
    $stmt->execute([$from, $to]);
    $schedule['booked_slots'] = $stmt->fetchAll();
    ok($schedule);
}

function update_appointment_availability(): void
{
    require_admin();
    $data = json_input();
    $days = array_values(array_unique(array_filter(array_map('intval', $data['available_days'] ?? []), fn($day) => $day >= 1 && $day <= 7)));
    sort($days);
    $start = (string) ($data['start_time'] ?? '');
    $end = (string) ($data['end_time'] ?? '');
    $interval = (int) ($data['slot_minutes'] ?? 0);
    $closedDates = $data['closed_dates'] ?? [];

    if (!$days || !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $start) || !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $end) || $end <= $start) {
        fail('Choisissez au moins un jour et une plage horaire valide.', 422);
    }
    if ($interval < 15 || $interval > 480 || !is_array($closedDates)) {
        fail('La durée des créneaux ou les dates fermées sont invalides.', 422);
    }
    foreach ($closedDates as $date) {
        if (!is_string($date) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            fail('Une date de fermeture est invalide.', 422);
        }
    }

    $settings = [
        'appointment_available_days' => json_encode($days),
        'appointment_start_time' => $start,
        'appointment_end_time' => $end,
        'appointment_slot_minutes' => (string) $interval,
        'appointment_closed_dates' => json_encode(array_values(array_unique($closedDates))),
    ];
    try {
        $stmt = db()->prepare('INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES (?, ?, \'text\') ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
        foreach ($settings as $key => $value) {
            $stmt->execute([$key, $value]);
        }
    } catch (PDOException $e) {
        error_log('[2JK API] update_appointment_availability: ' . $e->getMessage());
        fail('Impossible d’enregistrer les disponibilités.', 503);
    }

    ok(appointment_schedule(), 'Disponibilités enregistrées.');
}

function validate_appointment_slot(string $dateValue, string $timeValue, ?int $ignoreId = null, bool $checkBooked = true): void
{
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $dateValue);
    $dateErrors = DateTimeImmutable::getLastErrors();
    if (!$date || ($dateErrors !== false && ($dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0)) || $date->format('Y-m-d') !== $dateValue) {
        fail('La date du rendez-vous est invalide.', 422);
    }
    if ($date < new DateTimeImmutable('tomorrow')) {
        fail('Les rendez-vous sont disponibles dès demain.', 422);
    }

    $schedule = appointment_schedule();
    if (!in_array((int) $date->format('N'), $schedule['available_days'], true) || in_array($dateValue, $schedule['closed_dates'], true)) {
        fail('Cette date n’est pas disponible. Choisissez un autre jour.', 409);
    }
    if (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $timeValue)) {
        fail('L’heure du rendez-vous est invalide.', 422);
    }
    $startMinutes = ((int) substr($schedule['start_time'], 0, 2) * 60) + (int) substr($schedule['start_time'], 3, 2);
    $endMinutes = ((int) substr($schedule['end_time'], 0, 2) * 60) + (int) substr($schedule['end_time'], 3, 2);
    $selectedMinutes = ((int) substr($timeValue, 0, 2) * 60) + (int) substr($timeValue, 3, 2);
    if ($selectedMinutes < $startMinutes || $selectedMinutes + $schedule['slot_minutes'] > $endMinutes || (($selectedMinutes - $startMinutes) % $schedule['slot_minutes']) !== 0) {
        fail('Cette heure n’est pas proposée. Choisissez un créneau disponible.', 409);
    }
    if (!$checkBooked) {
        return;
    }

    $sql = "SELECT id FROM appointments WHERE appointment_date = ? AND TIME_FORMAT(appointment_time, '%H:%i') = ? AND status IN ('pending', 'confirmed')";
    $params = [$dateValue, $timeValue];
    if ($ignoreId !== null) {
        $sql .= ' AND id <> ?';
        $params[] = $ignoreId;
    }
    $stmt = db()->prepare($sql . ' LIMIT 1');
    $stmt->execute($params);
    if ($stmt->fetch()) {
        fail('Ce créneau vient d’être réservé. Choisissez une autre heure.', 409);
    }
}

function create_appointment(): void
{
    $data = sanitize_input(json_input());
    $errors = array_merge(
        validate_required($data, ['name', 'email', 'phone', 'appointment_date', 'appointment_time']),
        validate_email_field($data)
    );
    if ($errors) {
        fail('Validation échouée.', 422, $errors);
    }

    $dateValue = (string) $data['appointment_date'];
    $timeValue = substr((string) $data['appointment_time'], 0, 5);
    validate_appointment_slot($dateValue, $timeValue, null, false);

    $lockName = '2jk_appt_' . substr(hash('sha256', $dateValue . '|' . $timeValue), 0, 48);
    $lock = db()->prepare('SELECT GET_LOCK(?, 5)');
    $lock->execute([$lockName]);
    if ((int) $lock->fetchColumn() !== 1) {
        fail('Le calendrier est occupé. Réessayez dans quelques secondes.', 503);
    }

    $releaseLock = db()->prepare('SELECT RELEASE_LOCK(?)');
    try {
        validate_appointment_slot($dateValue, $timeValue);
    } catch (Throwable $error) {
        $releaseLock->execute([$lockName]);
        throw $error;
    }

    try {
        $insert = db()->prepare('INSERT INTO appointments (service_id, name, phone, email, address, appointment_date, appointment_time, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, \'pending\')');
        $insert->execute([
            !empty($data['service_id']) ? $data['service_id'] : null,
            $data['name'],
            $data['phone'],
            $data['email'],
            $data['address'] ?? null,
            $dateValue,
            $timeValue . ':00',
            $data['message'] ?? null,
        ]);
    } catch (PDOException $e) {
        $releaseLock->execute([$lockName]);
        error_log('[2JK API] create_appointment: ' . $e->getMessage());
        fail('Impossible d’enregistrer le rendez-vous.', 503);
    }
    $releaseLock->execute([$lockName]);
    ok(['id' => (int) db()->lastInsertId()], 'Demande de rendez-vous enregistrée.');
}