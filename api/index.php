<?php

require_once __DIR__ . '/core/response.php';
require_once __DIR__ . '/core/request.php';
require_once __DIR__ . '/core/jwt.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers/validator.php';
require_once __DIR__ . '/helpers/upload.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/CrudController.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

if (request_method() === 'OPTIONS') {
    http_response_code(204);
    exit;
}

set_exception_handler(function (Throwable $e) {
    error_log($e->getMessage());
    fail('Erreur serveur.', 500);
});

$path = request_path();
$method = request_method();
$parts = $path === '' ? [] : explode('/', $path);

if ($path === '' || $path === 'health') {
    ok(['service' => '2JK Services API', 'version' => '1.0.0']);
}

if (($parts[0] ?? '') === 'auth') {
    if (($parts[1] ?? '') === 'login' && $method === 'POST') {
        auth_login();
    }
    if (($parts[1] ?? '') === 'profile' && $method === 'GET') {
        auth_profile();
    }
    if (($parts[1] ?? '') === 'password' && $method === 'PUT') {
        auth_update_password();
    }
    fail('Route auth introuvable.', 404);
}

if (($parts[0] ?? '') === 'upload' && $method === 'POST') {
    require_auth();
    $folder = $_POST['folder'] ?? 'media';
    $path = upload_image($_FILES['file'] ?? [], $folder);
    if (!$path) {
        fail('Aucune image recue.', 422);
    }
    ok(['path' => $path], 'Image televersee.');
}

if (($parts[0] ?? '') === 'upload-cv' && $method === 'POST') {
    $file = $_FILES['cv'] ?? $_FILES['file'] ?? null;
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        fail('Fichier CV introuvable ou erreur de téléversement.', 422);
    }
    $allowed = [
        'application/pdf' => 'pdf',
        'application/msword' => 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        'image/jpeg' => 'jpg',
        'image/png' => 'png'
    ];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']) ?: ($file['type'] ?? '');
    if (!isset($allowed[$mime]) || ($file['size'] ?? 0) > 10 * 1024 * 1024) {
        fail('Format de CV non accepté. Formats autorisés : PDF, Word (.doc, .docx), JPG, PNG (max 10 Mo).', 422);
    }
    $dir = __DIR__ . '/uploads/cv';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $ext = $allowed[$mime];
    $cleanName = 'cv_' . date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $cleanName)) {
        fail('Échec de la sauvegarde du fichier sur le serveur.', 500);
    }
    ok(['path' => 'uploads/cv/' . $cleanName, 'filename' => $cleanName], 'CV téléversé avec succès.');
}

$resource = $parts[0] ?? '';
$id = isset($parts[1]) && ctype_digit($parts[1]) ? (int) $parts[1] : null;
$config = resource_config($resource);
require_resource_auth($config, $method);

match ($method) {
    'GET' => $id ? get_resource($resource, $id) : list_resource($resource),
    'POST' => create_resource($resource),
    'PUT', 'PATCH' => $id ? update_resource($resource, $id) : fail('ID requis.', 422),
    'DELETE' => $id ? delete_resource($resource, $id) : fail('ID requis.', 422),
    default => fail('Méthode non supportée.', 405),
};
