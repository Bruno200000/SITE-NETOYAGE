-- 2JK Services — Candidatures recrutement (additif)
CREATE TABLE IF NOT EXISTS recrutement_candidatures (
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
  INDEX idx_recrut_poste (poste),
  INDEX idx_recrut_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
