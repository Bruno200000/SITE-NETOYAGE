<?php

function request_method(): string
{
    return $_SERVER['REQUEST_METHOD'] ?? 'GET';
}

function request_path(): string
{
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $path = rawurldecode($uri ?? '/');

    if (preg_match('#/api(?:/|$)(.*)$#', $path, $matches)) {
        $path = $matches[1] ?? '';
    }

    $path = trim($path, '/');
    if ($path === 'index.php') {
        return '';
    }
    if (str_starts_with($path, 'index.php/')) {
        return trim(substr($path, strlen('index.php/')), '/');
    }
    return $path;
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '[]', true);
    return is_array($data) ? $data : [];
}

function clean_string(?string $value): string
{
    return htmlspecialchars(trim((string) $value), ENT_QUOTES, 'UTF-8');
}
