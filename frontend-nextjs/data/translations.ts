/* =====================================================================
   data/translations.ts
   Toutes les chaînes FR/EN du site 2JK Services Inc.
   ===================================================================== */

export type Lang = "fr" | "en";

const t: Record<string, Record<Lang, string>> = {
  /* ---- NAVIGATION ---- */
  "nav.home": { fr: "Accueil", en: "Home" },
  "nav.services": { fr: "Services", en: "Services" },
  "nav.blog": { fr: "Blog", en: "Blog" },
  "nav.payment": { fr: "Paiement", en: "Payment" },
  "nav.contact": { fr: "Contact", en: "Contact" },
  "nav.realizations": { fr: "Réalisations", en: "Portfolio" },
  "nav.gallery": { fr: "Galerie", en: "Gallery" },
  "nav.before_after": { fr: "Avant / Après", en: "Before / After" },
  "nav.testimonials": { fr: "Témoignages", en: "Testimonials" },
  "nav.faq": { fr: "FAQ", en: "FAQ" },
  "nav.company": { fr: "Entreprise", en: "Company" },
  "nav.about": { fr: "À propos", en: "About us" },
  "nav.recruitment": { fr: "Recrutement", en: "Careers" },
  "nav.appointment": { fr: "Rendez-vous", en: "Appointment" },
  "nav.call": { fr: "Appeler", en: "Call us" },
  "nav.free_quote": { fr: "Devis gratuit", en: "Free quote" },


  /* ---- HERO ---- */
  "hero.badge_available": { fr: "Disponible 7j/7", en: "Available 7/7" },
  "hero.badge_team": { fr: "Équipes vérifiées", en: "Verified teams" },
  "hero.badge_result": { fr: "Résultat garanti", en: "Guaranteed results" },
  "hero.cta_quote": { fr: "Demander un devis", en: "Request a quote" },
  "hero.cta_appointment": { fr: "Planifier un rendez-vous", en: "Schedule an appointment" },
  "hero.prev": { fr: "Service précédent", en: "Previous service" },
  "hero.next": { fr: "Service suivant", en: "Next service" },

  /* ---- HOME SLIDES ---- */
  "slide1.eyebrow": { fr: "Nettoyage résidentiel et commercial", en: "Residential & commercial cleaning" },
  "slide1.title": { fr: "Nettoyage premium pour espaces impeccables.", en: "Premium cleaning for impeccable spaces." },
  "slide2.eyebrow": { fr: "Bureaux, commerces, immeubles", en: "Offices, shops, buildings" },
  "slide2.title": { fr: "Des lieux propres qui inspirent confiance.", en: "Clean spaces that inspire confidence." },
  "slide2.text": { fr: "Contrats d'entretien, interventions ponctuelles et suivi qualité pour les espaces à fort passage.", en: "Maintenance contracts, one-off services and quality monitoring for high-traffic spaces." },
  "slide3.eyebrow": { fr: "Après travaux et remise en état", en: "Post-construction & restoration" },
  "slide3.title": { fr: "Une finition nette, prête à livrer.", en: "A clean finish, ready to deliver." },
  "slide3.text": { fr: "Dépoussiérage profond, surfaces détaillées, vitres et sols remis en valeur avec méthode.", en: "Deep dusting, detailed surfaces, windows and floors restored with method." },
  "slide4.eyebrow": { fr: "Nettoyage automobile", en: "Automotive cleaning" },
  "slide4.title": { fr: "Habitacles propres, frais et soignés.", en: "Clean, fresh and well-maintained interiors." },
  "slide4.text": { fr: "Aspiration, surfaces intérieures, vitres, tissus et remise en propre détaillée pour voitures personnelles ou flottes.", en: "Vacuuming, interior surfaces, windows, upholstery and detailed cleaning for personal vehicles or fleets." },

  /* ---- HOME PAGE ---- */
  "home.why.eyebrow": { fr: "Pourquoi 2JK", en: "Why 2JK" },
  "home.why.title": { fr: "Une expérience de nettoyage professionnelle, claire et rassurante.", en: "A professional, clear and reassuring cleaning experience." },
  "home.why.team_tag": { fr: "Équipe terrain", en: "Field team" },
  "home.why.team_title": { fr: "Des interventions organisées, propres et ponctuelles.", en: "Organized, clean and punctual interventions." },
  "home.reason1.title": { fr: "Standard premium", en: "Premium standard" },
  "home.reason1.text": { fr: "Une finition visible, des équipes formées et des contrôles qualité après intervention.", en: "A visible finish, trained teams and quality controls after each intervention." },
  "home.reason2.title": { fr: "Intervention rapide", en: "Fast response" },
  "home.reason2.text": { fr: "Une organisation souple pour les bureaux, commerces, maisons et urgences.", en: "Flexible scheduling for offices, shops, homes and emergencies." },
  "home.reason3.title": { fr: "Produits responsables", en: "Eco-friendly products" },
  "home.reason3.text": { fr: "Des options écologiques pour protéger vos surfaces, vos clients et vos équipes.", en: "Eco-friendly options to protect your surfaces, clients and teams." },
  "home.services.eyebrow": { fr: "Services", en: "Services" },
  "home.services.title": { fr: "Des prestations conçues pour les espaces qui doivent rester impeccables.", en: "Services designed for spaces that must stay impeccable." },
  "home.before_after.eyebrow": { fr: "Avant / Après", en: "Before / After" },
  "home.before_after.title": { fr: "Des résultats visibles dès la première intervention.", en: "Visible results from the very first service." },
  "home.testimonials.eyebrow": { fr: "Avis clients", en: "Client reviews" },
  "home.testimonials.title": { fr: "Ils nous confient leurs espaces de vie et de travail.", en: "They trust us with their living and working spaces." },
  "home.contact.eyebrow": { fr: "Contact rapide", en: "Quick contact" },
  "home.contact.title": { fr: "Parlez-nous de vos besoins de nettoyage.", en: "Tell us about your cleaning needs." },

  /* ---- STATS ---- */
  "stats.clients": { fr: "clients accompagnés", en: "clients served" },
  "stats.satisfaction": { fr: "taux de satisfaction", en: "satisfaction rate" },
  "stats.response": { fr: "réponse rapide", en: "fast response" },
  "stats.flexibility": { fr: "souplesse d'intervention", en: "intervention flexibility" },

  /* ---- SERVICES ---- */
  "services.page.eyebrow": { fr: "Services", en: "Services" },
  "services.page.title": { fr: "Choisissez le service qui correspond à votre espace.", en: "Choose the service that fits your space." },
  "services.hero.eyebrow": { fr: "Services", en: "Services" },
  "services.hero.title": { fr: "Des prestations adaptées à chaque espace.", en: "Services tailored to every space." },
  "services.hero.text": { fr: "Résidentiel, commercial, automobile mobile, écologique, désinfection et après construction : nos équipes se déplacent avec rigueur.", en: "Residential, commercial, mobile automotive detailing, ecological, disinfection and post-construction: our teams operate with rigor." },
  "services.see": { fr: "Voir le service", en: "View service" },
  "services.empty": { fr: "Aucun service publié pour le moment.", en: "No services published yet." },
  "services.cta_label": { fr: "Obtenir un devis", en: "Get a quote" },

  /* ---- BLOG ---- */
  "blog.search_placeholder": { fr: "Rechercher un article", en: "Search articles" },
  "blog.all_categories": { fr: "Toutes catégories", en: "All categories" },
  "blog.empty": { fr: "Aucun article publié pour le moment.", en: "No articles published yet." },
  "blog.hero.eyebrow": { fr: "Blog", en: "Blog" },
  "blog.hero.title": { fr: "Conseils, méthodes et guides pratiques.", en: "Tips, methods and practical guides." },
  "blog.hero.text": { fr: "Des contenus simples pour garder vos espaces propres plus longtemps.", en: "Simple content to keep your spaces clean longer." },
  "blog.default_category": { fr: "Conseils", en: "Tips" },

  /* ---- HOW IT WORKS ---- */
  "how.eyebrow": { fr: "Processus simple", en: "Simple process" },
  "how.title": { fr: "Comment Ça Marche ?", en: "How Does It Work?" },
  "how.subtitle": { fr: "De la réservation au résultat final, découvrez la simplicité de notre accompagnement en 5 étapes claires.", en: "From booking to the final result, discover the simplicity of our process in 5 clear steps." },
  "how.cta_text": { fr: "Prêt à profiter d'un espace d'une propreté irréprochable ?", en: "Ready to enjoy a spotlessly clean space?" },
  "how.cta_btn": { fr: "Demander mon devis gratuit", en: "Request my free quote" },
  "how.step1.title": { fr: "Programmez-nous", en: "Schedule us" },
  "how.step1.desc": { fr: "Nous sommes disponibles tous les jours de la semaine avec des nettoyages commençant dès 8h.", en: "We are available every day of the week with cleanings starting from 8am." },
  "how.step1.tag": { fr: "Réservation 24/7", en: "Book 24/7" },
  "how.step2.title": { fr: "Laissez-nous entrer", en: "Let us in" },
  "how.step2.desc": { fr: "Donnez des instructions d'entrée et nous serons là !", en: "Give us entry instructions and we'll be there!" },
  "how.step2.tag": { fr: "Accès simple", en: "Easy access" },
  "how.step3.title": { fr: "Nous nettoyons", en: "We clean" },
  "how.step3.desc": { fr: "Nous exécutons rigoureusement nos check-lists. Nos nettoyeurs sont formés pour maintenir la qualité 2JK.", en: "We rigorously follow our checklists. Our cleaners are trained to maintain 2JK quality." },
  "how.step3.tag": { fr: "Qualité premium", en: "Premium quality" },
  "how.step4.title": { fr: "Donnez votre feedback", en: "Give your feedback" },
  "how.step4.desc": { fr: "Comment on a fait ? Répondez à notre enquête d'une question (ou si vous le souhaitez, fournissez plus de détails).", en: "How did we do? Answer our one-question survey (or provide more details if you wish)." },
  "how.step4.tag": { fr: "Satisfaction 100%", en: "100% satisfaction" },
  "how.step5.title": { fr: "Rincer et répéter", en: "Rinse and repeat" },
  "how.step5.desc": { fr: "Planifiez des nettoyages récurrents pour garder votre place toujours saine, propre et fraîche.", en: "Schedule recurring cleanings to keep your place always healthy, clean and fresh." },
  "how.step5.tag": { fr: "Tranquillité totale", en: "Total peace of mind" },

  /* ---- CONTACT FORM ---- */
  "contact.form.badge": { fr: "Formulaire direct", en: "Direct form" },
  "contact.form.title": { fr: "Envoyez-nous un message", en: "Send us a message" },
  "contact.form.subtitle": { fr: "Remplissez vos coordonnées pour recevoir une réponse rapide.", en: "Fill in your details to receive a quick response." },
  "contact.form.name": { fr: "Nom complet *", en: "Full name *" },
  "contact.form.name_placeholder": { fr: "ex: Jean Tremblay", en: "e.g. John Smith" },
  "contact.form.email": { fr: "Adresse e-mail *", en: "Email address *" },
  "contact.form.email_placeholder": { fr: "ex: jean@example.com", en: "e.g. john@example.com" },
  "contact.form.phone": { fr: "Numéro de téléphone *", en: "Phone number *" },
  "contact.form.phone_placeholder": { fr: "ex: 514 000 0000", en: "e.g. 514 000 0000" },
  "contact.form.message": { fr: "Votre message *", en: "Your message *" },
  "contact.form.message_placeholder": { fr: "Précisez votre demande, type de lieu ou dates souhaitées...", en: "Describe your request, type of space or preferred dates..." },
  "contact.form.submit": { fr: "Envoyer mon message", en: "Send my message" },
  "contact.form.submitting": { fr: "Envoi en cours...", en: "Sending..." },
  "contact.form.privacy": { fr: "Vos données restent confidentielles et ne sont jamais partagées.", en: "Your data remains confidential and is never shared." },
  "contact.form.success_title": { fr: "Message envoyé !", en: "Message sent!" },
  "contact.form.success_text": { fr: "Notre équipe vous répondra dans les plus brefs délais.", en: "Our team will get back to you as soon as possible." },
  "contact.form.error_title": { fr: "Envoi impossible", en: "Unable to send" },
  "contact.form.error_text": { fr: "Vérifiez votre connexion ou contactez-nous directement par téléphone.", en: "Check your connection or contact us directly by phone." },

  /* ---- FOOTER ---- */
  "footer.premium": { fr: "Nettoyage premium", en: "Premium cleaning" },
  "footer.fast_response": { fr: "Réponse rapide", en: "Fast response" },
  "footer.navigation": { fr: "Navigation", en: "Navigation" },
  "footer.popular_services": { fr: "Services populaires", en: "Popular services" },
  "footer.get_started": { fr: "Démarrer", en: "Get started" },
  "footer.get_started_text": { fr: "Besoin d'un nettoyage ponctuel, récurrent ou après travaux ? Envoyez votre demande et recevez une réponse claire.", en: "Need a one-off, recurring or post-construction cleaning? Send your request and receive a clear response." },
  "footer.free_quote": { fr: "Devis gratuit", en: "Free quote" },
  "footer.contact": { fr: "Contact", en: "Contact" },
  "footer.copyright": { fr: "Tous droits réservés.", en: "All rights reserved." },
  "footer.privacy": { fr: "Confidentialité", en: "Privacy" },
  "footer.legal": { fr: "Mentions légales", en: "Legal notice" },
  "footer.terms": { fr: "Conditions", en: "Terms" },

  /* ---- PAGE HEROES ---- */
  "hero.about.eyebrow": { fr: "À propos", en: "About" },
  "hero.about.title": { fr: "Une équipe fiable pour vos espaces de vie et de travail.", en: "A reliable team for your living and working spaces." },
  "hero.about.text": { fr: "2JK Services Inc. combine rigueur, communication rapide et contrôle qualité pour offrir une expérience de nettoyage rassurante.", en: "2JK Services Inc. combines rigor, rapid communication and quality control to offer a reassuring cleaning experience." },
  "hero.gallery.eyebrow": { fr: "Galerie", en: "Gallery" },
  "hero.gallery.title": { fr: "Des réalisations récentes, visibles et soignées.", en: "Recent, visible and careful achievements." },
  "hero.gallery.text": { fr: "Parcourez des exemples de surfaces remises en valeur par nos équipes.", en: "Browse examples of surfaces restored by our teams." },
  "hero.before_after.eyebrow": { fr: "Avant / Après", en: "Before / After" },
  "hero.before_after.title": { fr: "Faites glisser la ligne et voyez la transformation.", en: "Slide the line and see the transformation." },
  "hero.before_after.text": { fr: "Comparez le résultat avant et après intervention grâce à un contrôle interactif.", en: "Compare the before and after result using an interactive control." },
  "hero.contact.eyebrow": { fr: "Contact", en: "Contact" },
  "hero.contact.title": { fr: "Une question, un projet ou une urgence ?", en: "A question, a project or an emergency?" },
  "hero.contact.text": { fr: "Expliquez votre besoin et recevez une réponse claire pour votre devis, rendez-vous ou intervention.", en: "Explain your need and receive a clear response for your quote, appointment or service." },
  "hero.quote.eyebrow": { fr: "Devis", en: "Quote" },
  "hero.quote.title": { fr: "Décrivez votre besoin, nous préparons une estimation claire.", en: "Describe your need, we'll prepare a clear estimate." },
  "hero.quote.text": { fr: "Surface, fréquence, urgence ou type de nettoyage : chaque détail aide à proposer le bon service.", en: "Surface area, frequency, urgency or cleaning type: every detail helps propose the right service." },
  "hero.recruitment.eyebrow": { fr: "Recrutement", en: "Careers" },
  "hero.recruitment.title": { fr: "Rejoignez l'équipe 2JK Services.", en: "Join the 2JK Services team." },
  "hero.recruitment.text": { fr: "Agents d'entretien, techniciens et chefs d'équipe : déposez votre candidature en 2 minutes.", en: "Cleaning agents, technicians and team leaders: apply in 2 minutes." },
  "hero.appointment.eyebrow": { fr: "Rendez-vous", en: "Appointment" },
  "hero.appointment.title": { fr: "Choisissez un créneau et confirmez votre demande.", en: "Choose a slot and confirm your request." },
  "hero.appointment.text": { fr: "Planifiez une visite technique ou une intervention selon vos disponibilités.", en: "Schedule a technical visit or service according to your availability." },
  "hero.testimonials.eyebrow": { fr: "Témoignages", en: "Testimonials" },
  "hero.testimonials.title": { fr: "La satisfaction client au centre du service.", en: "Customer satisfaction at the heart of our service." },
  "hero.testimonials.text": { fr: "Des clients accompagnés avec ponctualité, propreté et suivi.", en: "Clients supported with punctuality, cleanliness and follow-up." },
  "hero.faq.eyebrow": { fr: "FAQ", en: "FAQ" },
  "hero.faq.title": { fr: "Les réponses aux questions les plus courantes.", en: "Answers to the most common questions." },
  "hero.faq.text": { fr: "Contrats, zones couvertes, produits, devis et fonctionnement : trouvez rapidement les informations utiles.", en: "Contracts, coverage areas, products, quotes and how it works: find useful information quickly." },

  /* ---- GENERIC ---- */
  "generic.loading": { fr: "Chargement...", en: "Loading..." },
  "generic.error": { fr: "Une erreur est survenue.", en: "An error occurred." },
  "generic.back": { fr: "Retour", en: "Back" },
};

export function translate(key: string, lang: Lang): string {
  const entry = t[key];
  if (!entry) return key;
  return entry[lang] ?? entry.fr ?? key;
}

export default t;
