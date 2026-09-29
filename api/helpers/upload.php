<?php

function upload_image(array $file, string $folder = 'media'): ?string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return null;
    }
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $mime = mime_content_type($file['tmp_name']);
    if (!isset($allowed[$mime]) || ($file['size'] ?? 0) > 5 * 1024 * 1024) {
        fail('Image invalide ou trop volumineuse.', 422);
    }
    $dir = __DIR__ . '/../uploads/' . preg_replace('/[^a-z0-9_-]/i', '', $folder);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $name = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
    move_uploaded_file($file['tmp_name'], $dir . '/' . $name);
    return 'uploads/' . $folder . '/' . $name;
}
