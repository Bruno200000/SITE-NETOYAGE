<?php

function auth_login(): void
{
    $data = json_input();
    $errors = array_merge(validate_required($data, ['email', 'password']), validate_email_field($data));
    if ($errors) {
        fail('Validation échouée.', 422, $errors);
    }

    try {
        $stmt = db()->prepare('SELECT id, name, email, password_hash, role, status FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();
    } catch (PDOException $e) {
        error_log('[2JK API] auth_login requete impossible: ' . $e->getMessage());
        fail('Base de donnees inaccessible. Verifiez que MySQL est demarre et que la table "users" existe.', 503);
    }
    if (!$user || $user['status'] !== 'active' || !password_verify($data['password'], $user['password_hash'])) {
        fail('Identifiants invalides.', 401);
    }

    unset($user['password_hash']);
    $token = jwt_encode(['sub' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]);
    ok(['token' => $token, 'user' => $user], 'Connexion réussie.');
}

function auth_profile(): void
{
    $payload = require_auth();
    $stmt = db()->prepare('SELECT id, name, email, role, status, created_at FROM users WHERE id = ?');
    $stmt->execute([$payload['sub']]);
    ok($stmt->fetch());
}

function auth_update_password(): void
{
    $payload = require_auth();
    $data = json_input();
    $errors = validate_required($data, ['current_password', 'new_password']);
    if ($errors || strlen((string) ($data['new_password'] ?? '')) < 8) {
        fail('Mot de passe invalide.', 422, $errors);
    }
    $stmt = db()->prepare('SELECT password_hash FROM users WHERE id = ?');
    $stmt->execute([$payload['sub']]);
    $user = $stmt->fetch();
    if (!$user || !password_verify($data['current_password'], $user['password_hash'])) {
        fail('Mot de passe actuel incorrect.', 422);
    }
    $hash = password_hash($data['new_password'], PASSWORD_DEFAULT);
    db()->prepare('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?')->execute([$hash, $payload['sub']]);
    ok(null, 'Mot de passe modifié.');
}
