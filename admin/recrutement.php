<?php
// FICHIER LEGACY NEUTRALISE (backup Next.js migration 2026-09-14)
// Contenu d'origine sauvegarde : voir admin/recrutement.php.bak (a creer via renommage manuel si besoin)
// Chemin canonique : frontend-nextjs/app/admin/modules/recrutement/page.tsx
http_response_code(410);
echo 'Legacy neutralise. Utilisez /admin/modules/recrutement (Next.js).';
exit;
// 2JK Services — Admin RH : candidatures recrutement (additif).
// Proteger avec votre auth admin existante : require votre_auth_admin.php ici.
// URL : /admin/recrutement.php
// require_once __DIR__.'/../votre_auth_admin.php'; // <-- decommenter + adapter
function rh_e($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function rh_env($k,$d=''){ $v=getenv($k); if($v!==false&&$v!=='')return $v; return $d; }
$pdo=null;
try{
  $dsn=rh_env('DB_DSN',''); $u=rh_env('DB_USER',''); $p=rh_env('DB_PASS','');
  if($dsn!=='') $pdo=new PDO($dsn,$u,$p,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
}catch(Throwable $e){ $pdo=null; }
$msg='';
$STATUTS=['nouveau','contacte','entretien','accepte','refuse'];
if($_SERVER['REQUEST_METHOD']==='POST'&&$pdo){
  $id=(int)($_POST['id']??0); $act=trim($_POST['action']??'');
  try{
    if($id>0&&in_array($act,$STATUTS,true)){
      $st=$pdo->prepare("UPDATE recrutement_candidatures SET status=? WHERE id=?");
      $st->execute([$act,$id]); $msg="Candidature #$id -> $act";
    }elseif($id>0&&$act==='delete'){
      $st=$pdo->prepare("SELECT cv_file FROM recrutement_candidatures WHERE id=?");
      $st->execute([$id]); $r=$st->fetch(PDO::FETCH_ASSOC);
      $pdo->prepare("DELETE FROM recrutement_candidatures WHERE id=?")->execute([$id]);
      if($r&&!empty($r['cv_file'])) @unlink(__DIR__.'/../uploads/cv/'.$r['cv_file']);
      $msg="Candidature #$id supprimee.";
    }
  }catch(Throwable $e){ $msg="Erreur base de donnees."; }
}
$filtreStatut=trim($_GET['statut']??''); $filtrePoste=trim($_GET['poste']??''); $q=trim($_GET['q']??'');
$rows=[];
if($pdo){
  try{
    $sql="SELECT id,fullname,email,phone,poste,ville,dispo,message,cv_file,status,created_at FROM recrutement_candidatures WHERE 1=1";
    $params=[];
    if($filtreStatut!==''&&in_array($filtreStatut,$STATUTS,true)){ $sql.=" AND status=?"; $params[]=$filtreStatut; }
    if($filtrePoste!==''){ $sql.=" AND poste=?"; $params[]=$filtrePoste; }
    if($q!==''){ $sql.=" AND (fullname LIKE ? OR email LIKE ? OR phone LIKE ?)"; $params[]="%$q%"; $params[]="%$q%"; $params[]="%$q%"; }
    $sql.=" ORDER BY created_at DESC LIMIT 300";
    $st=$pdo->prepare($sql); $st->execute($params); $rows=$st->fetchAll(PDO::FETCH_ASSOC);
    $postes=$pdo->query("SELECT DISTINCT poste FROM recrutement_candidatures ORDER BY poste")->fetchAll(PDO::FETCH_COLUMN);
    $counts=$pdo->query("SELECT status,COUNT(*) c FROM recrutement_candidatures GROUP BY status")->fetchAll(PDO::FETCH_KEY_PAIR);
  }catch(Throwable $e){ $rows=[]; $postes=[]; $counts=[]; }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Admin RH - Candidatures - 2JK Services</title>
<link rel="stylesheet" href="../assets/css/interac.css" />
<link rel="stylesheet" href="../assets/css/recrutement.css" />
<link rel="stylesheet" href="../assets/css/recrutement-admin.css" />
</head>
<body>
<header class="rec-nav"><div class="rec-nav-inner">
<a href="../recrutement.php" class="rec-brand">2JK <span>RH</span></a>
<nav class="rec-links open">
<a href="recrutement.php" class="active">Candidatures</a>
<a href="../recrutement.php">Voir le site</a>
</nav>
</div></header>
<main class="rh-wrap">
<h1>Candidatures recrutement</h1>
<?php if($msg): ?><p class="interac-success"><?php echo rh_e($msg); ?></p><?php endif; ?>
<?php if(!$pdo): ?>
<p class="interac-note">BDD non configuree. Importez <code>database/recrutement.sql</code> puis renseignez <code>DB_DSN / DB_USER / DB_PASS</code> dans <code>.env</code>.</p>
<?php else: ?>
<div class="rh-stats">
<?php foreach($STATUTS as $s): ?><span class="rh-chip st-<?php echo $s; ?>"><?php echo $s; ?> : <?php echo (int)($counts[$s]??0); ?></span><?php endforeach; ?>
<span class="rh-chip">Total : <?php echo count($rows); ?></span>
</div>
<form class="rh-filters" method="get">
<select name="statut"><option value="">Tous statuts</option>
<?php foreach($STATUTS as $s): ?><option value="<?php echo $s; ?>" <?php echo $filtreStatut===$s?'selected':''; ?>><?php echo $s; ?></option><?php endforeach; ?>
</select>
<select name="poste"><option value="">Tous postes</option>
<?php foreach(($postes??[]) as $p): ?><option <?php echo $filtrePoste===$p?'selected':''; ?>><?php echo rh_e($p); ?></option><?php endforeach; ?>
</select>
<input name="q" value="<?php echo rh_e($q); ?>" placeholder="Nom, email, tel..." />
<button class="btn-interac" type="submit">Filtrer</button>
<a class="rh-reset" href="recrutement.php">Reset</a>
</form>
<?php if(empty($rows)): ?><p>Aucune candidature.</p><?php else: ?>
<div class="interac-table-wrap"><table class="interac-table">
<thead><tr><th>#</th><th>Candidat</th><th>Poste</th><th>Dispo / Ville</th><th>Message</th><th>CV</th><th>Statut</th><th>Action</th></tr></thead>
<tbody>
<?php foreach($rows as $r): ?>
<tr>
<td><?php echo (int)$r['id']; ?><br /><small><?php echo rh_e($r['created_at']); ?></small></td>
<td><strong><?php echo rh_e($r['fullname']); ?></strong><br /><a href="mailto:<?php echo rh_e($r['email']); ?>"><?php echo rh_e($r['email']); ?></a><br /><?php echo rh_e($r['phone']); ?></td>
<td><?php echo rh_e($r['poste']); ?></td>
<td><?php echo rh_e($r['dispo']?:'-'); ?><br /><?php echo rh_e($r['ville']?:'-'); ?></td>
<td class="rh-msg"><?php echo nl2br(rh_e($r['message']??'')); ?></td>
<td><?php if(!empty($r['cv_file'])): ?><a target="_blank" href="../uploads/cv/<?php echo rh_e($r['cv_file']); ?>">Voir CV</a><?php else: ?>-<?php endif; ?></td>
<td><span class="rh-chip st-<?php echo rh_e($r['status']); ?>"><?php echo rh_e($r['status']); ?></span></td>
<td><form method="post" class="rh-actions"><input type="hidden" name="id" value="<?php echo (int)$r['id']; ?>" /><select name="action"><?php foreach($STATUTS as $s): ?><option value="<?php echo $s; ?>"><?php echo $s; ?></option><?php endforeach; ?></select><button type="submit">OK</button></form></td>
</tr>
<?php endforeach; ?>
</tbody>
</table></div>
<?php endif; ?>
<?php endif; ?>
</main>
</body>
</html>

