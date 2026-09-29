<?php

function json_response(bool $success, string $message, mixed $data = null, int $status = 200, array $errors = []): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'errors' => $errors ?: null,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ok(mixed $data = null, string $message = 'OK'): void
{
    json_response(true, $message, $data);
}

function fail(string $message, int $status = 400, array $errors = []): void
{
    json_response(false, $message, null, $status, $errors);
}
