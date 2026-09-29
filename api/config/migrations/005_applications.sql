-- 2JK Services — Candidatures recrutement (API PHP + Next.js)
-- Compatible avec api/controllers/CrudController.php (ressource "applications")
-- A importer dans phpMyAdmin si la table "applications" manque (erreur 1146).
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(128) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  poste VARCHAR(128) NOT NULL,
  ville VARCHAR(128) NULL,
  dispo VARCHAR(64) NULL,
  message TEXT NULL,
  cv_file VARCHAR(255) NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'nouveau',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_applications_poste (poste),
  INDEX idx_applications_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
