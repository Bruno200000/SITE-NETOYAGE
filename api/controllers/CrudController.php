<?php

const RESOURCE_MAP = [
    'services' => ['table' => 'services', 'public_read' => true, 'public_write' => false, 'required' => ['title', 'slug']],
    'blog-categories' => ['table' => 'blog_categories', 'public_read' => true, 'public_write' => false, 'required' => ['name', 'slug']],
    'posts' => ['table' => 'posts', 'public_read' => true, 'public_write' => false, 'required' => ['title', 'slug']],
    'gallery-categories' => ['table' => 'gallery_categories', 'public_read' => true, 'public_write' => false, 'required' => ['name', 'slug']],
    'albums' => ['table' => 'albums', 'public_read' => true, 'public_write' => false, 'required' => ['title', 'slug']],
    'gallery' => ['table' => 'gallery_images', 'public_read' => true, 'public_write' => false, 'required' => ['title', 'image']],
    'testimonials' => ['table' => 'testimonials', 'public_read' => true, 'public_write' => true, 'required' => ['client_name', 'comment']],
    'quotes' => ['table' => 'quotes', 'public_read' => false, 'public_write' => true, 'required' => ['email', 'phone']],
    'appointments' => ['table' => 'appointments', 'public_read' => false, 'public_write' => true, 'required' => ['name', 'email', 'phone', 'appointment_date', 'appointment_time']],
    'contacts' => ['table' => 'contact_messages', 'public_read' => false, 'public_write' => true, 'required' => ['name', 'email', 'message']],
    'applications' => ['table' => 'applications', 'public_read' => false, 'public_write' => true, 'required' => ['fullname', 'email', 'phone', 'poste']],
    'job-offers' => ['table' => 'job_offers', 'public_read' => true, 'public_write' => false, 'required' => ['title', 'slug']],
    'faq' => ['table' => 'faqs', 'public_read' => true, 'public_write' => false, 'required' => ['question', 'answer']],
    'settings' => ['table' => 'site_settings', 'public_read' => true, 'public_write' => false, 'required' => ['setting_key', 'setting_value']],
    'notifications' => ['table' => 'notifications', 'public' => false, 'required' => ['title', 'message']],
    'media' => ['table' => 'media', 'public' => false, 'required' => ['file_name', 'file_path']],
    'users' => ['table' => 'users', 'public' => false, 'required' => ['name', 'email', 'role', 'status']],
    'payments' => ['table' => 'interac_transactions', 'public_read' => false, 'public_write' => true, 'required' => ['customer_name', 'customer_email', 'amount']],
];

function resource_config(string $resource): array
{
    if (!isset(RESOURCE_MAP[$resource])) {
        fail('Ressource introuvable.', 404);
    }
    return RESOURCE_MAP[$resource];
}

function require_resource_auth(array $config, string $method): void
{
    if ($method === 'GET' && !($config['public_read'] ?? false)) {
        require_auth();
    }
    if ($method === 'POST' && !($config['public_write'] ?? false)) {
        require_auth();
    }
    if (in_array($method, ['PUT', 'PATCH', 'DELETE'], true)) {
        require_auth();
    }
}

function require_users_admin(?int $targetId = null): array
{
    $payload = require_auth();
    $isAdmin = ($payload['role'] ?? '') === 'admin';
    // Seul l'administrateur gere les acces. Un utilisateur connecte peut
    // uniquement consulter son propre profil (GET /users/{id}).
    if ($isAdmin) {
        return $payload;
    }
    $method = request_method();
    if ($method === 'GET' && $targetId !== null && (int) ($payload['sub'] ?? 0) === $targetId) {
        return $payload;
    }
    fail("Gestion des acces reservee a l'administrateur.", 403);
    return $payload;
}

function sanitize_input(array $data): array
{
    $skip = ['password', 'current_password', 'new_password', 'password_hash'];
    $out = [];
    foreach ($data as $key => $value) {
        if (is_string($value) && !in_array($key, $skip, true)) {
            $out[$key] = clean_string($value);
        } else {
            $out[$key] = $value;
        }
    }
    return $out;
}

function list_resource(string $resource): void
{
    $config = resource_config($resource);
    $table = $config['table'];

    if ($resource === 'users') {
        require_users_admin();
    }

    try {
        if ($resource === 'users') {
            $stmt = db()->query("SELECT id, name, email, role, avatar, status, created_at, updated_at FROM users ORDER BY id DESC LIMIT 100");
            ok($stmt->fetchAll());
        }

        $stmt = db()->query("SELECT * FROM `$table` ORDER BY id DESC LIMIT 100");
        ok($stmt->fetchAll());
    } catch (PDOException $e) {
        error_log('[2JK API] list_resource(' . $resource . ') impossible: ' . $e->getMessage());
        fail('Table "' . $table . '" inaccessible. Importez le fichier SQL correspondant (database/nettoyage.sql + api/config/migrations/005_applications.sql + 006_job_offers.sql).', 503);
    }
}

function get_resource(string $resource, int $id): void
{
    $config = resource_config($resource);
    $table = $config['table'];
    if ($resource === 'users') {
        require_users_admin($id);
    }
    try {
        $stmt = db()->prepare("SELECT * FROM `$table` WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch();
    } catch (PDOException $e) {
        error_log('[2JK API] get_resource(' . $resource . ') impossible: ' . $e->getMessage());
        fail('Table "' . $table . '" inaccessible.', 503);
    }
    if (!$item) {
        fail('Element introuvable.', 404);
    }
    if ($resource === 'users') {
        unset($item['password_hash']);
    }
    ok($item);
}

function prepare_user_payload(array $data, bool $creating): array
{
    if (isset($data['email'])) {
        $errors = validate_email_field($data);
        if ($errors) {
            fail('Validation echouee.', 422, $errors);
        }
    }

    $password = trim((string) ($data['password'] ?? ''));
    unset($data['password'], $data['password_hash']);

    if ($creating && strlen($password) < 8) {
        fail('Le mot de passe doit contenir au moins 8 caracteres.', 422);
    }

    if ($password !== '') {
        if (strlen($password) < 8) {
            fail('Le mot de passe doit contenir au moins 8 caracteres.', 422);
        }
        $data['password_hash'] = password_hash($password, PASSWORD_DEFAULT);
    }

    return $data;
}

function slugify_resource(string $value): string
{
    $value = strtolower(trim($value));
    $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) ?: $value;
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    return trim($value, '-');
}

function create_resource(string $resource): void
{
    $config = resource_config($resource);
    if ($resource === 'users') {
        require_users_admin();
    }
    $data = sanitize_input(json_input());
    if ($resource === 'job-offers') {
        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = slugify_resource((string) $data['title']);
        }
        if (!isset($data['status']) || $data['status'] === '') {
            $data['status'] = 'active';
        }
    }
    if ($resource === 'testimonials' && request_method() === 'POST' && !bearer_token()) {
        $data['status'] = 'pending';
    }
    if ($resource === 'payments') {
        $data['reference'] = $data['reference'] ?? ('2JK-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8)));
        $data['order_reference'] = $data['order_reference'] ?? $data['reference'];
        $data['currency'] = $data['currency'] ?? 'CAD';
        $data['status'] = 'awaiting_payment';
        $data['mode'] = $data['mode'] ?? 'TEST';
        $data['customer_notified'] = 1;
    }
    if ($resource === 'gallery') {
        if (empty($data['image'])) {
            $data['image'] = !empty($data['after_image']) ? $data['after_image'] : (!empty($data['before_image']) ? $data['before_image'] : 'uploads/media/default.jpg');
        }
        if (isset($data['is_before_after'])) {
            $data['is_before_after'] = (int) $data['is_before_after'];
        }
    }
    // NOTE: la creation des rendez-vous passe par create_appointment() (voir api/index.php),
    // pas par create_resource(). Aucune validation de creneau ici (evite reference a $id indefini).
    if ($resource === 'applications') {
        if (!empty($data['adresse']) || !empty($data['code_postal'])) {
            $parts = array_filter([$data['adresse'] ?? '', $data['ville'] ?? '', $data['code_postal'] ?? '']);
            $data['ville'] = implode(', ', $parts);
            unset($data['adresse'], $data['code_postal']);
        }
    }
    $errors = validate_required($data, $config['required']);
    if (isset($data['email']) && $resource !== 'users') {
        $errors = array_merge($errors, validate_email_field($data));
    }
    if ($errors) {
        fail('Validation echouee.', 422, $errors);
    }
    if ($resource === 'users') {
        $data = prepare_user_payload($data, true);
    }
    $table = $config['table'];

    // Only keep columns that actually exist in the target table
    try {
        $existingCols = db()->query("SHOW COLUMNS FROM `$table`")->fetchAll(PDO::FETCH_COLUMN);
    } catch (PDOException $e) {
        error_log('[2JK API] create_resource(' . $resource . ') show columns error: ' . $e->getMessage());
        fail('Table "' . $table . '" inaccessible.', 503);
    }

    $validData = [];
    foreach ($data as $col => $val) {
        if (in_array($col, $existingCols, true) && $col !== 'id') {
            $validData[$col] = $val;
        }
    }

    if (empty($validData)) {
        fail('Aucune colonne valide pour cette table.', 422);
    }

    $columns = array_keys($validData);
    $placeholders = array_fill(0, count($columns), '?');
    $sql = "INSERT INTO `$table` (`" . implode('`,`', $columns) . "`) VALUES (" . implode(',', $placeholders) . ")";
    try {
        db()->prepare($sql)->execute(array_values($validData));
    } catch (PDOException $e) {
        error_log('[2JK API] create_resource(' . $resource . ') impossible: ' . $e->getMessage());
        fail('Creation impossible : ' . $e->getMessage(), 500);
    }
    $created = ['id' => (int) db()->lastInsertId()];
    if ($resource === 'payments') {
        $created['reference'] = $data['reference'] ?? null;
    }
    ok($created, 'Creation reussie.');
}

function update_resource(string $resource, int $id): void
{
    $config = resource_config($resource);
    if ($resource === 'users') {
        require_users_admin($id);
    }
    $data = sanitize_input(json_input());
    if (!$data) {
        fail('Aucune donnee a modifier.', 422);
    }
    if ($resource === 'users') {
        $data = prepare_user_payload($data, false);
    }
    if ($resource === 'gallery') {
        if (isset($data['is_before_after'])) {
            $data['is_before_after'] = (int) $data['is_before_after'];
        }
        if (isset($data['after_image']) && empty($data['image'])) {
            $data['image'] = $data['after_image'];
        }
    }
    if (!$data) {
        ok(null, 'Aucune modification.');
    }
    $table = $config['table'];
    try {
        $cols = db()->query("SHOW COLUMNS FROM `$table`")->fetchAll();
        $existingCols = [];
        $hasUpdatedAt = false;
        foreach ($cols as $col) {
            $colName = $col['Field'] ?? '';
            $existingCols[] = $colName;
            if ($colName === 'updated_at') {
                $hasUpdatedAt = true;
            }
        }

        $validData = [];
        foreach ($data as $col => $val) {
            if (in_array($col, $existingCols, true) && !in_array($col, ['id', 'created_at', 'updated_at'], true)) {
                $validData[$col] = $val;
            }
        }

        if (empty($validData)) {
            ok(null, 'Aucune modification appliquee.');
            return;
        }

        $sets = array_map(fn($col) => "`$col` = ?", array_keys($validData));
        $values = array_values($validData);
        $values[] = $id;
        $suffix = $hasUpdatedAt ? ", updated_at = NOW()" : "";
        db()->prepare("UPDATE `$table` SET " . implode(',', $sets) . $suffix . " WHERE id = ?")->execute($values);
    } catch (PDOException $e) {
        error_log('[2JK API] update_resource(' . $resource . ') impossible: ' . $e->getMessage());
        fail('Modification impossible : ' . $e->getMessage(), 500);
    }
    ok(null, 'Modification reussie.');
}

function delete_resource(string $resource, int $id): void
{
    $config = resource_config($resource);
    $table = $config['table'];
    if ($resource === 'users') {
        $payload = require_users_admin($id);
        // L'administrateur ne peut pas supprimer son propre compte.
        if ((int) ($payload['sub'] ?? 0) === $id) {
            fail('Vous ne pouvez pas supprimer votre propre compte administrateur.', 422);
        }
    }
    try {
        db()->prepare("DELETE FROM `$table` WHERE id = ?")->execute([$id]);
    } catch (PDOException $e) {
        error_log('[2JK API] delete_resource(' . $resource . ') impossible: ' . $e->getMessage());
        fail('Suppression impossible : table manquante.', 503);
    }
    ok(null, 'Suppression reussie.');
}
