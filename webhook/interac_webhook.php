<?php
/**
 * 2JK Services — Webhook Interac e-Transfer
 * POST JSON : { "reference": "2JK-...", "status": "paid|failed|cancelled", "psp_reference": "..." }
 * Header requis : X-Interac-Signature = HMAC-SHA256(raw_body, INTERAC_WEBHOOK_SECRET)
 *
 * RÈGLES DE SÉCURITÉ :
 * - Secret obligatoire (sinon 503).
 * - Signature HMAC vérifiée en temps constant (sinon 401).
 * - Seul le webhook (ou l'admin) peut passer à paid — jamais le bouton client.
 * - Transition autorisée : pending/awaiting_payment -> paid|failed|cancelled. paid est final.
 * - Idempotent : rejouer le même webhook ne duplique rien.
 */

require_once __DIR__ . '/../includes/interac.php';
header('Content-Type: application/json; charset=utf-8');

$pdo = null;
try {
    // Connexion PDO optionnelle via variables d'environnement standard (ne casse rien si absente)
    $dsn = interac_env('DB_DSN', ''); $u = interac_env('DB_USER', ''); $p = interac_env('DB_PASS', '');
    if ($dsn !== '') { $pdo = new PDO($dsn, $u, $p, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]); }
} catch (Throwable $e) { $pdo = null; }

$raw = file_get_contents('php://input');
$sig = $_SERVER['HTTP_X_INTERAC_SIGNATURE'] ?? '';

if (interac_env('INTERAC_WEBHOOK_SECRET', '') === '') {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'webhook_secret_not_configured']);
    exit;
}
if (!interac_verify_webhook_signature($raw, $sig)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'invalid_signature']);
    exit;
}

$data = json_decode($raw, true);
$ref = trim($data['reference'] ?? '');
$newStatus = strtolower(trim($data['status'] ?? ''));
$allowedFinal = ['paid', 'failed', 'cancelled'];

if ($ref === '' || !in_array($newStatus, $allowedFinal, true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_payload', 'hint' => 'reference + status paid|failed|cancelled requis']);
    exit;
}
if ($pdo === null) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'db_not_configured', 'hint' => 'Configurez DB_DSN/DB_USER/DB_PASS']);
    exit;
}

try {
    $st = $pdo->prepare("SELECT status FROM interac_transactions WHERE `reference`=?");
    $st->execute([$ref]);
    $row = $st->fetch(PDO::FETCH_ASSOC);
    if (!$row) { http_response_code(404); echo json_encode(['ok' => false, 'error' => 'reference_not_found']); exit; }
    $current = $row['status'];
    if ($current === 'paid') { echo json_encode(['ok' => true, 'idempotent' => true, 'status' => 'paid']); exit; } // final
    if (!in_array($current, ['pending', 'awaiting_payment'], true)) {
        http_response_code(409);
        echo json_encode(['ok' => false, 'error' => 'invalid_transition', 'current' => $current]);
        exit;
    }
    $paidAt = $newStatus === 'paid' ? date('Y-m-d H:i:s') : null;
    $pspRef = substr(trim($data['psp_reference'] ?? ''), 0, 128);
    $up = $pdo->prepare("UPDATE interac_transactions SET status=?, paid_at=COALESCE(?, paid_at), webhook_payload=? WHERE `reference`=?");
    $up->execute([$newStatus, $paidAt, $raw, $ref]);
    // (Optionnel) log PSP dans une colonne dédiée si vous l'ajoutez plus tard.
    echo json_encode(['ok' => true, 'reference' => $ref, 'previous' => $current, 'status' => $newStatus]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'server_error']);
}
