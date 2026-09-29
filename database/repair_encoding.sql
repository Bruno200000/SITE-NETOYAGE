USE nettoyage_2jk;
SET NAMES utf8mb4;

UPDATE service_categories SET
  name = 'Résidentiel',
  description = 'Nettoyage des maisons, appartements et condos.'
WHERE slug = 'residentiel';

UPDATE service_categories SET
  name = 'Spécialisé',
  description = 'Interventions techniques, après construction et désinfection.'
WHERE slug = 'specialise';

UPDATE services SET
  title = 'Nettoyage résidentiel',
  short_description = 'Entretien régulier et grand ménage.',
  description = 'Service complet pour maisons, condos, appartements, emménagements et déménagements.'
WHERE slug = 'nettoyage-residentiel';

UPDATE services SET
  title = 'Après construction',
  short_description = 'Remise en état après travaux.',
  description = 'Dépoussiérage fin, sols, vitres, surfaces et livraison propre.'
WHERE slug = 'apres-construction';

UPDATE blog_categories SET
  name = 'Hygiène',
  description = 'Bonnes pratiques de désinfection et salubrité.'
WHERE slug = 'hygiene';

UPDATE posts SET
  title = 'Comment préparer un grand ménage',
  excerpt = 'Les étapes pour organiser efficacement un grand ménage.',
  content = 'Préparez les zones, rassemblez les produits et avancez avec une checklist.'
WHERE slug = 'comment-preparer-grand-menage';

UPDATE posts SET
  title = 'Pourquoi choisir un nettoyage écologique',
  excerpt = 'Des méthodes efficaces et responsables.',
  content = 'Les produits et protocoles écologiques protègent les occupants et les surfaces.'
WHERE slug = 'nettoyage-ecologique';

UPDATE gallery_categories SET name = 'Avant / Après' WHERE slug = 'avant-apres';

UPDATE albums SET
  title = 'Transformations récentes',
  description = 'Résultats avant et après intervention.'
WHERE slug = 'transformations-recentes';

UPDATE testimonials SET
  comment = 'Très bon suivi et résultat propre après travaux.'
WHERE client_name = 'Alex Nguyen';

UPDATE faqs SET
  question = 'Proposez-vous des contrats réguliers ?',
  answer = 'Oui, nous adaptons les fréquences selon vos besoins.'
WHERE display_order = 1;

UPDATE faqs SET
  question = 'Fournissez-vous les produits ?',
  answer = 'Oui, nos équipes peuvent fournir les produits et équipements.'
WHERE display_order = 2;

UPDATE site_settings SET setting_value = 'Des espaces impeccables, une équipe fiable.'
WHERE setting_key = 'slogan';
