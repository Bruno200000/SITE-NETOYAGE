<?php

function validate_required(array $data, array $fields): array
{
    $errors = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
            $errors[$field][] = 'Ce champ est requis.';
        }
    }
    return $errors;
}

function validate_email_field(array $data, string $field = 'email'): array
{
    if (isset($data[$field]) && !filter_var($data[$field], FILTER_VALIDATE_EMAIL)) {
        return [$field => ['Email invalide.']];
    }
    return [];
}
