<?php
// Diagnostic 2JK Services — ouvrir dans le navigateur :
// http://localhost/SITE%20NETOYAGE/api/diag.php
// Ne modifie rien, affiche uniquement l'etat : PHP, .env, MySQL, tables, user admin.
header('Content-Type: application/json; charset=utf-8');

$result = [
    'php_version' => PHP_VERSION,
    'time' => date('c'),
    'checks' => [],
];

function diag_check(array &$result, string $name, bool $ok, string $detail = ''): void
{
    $result['checks'][] = ['name' => $name, 'ok' => $ok, 'detail' => $detail];
    if (!$ok) {
        $result['ok'] = false;
    }
}
$result['ok'] = true;

// 1. Fichiers requis
$required = ['core/response.php', 'core/request.php', 'core/jwt.php', 'config/database.php', 'config/env.php', 'helpers/validator.php', 'helpers/upload.php', 'controllers/AuthController.php', 'controllers/CrudController.php'];
foreach ($required as $file) {
    diag_check($result, 'file:' . $file, is_file(__DIR__ . '/' . $file), is_file(__DIR__ . '/' . $file) ? 'present' : 'MANQUANT: ' . $file);
}

// 2. .env
$envPath = __DIR__ . '/.env';
diag_check($result, 'env_file', is_file($envPath), is_file($envPath) ? $envPath : 'MANQUANT: copiez api/.env.example vers api/.env');
require_once __DIR__ . '/config/env.php';
diag_check($result, 'env:DB_HOST', (bool) env_value('DB_HOST', null), (string) env_value('DB_HOST', '(defaut: localhost)'));
diag_check($result, 'env:DB_NAME', (bool) env_value('DB_NAME', null), (string) env_value('DB_NAME', '(defaut: nettoyage_2jk)'));
diag_check($result, 'env:DB_USER', (bool) env_value('DB_USER', null), (string) env_value('DB_USER', '(defaut: root)'));
$jwt = env_value('JWT_SECRET', '');
diag_check($result, 'env:JWT_SECRET', is_string($jwt) && strlen($jwt) >= 16, strlen((string) $jwt) . ' caracteres (min 16 recommande)');

// 3. Extensions PHP
foreach (['pdo', 'pdo_mysql', 'json', 'mbstring'] as $ext) {
    diag_check($result, 'ext:' . $ext, extension_loaded($ext), extension_loaded($ext) ? 'chargee' : 'MANQUANTE: activez extension=' . $ext . ' dans php.ini');
}

// 4. Connexion MySQL
try {
    require_once __DIR__ . '/config/database.php';
    $pdo = db();
    diag_check($result, 'mysql_connect', true, 'connexion OK vers ' . env_value('DB_HOST', 'localhost') . ' / ' . env_value('DB_NAME', 'nettoyage_2jk'));
} catch (Throwable $e) {
    diag_check($result, 'mysql_connect', false, $e->getMessage() . ' => Demarrez MySQL dans XAMPP, verifiez DB_HOST/DB_NAME/DB_USER/DB_PASS dans api/.env');
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// 5. Tables
$tables = ['users', 'services', 'posts', 'gallery_images', 'testimonials', 'quotes', 'appointments', 'contact_messages', 'faqs', 'site_settings', 'notifications', 'applications', 'job_offers'];
try {
    $existing = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
} catch (Throwable $e) {
    $existing = [];
}
foreach ($tables as $table) {
    $found = in_array($table, (array) $existing, true);
    $hint = $found ? 'OK' : ('MANQUANTE: importez ' . ($table === 'applications' ? 'api/config/migrations/005_applications.sql' : ($table === 'job_offers' ? 'api/config/migrations/006_job_offers.sql' : 'database/nettoyage.sql')) . ' dans phpMyAdmin');
    diag_check($result, 'table:' . $table, $found, $hint);
}

// 6. Compte admin
try {
    $stmt = $pdo->prepare("SELECT id, name, email, role, status FROM users WHERE email = ? LIMIT 1");
    $stmt->execute(['admin@2jkservices.com']);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($admin) {
        diag_check($result, 'admin_user', ($admin['status'] ?? '') === 'active', 'trouve: ' . json_encode($admin, JSON_UNESCAPED_UNICODE) . ' (mot de passe initial: Admin@12345)');
    } else {
        diag_check($result, 'admin_user', false, 'AUCUN user admin@2jkservices.com => importez database/nettoyage.sql (il cree cet admin)');
    }
} catch (Throwable $e) {
    diag_check($result, 'admin_user', false, $e->getMessage());
}

http_response_code($result['ok'] ? 200 : 503);
echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
