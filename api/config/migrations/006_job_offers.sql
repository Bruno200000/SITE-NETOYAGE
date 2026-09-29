-- 2JK Services — Offres d'emploi (publiees par l'admin, postulees depuis /recrutement)
-- Compatible avec api/controllers/CrudController.php (ressource "job-offers")
CREATE TABLE IF NOT EXISTS job_offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  location VARCHAR(128) NULL,
  contract_type VARCHAR(64) NULL,
  salary VARCHAR(128) NULL,
  short_description VARCHAR(255) NULL,
  description MEDIUMTEXT NULL,
  requirements MEDIUMTEXT NULL,
  display_order INT NOT NULL DEFAULT 0,
  status VARCHAR(24) NOT NULL DEFAULT 'active',
  published_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_job_offers_status (status),
  INDEX idx_job_offers_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO job_offers (title, slug, location, contract_type, salary, short_description, description, requirements, display_order, status, published_at) VALUES
('Agent d''entretien residentiel', 'agent-entretien-residentiel', 'Montreal', 'Temps plein / partiel', 'A discuter', 'Menage de maisons et appartements.', 'Depoussierage, sols, salles de bain, cuisines. Formation fournie, equipement fourni.', 'Ponctuel, soigneux. Debutants motives acceptes.', 1, 'active', NOW()),
('Technicien nettoyage commercial', 'technicien-nettoyage-commercial', 'Montreal / Laval', 'Soir / nuit / week-end', 'Primes incluses', 'Bureaux, commerces, coproprietes.', 'Vitres, sols, sanitaires. Interventions en equipe, primes de performance.', 'Autonome, permis un plus. Experience appreciee mais non exigee.', 2, 'active', NOW()),
('Chef d''equipe nettoyage', 'chef-equipe-nettoyage', 'Montreal', 'Temps plein', 'Selon experience', 'Encadrement de 2 a 5 agents.', 'Controle qualite, relation client, planning. Evolution vers superviseur.', 'Experience 1 an exigee, sens du leadership.', 3, 'active', NOW()),
('Candidature spontanee', 'candidature-spontanee', 'Montreal', 'Flexible', 'A discuter', 'Tous profils motives.', 'Pas d''experience mais ponctuel et soigneux ? Envoyez votre candidature, on vous forme.', 'Motivation, ponctualite, soin du detail.', 4, 'active', NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title);
