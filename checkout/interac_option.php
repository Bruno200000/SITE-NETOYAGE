<?php
/**
 * 2JK Services — Bloc checkout Interac e-Transfer (PHP natif)
 * À INCLURE dans votre checkout existant sans le casser :
 *
 *   require_once __DIR__ . '/includes/interac.php';
 *   // $orderRef = 'CMD-...'; $amount = 149.99; // fournis par votre panier
 *   include __DIR__ . '/checkout/interac_option.php';
 *
 * Requiert une table interac_transactions (voir database/interac_transactions.sql).
 * Nécessite $pdo (PDO) si disponible ; sinon fonctionne en mode session (démo) sans casser le site.
 */

if (!function_exists('interac_config')) require_once dirname(__DIR__) . '/includes/interac.php';

$interacCfg  = interac_config();
$orderRef    = isset($orderRef) ? (string)$orderRef : ('CMD-' . date('Ymd-His'));
$amount      = isset($amount) ? (float)$amount : 0.00;
$selected    = ($_POST['payment_method'] ?? '') === 'interac';
$ackClicked  = ($_POST['interac_ack'] ?? '') === '1';

// Si le client sélectionne Interac + clique "J'ai effectué le paiement" :
// -> on passe en awaiting_payment UNIQUEMENT (jamais paid ici).
$interacRef = $_SESSION['interac_reference'] ?? null;
if ($selected && $interacRef === null) {
    $interacRef = interac_generate_reference($orderRef);
    $_SESSION['interac_reference'] = $interacRef;
    $_SESSION['interac_order'] = $orderRef;
    $_SESSION['interac_amount'] = $amount;
    try {
        if (isset($pdo) && $pdo instanceof PDO) {
            $st = $pdo->prepare("INSERT INTO interac_transactions (`reference`, order_reference, amount, currency, status, mode) VALUES (?, ?, ?, 'CAD', 'pending', ?)");
            $st->execute([$interacRef, $orderRef, $amount, $interacCfg['mode']]);
        }
    } catch (Throwable $e) { /* silencieux : ne casse pas le checkout */ }
}
if ($selected && $ackClicked && $interacRef) {
    $_SESSION['interac_notified'] = true;
    try {
        if (isset($pdo) && $pdo instanceof PDO) {
            $st = $pdo->prepare("UPDATE interac_transactions SET status='awaiting_payment', customer_notified=1 WHERE `reference`=? AND status='pending'");
            $st->execute([$interacRef]);
        }
    } catch (Throwable $e) {}
}
?>
<!-- Option de paiement : à placer dans votre liste de moyens de paiement existants -->
<label class="payment-option payment-option-interac">
  <input type="radio" name="payment_method" value="interac" <?= $selected ? 'checked' : '' ?> onchange="this.form.submit()" />
  <span class="payment-label"><strong>Interac e-Transfer</strong> <small>Virement bancaire (CAD)</small></span>
</label>

<?php if ($selected && $interacRef): ?>
  <?= interac_payment_instructions_html($amount, $interacRef, $orderRef) ?>
  <form method="post" class="interac-ack-form">
    <input type="hidden" name="payment_method" value="interac" />
    <input type="hidden" name="interac_ack" value="1" />
    <button type="submit" class="btn btn-interac">J'ai effectué le paiement</button>
    <?php if (!empty($_SESSION['interac_notified'])): ?>
      <p class="interac-success">Merci ! Nous avons bien noté votre virement (réf. <?= htmlspecialchars($interacRef, ENT_QUOTES, 'UTF-8') ?>). Statut : <strong>en attente de paiement</strong> — la confirmation se fera automatiquement ou par notre équipe.</p>
    <?php endif; ?>
  </form>
<?php endif; ?>
