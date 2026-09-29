<?php

require_once __DIR__ . '/env.php';

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = env_value('DB_HOST', 'localhost');
    $name = env_value('DB_NAME', 'nettoyage_2jk');
    $user = env_value('DB_USER', 'root');
    $pass = env_value('DB_PASS', '');
    $dsn = "mysql:host={$host};dbname={$name};charset=utf8mb4";

    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e) {
        error_log('[2JK API] Connexion MySQL impossible: ' . $e->getMessage());
        http_response_code(503);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'message' => "Base de donnees inaccessible. Verifiez que MySQL est demarre dans XAMPP et que la base '{$name}' existe sur '{$host}'.",
            'data' => null,
            'errors' => null,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    return $pdo;
}
