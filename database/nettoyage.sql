CREATE DATABASE IF NOT EXISTS nettoyage_2jk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nettoyage_2jk;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS activity_logs, notifications, media, interac_transactions, site_settings, faqs, contact_messages, appointments, quotes, testimonials, gallery_images, albums, gallery_categories, post_related, posts, blog_categories, services, service_categories, users;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','editor') NOT NULL DEFAULT 'admin',
  avatar VARCHAR(255) NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE service_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  description TEXT NULL,
  display_order INT NOT NULL DEFAULT 0,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE services (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NULL,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  short_description VARCHAR(255) NULL,
  description MEDIUMTEXT NULL,
  image VARCHAR(255) NULL,
  icon VARCHAR(80) NULL,
  price DECIMAL(10,2) NULL,
  display_order INT NOT NULL DEFAULT 0,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE blog_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  description TEXT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NULL,
  author_id INT UNSIGNED NULL,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  excerpt VARCHAR(320) NULL,
  content MEDIUMTEXT NULL,
  image VARCHAR(255) NULL,
  tags VARCHAR(255) NULL,
  meta_title VARCHAR(220) NULL,
  meta_description VARCHAR(320) NULL,
  og_title VARCHAR(220) NULL,
  og_description VARCHAR(320) NULL,
  og_image VARCHAR(255) NULL,
  status ENUM('draft','published','scheduled') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT KEY ft_posts_search (title, excerpt, content),
  CONSTRAINT fk_posts_category FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE post_related (
  post_id INT UNSIGNED NOT NULL,
  related_post_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (post_id, related_post_id),
  CONSTRAINT fk_related_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_related_target FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE gallery_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  description TEXT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE albums (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NULL,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  description TEXT NULL,
  cover_image VARCHAR(255) NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_albums_category FOREIGN KEY (category_id) REFERENCES gallery_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE gallery_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  album_id INT UNSIGNED NULL,
  title VARCHAR(190) NOT NULL,
  image VARCHAR(255) NOT NULL,
  before_image VARCHAR(255) NULL,
  after_image VARCHAR(255) NULL,
  alt_text VARCHAR(255) NULL,
  is_before_after TINYINT(1) NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_gallery_album FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE testimonials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(160) NOT NULL,
  profession VARCHAR(160) NULL,
  photo VARCHAR(255) NULL,
  rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
  comment TEXT NOT NULL,
  status ENUM('pending','published','inactive') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE quotes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(120) NULL,
  last_name VARCHAR(120) NULL,
  name VARCHAR(190) NULL,
  phone VARCHAR(60) NOT NULL,
  email VARCHAR(190) NOT NULL,
  company VARCHAR(190) NULL,
  city VARCHAR(120) NULL,
  address VARCHAR(255) NULL,
  service_type VARCHAR(160) NULL,
  message TEXT NULL,
  budget VARCHAR(120) NULL,
  desired_date DATE NULL,
  attachments JSON NULL,
  status ENUM('pending','processed','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE appointments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_id INT UNSIGNED NULL,
  name VARCHAR(190) NOT NULL,
  phone VARCHAR(60) NOT NULL,
  email VARCHAR(190) NOT NULL,
  address VARCHAR(255) NULL,
  appointment_date DATE NULL,
  appointment_time TIME NULL,
  message TEXT NULL,
  status ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointments_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(190) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(60) NULL,
  subject VARCHAR(190) NULL,
  message TEXT NOT NULL,
  status ENUM('new','processed','archived') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE faqs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE site_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(120) NOT NULL UNIQUE,
  setting_value MEDIUMTEXT NULL,
  setting_type VARCHAR(60) NOT NULL DEFAULT 'text',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info','success','warning','error') NOT NULL DEFAULT 'info',
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(190) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NULL,
  file_size INT UNSIGNED NULL,
  alt_text VARCHAR(255) NULL,
  uploaded_by INT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE interac_transactions (
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

CREATE TABLE activity_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  action VARCHAR(160) NOT NULL,
  entity VARCHAR(120) NULL,
  entity_id INT UNSIGNED NULL,
  ip_address VARCHAR(64) NULL,
  user_agent VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (name, email, password_hash, role, status) VALUES
('Administrateur 2JK', 'admin@2jkservices.com', '$2y$10$gA/KEADyG2AzOY14IH9XxOTE9SSXeT4.dtp9FsxBJx0lin6RKEm9y', 'admin', 'active');

INSERT INTO service_categories (name, slug, description) VALUES
('Résidentiel', 'residentiel', 'Nettoyage des maisons, appartements et condos.'),
('Commercial', 'commercial', 'Entretien des bureaux, commerces et espaces communs.'),
('Spécialisé', 'specialise', 'Interventions techniques, après construction et désinfection.');

INSERT INTO services (category_id, title, slug, short_description, description, icon, display_order, status) VALUES
(1, 'Nettoyage résidentiel', 'nettoyage-residentiel', 'Entretien régulier et grand ménage.', 'Service complet pour maisons, condos, appartements, emménagements et déménagements.', 'FaHome', 1, 'active'),
(2, 'Nettoyage commercial', 'nettoyage-commercial', 'Bureaux et locaux professionnels.', 'Contrats flexibles pour espaces de travail, commerces et immeubles.', 'FaBuilding', 2, 'active'),
(3, 'Après construction', 'apres-construction', 'Remise en état après travaux.', 'Dépoussiérage fin, sols, vitres, surfaces et livraison propre.', 'FaBroom', 3, 'active');

INSERT INTO blog_categories (name, slug, description) VALUES
('Conseils', 'conseils', 'Guides pratiques pour garder un espace propre.'),
('Hygiène', 'hygiene', 'Bonnes pratiques de désinfection et salubrité.');

INSERT INTO posts (category_id, author_id, title, slug, excerpt, content, status, published_at) VALUES
(1, 1, 'Comment préparer un grand ménage', 'comment-preparer-grand-menage', 'Les étapes pour organiser efficacement un grand ménage.', 'Préparez les zones, rassemblez les produits et avancez avec une checklist.', 'published', NOW()),
(2, 1, 'Pourquoi choisir un nettoyage écologique', 'nettoyage-ecologique', 'Des méthodes efficaces et responsables.', 'Les produits et protocoles écologiques protègent les occupants et les surfaces.', 'published', NOW());

INSERT INTO gallery_categories (name, slug) VALUES ('Avant / Après', 'avant-apres'), ('Bureaux', 'bureaux');
INSERT INTO albums (category_id, title, slug, description, status) VALUES (1, 'Transformations récentes', 'transformations-recentes', 'Résultats avant et après intervention.', 'active');
INSERT INTO gallery_images (album_id, title, image, is_before_after, status) VALUES (1, 'Cuisine commerciale', 'uploads/demo/cuisine.jpg', 1, 'active');

INSERT INTO testimonials (client_name, profession, rating, comment, status) VALUES
('Marie Tremblay', 'Gestionnaire', 5, 'Service impeccable, ponctuel et professionnel.', 'published'),
('Alex Nguyen', 'Entrepreneur', 5, 'Très bon suivi et résultat propre après travaux.', 'published');

INSERT INTO faqs (question, answer, display_order, status) VALUES
('Proposez-vous des contrats réguliers ?', 'Oui, nous adaptons les fréquences selon vos besoins.', 1, 'active'),
('Fournissez-vous les produits ?', 'Oui, nos équipes peuvent fournir les produits et équipements.', 2, 'active');

INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
('company_name', '2JK Services Inc.', 'text'),
('slogan', 'Des espaces impeccables, une équipe fiable.', 'text'),
('phone', '+1 514 000 0000', 'text'),
('whatsapp', '+15146235610', 'phone'),
('email', 'contact@2jkservices.com', 'text'),
('address', 'Nouveau-Brunswick, Canada', 'text'),
('zone_intervention', 'Nouveau-Brunswick et regions environnantes', 'text'),
('canada_map_title', 'Couverture & Interventions au Canada', 'text'),
('canada_map_subtitle', 'Présence active au Nouveau-Brunswick et interventions sur demande', 'text'),
('canada_map_provinces', 'NB,QC,ON,NS,PE', 'text'),
('canada_map_main_region', 'Nouveau-Brunswick (Moncton & environs)', 'text'),
('canada_map_badge', 'Intervention 7j/7', 'text'),
('canada_map_note', 'Des équipes professionnelles mobiles pour projets résidentiels, commerciaux et après travaux.', 'text'),
('canada_map_color', '#ff7a1a', 'color'),
('primary_color', '#0b63ce', 'color'),
('secondary_color', '#16a34a', 'color');

INSERT INTO notifications (title, message, type, is_read) VALUES
('Bienvenue dans le back-office', 'Votre espace admin est connecte a la base MySQL.', 'success', 0),
('Verifier les demandes', 'Consultez les devis, rendez-vous et messages entrants.', 'info', 0),
('Parametres du site', 'Pensez a ajuster le telephone, email et couleurs avant la mise en ligne.', 'warning', 0);

