<?php
/**
 * 2JK Services - Librairie Interac e-Transfer (PHP natif, additif)
 * Usage: require_once __DIR__ . '/../config/interac.php'; require_once __DIR__ . '/interac.php';
 */

require_once dirname(__DIR__) . '/config/interac.php';

// Statuts officiels demandés
const INTERAC_STATUSES = ['pending', 'awaiting_payment', 'paid', 'failed', 'cancelled'];
const INTERAC_STATUS_LABELS = [
    'pending'          => 'En attente',
    'awaiting_payment' => 'En attente de paiement',
    'paid'             => 'Payé',
    'failed'           => 'Échoué',
    'cancelled'        => 'Annulé',
];

/** Génère une référence unique par transaction : ex. 2JK-20260914-A3F9K2 */
function interac_generate_reference($orderId = null) {
    $date = date('Ymd');
    $rand = strtoupper(substr(bin2hex(random_bytes(3)), 0, 6)); // 6 chars
    $ref = sprintf('2JK-%s-%s', $date, $rand);
    if ($orderId !== null && $orderId !== '') $ref .= '-' . preg_replace('/[^A-Za-z0-9]/', '', (string)$orderId);
    return $ref;
}

function interac_is_valid_status($s) { return in_array($s, INTERAC_STATUSES, true); }

function interac_status_label($s) { return INTERAC_STATUS_LABELS[$s] ?? $s; }

/** Montant formaté en CAD (fr-CA) */
function interac_format_cad($amount) {
    $n = (float)$amount;
    return number_format($n, 2, ',', ' ') . ' $ CAD';
}

/** Instructions de paiement (variables injectées, design neutre qui hérite du site) */
function interac_payment_instructions_html($amount, $reference, $orderRef = '') {
    $cfg = interac_config();
    $payee = htmlspecialchars($cfg['payee_name'], ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($cfg['payee_email'], ENT_QUOTES, 'UTF-8');
    $amt   = htmlspecialchars(interac_format_cad($amount), ENT_QUOTES, 'UTF-8');
    $ref   = htmlspecialchars($reference, ENT_QUOTES, 'UTF-8');
    $ord   = htmlspecialchars($orderRef, ENT_QUOTES, 'UTF-8');
    $mode  = $cfg['mode'];
    $badge = $mode === 'TEST'
        ? '<span class="interac-badge interac-badge-test">MODE TEST — aucun transfert réel requis</span>'
        : '<span class="interac-badge interac-badge-live">MODE PRODUCTION</span>';
    return <<<HTML
<div class="interac-instructions" role="region" aria-label="Instructions Interac e-Transfer">
  <div class="interac-head">
    <span class="interac-logo" aria-hidden="true">Interac <strong>e-Transfer</strong></span>
    {$badge}
  </div>
  <ol class="interac-steps">
    <li>Ouvrez votre application bancaire et choisissez <strong>Interac e-Transfer / Virement Interac</strong>.</li>
    <li>Envoyez <strong>{$amt}</strong> à <strong>{$payee}</strong> — <strong>{$email}</strong>.</li>
    <li>Dans le champ <strong>message / référence</strong>, inscrivez exactement : <code class="interac-ref">{$ref}</code></li>
  </ol>
  <dl class="interac-details">
    <div><dt>Montant à envoyer</dt><dd>{$amt}</dd></div>
    <div><dt>Référence de transaction</dt><dd><code class="interac-ref">{$ref}</code></dd></div>
    <div><dt>Commande</dt><dd>{$ord}</dd></div>
    <div><dt>Destinataire</dt><dd>{$payee} ({$email})</dd></div>
  </dl>
  <p class="interac-note">⚠️ Ne cliquez sur « J'ai effectué le paiement » qu'après avoir envoyé le virement. Votre commande reste <strong>en attente de paiement</strong> et ne passera à <strong>Payé</strong> qu'après confirmation (webhook PSP/banque ou validation manuelle dans l'admin). Cliquer sur le bouton ne marque jamais le paiement comme payé.</p>
</div>
HTML;
}

/** Vérifie la signature HMAC du webhook : header X-Interac-Signature = HMAC-SHA256(raw_body, webhook_secret) */
function interac_verify_webhook_signature($rawBody, $signatureHeader) {
    $cfg = interac_config();
    $secret = $cfg['webhook_secret'];
    if ($secret === '') return false;
    if (!is_string($signatureHeader) || $signatureHeader === '') return false;
    $expected = hash_hmac('sha256', $rawBody, $secret);
    return hash_equals($expected, strtolower(trim($signatureHeader)));
}
