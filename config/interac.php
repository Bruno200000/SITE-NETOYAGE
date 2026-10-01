<?php
/**
 * 2JK Services - Configuration Interac e-Transfer
 * Ne casse rien : fichier 100% additif, à inclure via require_once.
 * Secrets lus depuis variables d'environnement / .env (jamais en dur).
 */

function interac_env($key, $default = '') {
    $v = getenv($key);
    if ($v !== false && $v !== '') return $v;
    if (isset($_ENV[$key])) return $_ENV[$key];
    if (isset($_SERVER[$key])) return $_SERVER[$key];
    // Fallback: lecture simple du fichier .env à la racine (sans dépendance)
    static $dotenv = null;
    if ($dotenv === null) {
        $dotenv = [];
        $envFile = dirname(__DIR__) . '/.env';
        if (is_readable($envFile)) {
            foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $line = trim($line);
                if ($line === '' || $line[0] === '#') continue;
                $pos = strpos($line, '=');
                if ($pos === false) continue;
                $k = trim(substr($line, 0, $pos));
                $val = trim(substr($line, $pos + 1), " \t\"'");
                $dotenv[$k] = $val;
            }
        }
    }
    return $dotenv[$key] ?? $default;
}

function interac_config() {
    $mode = strtoupper(interac_env('INTERAC_MODE', 'TEST'));
    if (!in_array($mode, ['TEST', 'PRODUCTION'], true)) $mode = 'TEST';
    return [
        'mode'          => $mode,                       // TEST | PRODUCTION
        'is_live'       => $mode === 'PRODUCTION',
        'payee_name'    => interac_env('INTERAC_PAYEE_NAME', '2JK Services'),
        'payee_email'   => interac_env('INTERAC_PAYEE_EMAIL', '2jkservicesinc@gmail.com'),
        'currency'      => interac_env('INTERAC_DEFAULT_CURRENCY', 'CAD'),
        'webhook_secret'=> interac_env('INTERAC_WEBHOOK_SECRET', ''),
        // À renseigner quand le PSP / la banque fournira l'API (laisser vide en attendant) :
        'api_base_url'  => rtrim(interac_env('INTERAC_API_BASE_URL', ''), '/'),
        'api_key'       => interac_env('INTERAC_API_KEY', ''),
        'api_secret'    => interac_env('INTERAC_API_SECRET', ''),
        'merchant_id'   => interac_env('INTERAC_MERCHANT_ID', ''),
    ];
}
