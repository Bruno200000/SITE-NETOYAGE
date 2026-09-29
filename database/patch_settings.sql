USE nettoyage_2jk;

INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
('whatsapp', '+15146235610', 'phone'),
('address', 'Nouveau-Brunswick, Canada', 'text'),
('zone_intervention', 'Nouveau-Brunswick et regions environnantes', 'text'),
('canada_map_title', 'Couverture & Interventions au Canada', 'text'),
('canada_map_subtitle', 'Présence active au Nouveau-Brunswick et interventions sur demande', 'text'),
('canada_map_provinces', 'NB,QC,ON,NS,PE', 'text'),
('canada_map_main_region', 'Nouveau-Brunswick (Moncton & environs)', 'text'),
('canada_map_badge', 'Intervention 7j/7', 'text'),
('canada_map_note', 'Des équipes professionnelles mobiles pour projets résidentiels, commerciaux et après travaux.', 'text'),
('canada_map_color', '#ff7a1a', 'color')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  setting_type = VALUES(setting_type);
