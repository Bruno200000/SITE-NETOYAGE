import { FaBroom, FaBuilding, FaCar, FaHome, FaLeaf, FaShieldAlt, FaSprayCan } from "react-icons/fa";

export const company = {
  name: "2JK Services Inc.",
  slogan: "Des espaces impeccables, une equipe fiable, un service qui inspire confiance.",
  phone: "514 623 5610",
  whatsapp: "+15146235610",
  email: "2jkservicesinc@gmail.com",
  address: "Nouveau-Brunswick, Canada",
  zone_intervention: "Nouveau-Brunswick & régions environnantes",
  facebook: "https://www.facebook.com/2jkservices",
  instagram: "https://www.instagram.com/2jkservices",
  googleCalendarUrl: "https://calendar.google.com/calendar/appointments/schedules/"
};

export const publicServices = [
  {
    title: "Nettoyage résidentiel",
    slug: "nettoyage-residentiel",
    icon: FaHome,
    text: "Entretien régulier, grand ménage, déménagement, lavage de vitres et remise en état complète de votre maison ou appartement."
  },
  {
    title: "Nettoyage commercial",
    slug: "nettoyage-commercial",
    icon: FaBuilding,
    text: "Commerces, supermarchés, boutiques de vente, centres commerciaux et bureaux d'entreprise avec protocoles d'hygiène rigoureux."
  },
  {
    title: "Nettoyage automobile (Mobile)",
    slug: "nettoyage-automobile",
    icon: FaCar,
    text: "Nous sommes 100% mobiles pour l'entretien et le nettoyage complet de votre véhicule à domicile ou au travail : habitacle, sièges, vitres et désinfection."
  },
  {
    title: "Nettoyage écologique",
    slug: "nettoyage-ecologique",
    icon: FaLeaf,
    text: "Produits biodégradables certifiés, méthodes douces sans résidus toxiques et respectueuses des enfants, animaux et de l'environnement."
  },
  {
    title: "Après construction & rénovation",
    slug: "apres-construction",
    icon: FaBroom,
    text: "Nettoyage de fin de chantier : évacuation des résidus de rénovation (bois, gravats), élimination des poussières de gypse et finition prête à livrer."
  },
  {
    title: "Désinfection spécialisée",
    slug: "desinfection",
    icon: FaShieldAlt,
    text: "Protocoles ciblés pour surfaces sensibles, désinfection virucide/bactéricide et assainissement des zones à fort passage."
  },
  {
    title: "Nettoyage spécialisé",
    slug: "nettoyage-specialise",
    icon: FaSprayCan,
    text: "Shampouinage de tapis, canapés et tissus, lavage haute pression, décapage et interventions ponctuelles d'urgence."
  }
];

export const siteImages = {
  hero: "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?auto=format&fit=crop&w=2400&q=85",
  team: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=85",
  office: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1400&q=85",
  commercial: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=88",
  home: "/residential-cleaning.jpg",
  eco: "/eco-cleaning.jpg",
  car: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1400&q=85",
  construction: "/construction-cleaning.jpg",
  tools: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=85",
  kitchen: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85",
  lobby: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
};

export const heroSlides = [
  {
    eyebrow: "Nettoyage résidentiel & commercial",
    title: "Nettoyage premium pour espaces impeccables.",
    text: company.slogan,
    image: siteImages.hero
  },
  {
    eyebrow: "Commerces, supermarchés, bureaux",
    title: "Des lieux de vente propres qui inspirent confiance.",
    text: "Entretien adapté aux commerces, boutiques et bureaux avec souplesse horaire pour votre clientèle.",
    image: siteImages.commercial
  },
  {
    eyebrow: "Service mobile d'entretien automobile",
    title: "Nous venons à vous pour votre véhicule.",
    text: "Entretien automobile mobile à domicile ou au travail. Habitacle désinfecté, tissus traités et vitres cristallines.",
    image: siteImages.car
  },
  {
    eyebrow: "Après travaux et rénovation",
    title: "Débarras de chantier et finition prête à livrer.",
    text: "Évacuation des débris de bois et matériaux de rénovation, élimination des poussières et remise en valeur intégrale.",
    image: siteImages.construction
  }
];

export const pageHeroes = {
  about: {
    eyebrow: "A propos",
    title: "Une equipe fiable pour vos espaces de vie et de travail.",
    text: "2JK Services Inc. combine rigueur, communication rapide et controle qualite pour offrir une experience de nettoyage rassurante.",
    image: siteImages.team
  },
  services: {
    eyebrow: "Services",
    title: "Des prestations adaptées à chaque besoin.",
    text: "Résidentiel, commercial, automobile mobile, écologique, désinfection et après construction : nos équipes interviennent avec rigueur.",
    image: siteImages.commercial
  },
  gallery: {
    eyebrow: "Galerie",
    title: "Des realisations recentes, visibles et soignees.",
    text: "Parcourez des exemples de surfaces remises en valeur par nos equipes.",
    image: siteImages.lobby
  },
  beforeAfter: {
    eyebrow: "Avant / Apres",
    title: "Faites glisser la ligne et voyez la transformation.",
    text: "Comparez le resultat avant et apres intervention grace a un controle interactif.",
    image: siteImages.kitchen
  },
  blog: {
    eyebrow: "Blog",
    title: "Conseils, methodes et guides pratiques.",
    text: "Des contenus simples pour garder vos espaces propres plus longtemps.",
    image: siteImages.tools
  },
  contact: {
    eyebrow: "Contact",
    title: "Une question, un projet ou une urgence ?",
    text: "Expliquez votre besoin et recevez une reponse claire pour votre devis, rendez-vous ou intervention.",
    image: siteImages.team
  },
  quote: {
    eyebrow: "Devis",
    title: "Decrivez votre besoin, nous preparons une estimation claire.",
    text: "Surface, frequence, urgence ou type de nettoyage : chaque detail aide a proposer le bon service.",
    image: siteImages.home
  },
  recruitment: {
    eyebrow: "Recrutement",
    title: "Rejoignez l'equipe 2JK Services.",
    text: "Agents d'entretien, techniciens automobiles et chefs d'equipe : deposez votre candidature en 2 minutes.",
    image: siteImages.team
  },
  appointment: {
    eyebrow: "Rendez-vous",
    title: "Choisissez un creneau et confirmez votre demande.",
    text: "Planifiez une visite technique ou une intervention selon vos disponibilites.",
    image: siteImages.lobby
  },
  testimonials: {
    eyebrow: "Temoignages",
    title: "La satisfaction client au centre du service.",
    text: "Des clients accompagnes avec ponctualite, proprete et suivi.",
    image: siteImages.office
  },
  faq: {
    eyebrow: "FAQ",
    title: "Les reponses aux questions les plus courantes.",
    text: "Contrats, zones couvertes, produits, devis et fonctionnement : trouvez rapidement les informations utiles.",
    image: siteImages.tools
  },
  legal: {
    eyebrow: "Informations",
    title: "Transparence, confidentialite et conditions.",
    text: "Retrouvez les informations utiles concernant le site, vos donnees et les conditions d'utilisation.",
    image: siteImages.lobby
  }
};

export const serviceImages: Record<string, string> = {
  "nettoyage-residentiel": siteImages.home,
  "nettoyage-commercial": siteImages.commercial,
  "nettoyage-automobile": siteImages.car,
  "nettoyage-ecologique": siteImages.eco,
  desinfection: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=1200&q=85",
  "apres-construction": siteImages.construction,
  "nettoyage-specialise": siteImages.tools
};

export const beforeAfterItems = [
  {
    title: "Cuisine commerciale",
    beforeImage: siteImages.tools,
    afterImage: siteImages.kitchen,
    text: "Graisses, surfaces et zones de travail remises en etat avec une finition nette."
  },
  {
    title: "Bureaux professionnels",
    beforeImage: siteImages.office,
    afterImage: siteImages.lobby,
    text: "Espaces de travail depoussieres, organises et prets a accueillir clients et equipes."
  },
  {
    title: "Apres construction",
    beforeImage: siteImages.construction,
    afterImage: siteImages.home,
    text: "Poussieres fines, traces et residus retires pour une livraison propre."
  },
  {
    title: "Surfaces specialisees",
    beforeImage: siteImages.tools,
    afterImage: serviceImages.desinfection,
    text: "Interventions ciblees pour les zones sensibles et les points de contact."
  }
];

export const galleryImages = [
  { title: "Salon remis a neuf", category: "Residentiel", image: siteImages.home },
  { title: "Bureaux prets pour l'accueil", category: "Commercial", image: siteImages.office },
  { title: "Cuisine professionnelle", category: "Specialise", image: siteImages.kitchen },
  { title: "Espaces communs lumineux", category: "Immeuble", image: siteImages.lobby },
  { title: "Finition apres travaux", category: "Construction", image: siteImages.construction },
  { title: "Equipe en intervention", category: "Equipe", image: siteImages.team },
  { title: "Materiel professionnel", category: "Qualite", image: siteImages.tools },
  { title: "Nettoyage responsable", category: "Ecologique", image: serviceImages["nettoyage-ecologique"] },
  { title: "Surfaces desinfectees", category: "Desinfection", image: serviceImages.desinfection }
];

export const stats = [
  ["250+", "clients accompagnes"],
  ["98%", "taux de satisfaction"],
  ["24h", "reponse rapide"],
  ["7j/7", "souplesse d'intervention"]
];
