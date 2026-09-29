<?php

require_once __DIR__ . '/../config/env.php';

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_encode(array $payload): string
{
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $payload['iat'] = time();
    $payload['exp'] = time() + 60 * 60 * 24;
    $secret = env_value('JWT_SECRET', 'local-secret');
    $segments = [
        base64url_encode(json_encode($header)),
        base64url_encode(json_encode($payload)),
    ];
    $signature = hash_hmac('sha256', implode('.', $segments), $secret, true);
    $segments[] = base64url_encode($signature);
    return implode('.', $segments);
}

function jwt_decode_token(string $token): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    [$header, $payload, $signature] = $parts;
    $secret = env_value('JWT_SECRET', 'local-secret');
    $expected = base64url_encode(hash_hmac('sha256', "$header.$payload", $secret, true));
    if (!hash_equals($expected, $signature)) {
        return null;
    }
    $data = json_decode(base64url_decode($payload), true);
    if (!is_array($data) || ($data['exp'] ?? 0) < time()) {
        return null;
    }
    return $data;
}

function bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? $_SERVER['Authorization']
        ?? '';

    if (!$header && function_exists('getallheaders')) {
        $headers = getallheaders();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (!$header && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
        return trim($matches[1]);
    }
    return null;
}

function require_auth(): array
{
    $token = bearer_token();
    $payload = $token ? jwt_decode_token($token) : null;
    if (!$payload) {
        fail('Authentification requise.', 401);
    }
    return $payload;
}

function require_admin(): array
{
    $payload = require_auth();
    if (($payload['role'] ?? '') !== 'admin') {
        fail("Acces reserve a l'administrateur.", 403);
    }
    return $payload;
}
