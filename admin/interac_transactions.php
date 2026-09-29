<?php
/**
 * 2JK Services — Admin : transactions Interac e-Transfer
 * Page autonome (responsive) à protéger avec votre système d'auth admin existant :
 *   require_once votre_auth_admin.php; // doit bloquer si non-admin
 *   require_once __DIR__ . '/../includes/interac.php';
 *   include __DIR__ . '/interac_transactions.php';
 *
 * Actions admin : marquer paid / failed / cancelled (paid = confirmation manuelle après vérification bancaire).
 */
if (!function_exists('interac_config')) require_once dirname(__DIR__) . '/includes/interac.php';

$pdo = $pdo ?? null;
try {
    if ($pdo === null) {
        $dsn = interac_env('DB_DSN', ''); $u = interac_env('DB_USER', ''); $p = interac_env('DB_PASS', '');
        if ($dsn !== '') $pdo = new PDO($dsn, $u, $p, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    }
} catch (Throwable $e) { $pdo = null; }

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $pdo) {
    $ref = trim($_POST['reference'] ?? '');
    $act = trim($_POST['action'] ?? '');
    if ($ref !== '' && in_array($act, ['paid', 'failed', 'cancelled'], true)) {
        try {
            $st = $pdo->prepare("SELECT status FROM interac_transactions WHERE `reference`=?");
            $st->execute([$ref]); $row = $st->fetch(PDO::FETCH_ASSOC);
            if ($row && in_array($row['status'], ['pending', 'awaiting_payment'], true)) {
                $paidAt = $act === 'paid' ? date('Y-m-d H:i:s') : null;
                $up = $pdo->prepare("UPDATE interac_transactions SET status=?, paid_at=COALESCE(?, paid_at) WHERE `reference`=?");
                $up->execute([$act, $paidAt, $ref]);
                $msg = "Transaction $ref → " . interac_status_label($act);
            } else { $msg = "Transition refusée (statut actuel : " . ($row['status'] ?? 'introuvable') . ")."; }
        } catch (Throwable $e) { $msg = "Erreur base de données."; }
    }
}

$rows = [];
if ($pdo) {
    try { $rows = $pdo->query("SELECT `reference`, order_reference, amount, currency, status, mode, customer_notified, paid_at, created_at FROM interac_transactions ORDER BY created_at DESC LIMIT 200")->fetchAll(PDO::FETCH_ASSOC); }
    catch (Throwable $e) { $rows = []; }
}
?>
<div class="interac-admin">
  <h2>Transactions Interac e-Transfer</h2>
  <?php if ($msg): ?><p class="interac-msg"><?= htmlspecialchars($msg, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?>
  <?php if (!$pdo): ?>
    <p class="interac-note">Base de données non configurée (DB_DSN manquant). Exécutez <code>database/interac_transactions.sql</code> puis renseignez <code>DB_DSN / DB_USER / DB_PASS</code> dans <code>.env</code>.</p>
  <?php elseif (empty($rows)): ?>
    <p>Aucune transaction Interac pour le moment.</p>
  <?php else: ?>
  <div class="interac-table-wrap">
  <table class="interac-table">
    <thead><tr><th>Référence</th><th>Commande</th><th>Montant</th><th>Statut</th><th>Mode</th><th>Notifié</th><th>Payé le</th><th>Actions</th></tr></thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><code><?= htmlspecialchars($r['reference'], ENT_QUOTES, 'UTF-8') ?></code></td>
        <td><?= htmlspecialchars($r['order_reference'], ENT_QUOTES, 'UTF-8') ?></td>
        <td><?= htmlspecialchars(interac_format_cad($r['amount']), ENT_QUOTES, 'UTF-8') ?></td>
        <td><span class="interac-status status-<?= htmlspecialchars($r['status'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars(interac_status_label($r['status']), ENT_QUOTES, 'UTF-8') ?></span></td>
        <td><?= htmlspecialchars($r['mode'], ENT_QUOTES, 'UTF-8') ?></td>
        <td><?= $r['customer_notified'] ? 'Oui' : 'Non' ?></td>
        <td><?= htmlspecialchars($r['paid_at'] ?? '—', ENT_QUOTES, 'UTF-8') ?></td>
        <td>
          <?php if (in_array($r['status'], ['pending', 'awaiting_payment'], true)): ?>
          <form method="post" class="interac-actions">
            <input type="hidden" name="reference" value="<?= htmlspecialchars($r['reference'], ENT_QUOTES, 'UTF-8') ?>" />
            <button name="action" value="paid" title="Confirmer après vérification bancaire">✔ Payé</button>
            <button name="action" value="failed" title="Marquer échoué">✖ Échoué</button>
            <button name="action" value="cancelled" title="Annuler">⛔ Annulé</button>
          </form>
          <?php else: ?><em>Final</em><?php endif; ?>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
  <?php endif; ?>
</div>
