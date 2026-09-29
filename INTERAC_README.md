# 2JK Services — Interac e-Transfer : guide d'activation (TEST → PRODUCTION)

Aucune API Interac officielle n'est configurée pour l'instant : **rien n'a été inventé**.
Le site fonctionne en **MODE TEST** (instructions + référence unique + statuts + admin + webhook prêt).

## Fichiers ajoutés (100 % additifs, existant intact)
- `config/interac.php` — lit `.env` (mode, bénéficiaire, secrets).
- `includes/interac.php` — référence unique, statuts, instructions CAD, vérif HMAC webhook.
- `checkout/interac_option.php` — à inclure dans votre checkout existant.
- `webhook/interac_webhook.php` — confirme `paid` uniquement via signature HMAC.
- `admin/interac_transactions.php` — liste + validation manuelle (à protéger par votre auth admin).
- `database/interac_transactions.sql` — table dédiée.
- `assets/css/interac.css` — responsive.
- `.env.interac.example` — modèle de variables.

## Intégration checkout (2 lignes, sans casser l'existant)
1. `<link rel="stylesheet" href="/assets/css/interac.css">` dans le `<head>`.
2. Dans votre page checkout (où `$orderRef`, `$amount`, `$pdo` existent) :
```php
<?php require_once __DIR__ . '/includes/interac.php'; ?>
<?php $orderRef = $order['reference']; $amount = $order['total']; /* vos variables */ ?>
<?php include __DIR__ . '/checkout/interac_option.php'; ?>
```

## Webhook sécurisé
- URL : `https://votre-domaine/webhook/interac_webhook.php`
- Header : `X-Interac-Signature: HMAC-SHA256(corps_brut, INTERAC_WEBHOOK_SECRET)`
- Body : `{"reference":"2JK-...","status":"paid|failed|cancelled","psp_reference":"..."}`
- Seuls `paid|failed|cancelled` via webhook/admin. Le bouton client « J'ai effectué le paiement » → `awaiting_payment` uniquement, jamais `paid`.
- Test local (PowerShell) :
```powershell
$body='{"reference":"2JK-20260914-XXXXXX","status":"paid"}'
$hmac=(python -c "import hmac,hashlib;print(hmac.new(b'VOTRE_SECRET',open(0,'rb').read(),hashlib.sha256).hexdigest())" < $body)
```

## Ce qui manque pour la PRODUCTION (à obtenir auprès de votre banque / PSP canadien)
Interac ne fournit pas d'API publique directe aux marchands : vous devez passer par un PSP ou votre banque
(ex. Stripe avec méthode Interac au Canada, Bambora/Worldline, Moneris, Desjardins, RBC, TD, BMO, Scotia).
1. Obtenir : `INTERAC_API_BASE_URL`, `INTERAC_API_KEY`, `INTERAC_API_SECRET`, `INTERAC_MERCHANT_ID`, URL webhook PSP.
2. Renseigner dans `.env` + `INTERAC_MODE=PRODUCTION`.
3. Déclarer l'URL webhook ci-dessus côté PSP + coller leur secret dans `INTERAC_WEBHOOK_SECRET`.
4. Tester un virement réel de 1,00 $ CAD, vérifier le passage à `paid` + `paid_at` rempli.
5. Activer la validation manuelle admin comme filet de sécurité (vérification du relevé bancaire avec la référence).

## Sécurité
- Secrets uniquement dans `.env` (jamais en dur / jamais dans Git).
- Webhook HMAC temps-constant, transitions strictes, `paid` final et idempotent.
- Page admin à placer derrière votre authentification existante.
