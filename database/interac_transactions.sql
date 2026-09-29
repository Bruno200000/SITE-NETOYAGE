-- 2JK Services — Table transactions Interac e-Transfer (additif, ne modifie aucune table existante)
-- Statuts : pending, awaiting_payment, paid, failed, cancelled
CREATE TABLE IF NOT EXISTS interac_transactions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `reference` VARCHAR(64) NOT NULL UNIQUE,          -- ex. 2JK-20260914-A3F9K2
  order_reference VARCHAR(120) NULL,                -- référence de commande du site
  amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'CAD',
  status ENUM('pending','awaiting_payment','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  mode VARCHAR(12) NOT NULL DEFAULT 'TEST',         -- TEST | PRODUCTION
  customer_name VARCHAR(190) NULL,
  customer_email VARCHAR(190) NULL,
  customer_phone VARCHAR(60) NULL,
  proof_image MEDIUMTEXT NULL,
  proof_note TEXT NULL,
  customer_notified TINYINT(1) NOT NULL DEFAULT 0,  -- 1 si le client a cliqué "J'ai effectué le paiement"
  paid_at DATETIME NULL,                            -- rempli UNIQUEMENT par webhook/admin, jamais par le bouton client
  webhook_payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_interac_order (order_reference),
  INDEX idx_interac_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
