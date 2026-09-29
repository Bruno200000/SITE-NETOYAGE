<?php

function env_value(string $key, ?string $default = null): ?string
{
    static $loaded = false;
    if (!$loaded) {
        $path = __DIR__ . '/../.env';
        if (is_file($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if (is_array($lines)) {
                foreach ($lines as $line) {
                    $line = trim((string) $line);
                    if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
                        continue;
                    }
                    [$name, $value] = array_map('trim', explode('=', $line, 2));
                    if ($name !== '') {
                        $_ENV[$name] = trim($value, " \t\"'");
                    }
                }
            }
        }
        $loaded = true;
    }
    $stored = $_ENV[$key] ?? null;
    if ($stored !== null && $stored !== '') {
        return $stored;
    }
    $env = getenv($key);
    if ($env !== false && $env !== '') {
        return $env;
    }
    return $default;
}
