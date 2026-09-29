USE nettoyage_2jk;

CREATE TABLE IF NOT EXISTS interac_transactions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(64) NOT NULL UNIQUE,
  order_reference VARCHAR(120) NULL,
  customer_name VARCHAR(190) NULL,
  customer_email VARCHAR(190) NULL,
  customer_phone VARCHAR(60) NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'CAD',
  status ENUM('pending','awaiting_payment','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  mode ENUM('TEST','PRODUCTION') NOT NULL DEFAULT 'TEST',
  proof_image MEDIUMTEXT NULL,
  proof_note TEXT NULL,
  customer_notified TINYINT(1) NOT NULL DEFAULT 0,
  paid_at DATETIME NULL,
  webhook_payload JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_interac_reference (reference),
  INDEX idx_interac_status (status)
) ENGINE=InnoDB;

ALTER TABLE interac_transactions MODIFY order_reference VARCHAR(120) NULL;
ALTER TABLE interac_transactions ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(60) NULL AFTER customer_email;
ALTER TABLE interac_transactions ADD COLUMN IF NOT EXISTS proof_image MEDIUMTEXT NULL AFTER mode;
ALTER TABLE interac_transactions ADD COLUMN IF NOT EXISTS proof_note TEXT NULL AFTER proof_image;
