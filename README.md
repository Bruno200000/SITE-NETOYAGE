# 2JK Services Inc. - Plateforme de nettoyage

Projet full stack pour une entreprise de nettoyage : frontend Next.js 15 exportable en statique, API REST PHP 8.3 procédurale avec PDO/JWT, base MySQL prête pour XAMPP et Hostinger.

## Arborescence

```text
frontend-nextjs/   Application Next.js App Router
api/               API REST PHP procédurale
database/          Schéma MySQL nettoyage.sql
```

## Prérequis locaux

- XAMPP avec Apache, PHP 8.3 et MySQL
- Node.js 20+
- phpMyAdmin

## Organisation frontend

```text
frontend-nextjs/app/          Routes publiques et admin Next.js
frontend-nextjs/components/   Composants UI, publics et admin
frontend-nextjs/data/         Contenus publics du site : services, images, stats
frontend-nextjs/lib/          Helpers techniques et compatibilite
frontend-nextjs/services/     Client API
frontend-nextjs/types/        Types partages
```

Les fichiers generes localement (`.next`, `out`, logs) sont ignores par Git pour garder le projet propre.

## Installation MySQL

1. Ouvrir phpMyAdmin.
2. Importer `database/nettoyage.sql`.
3. La base `nettoyage_2jk` sera créée avec toutes les tables et données de départ.

Compte administrateur initial :

```text
Email : admin@2jkservices.com
Mot de passe : Admin@12345
```

## Configuration API PHP

1. Copier `api/.env.example` vers `api/.env`.
2. Ajuster les variables :

```env
DB_HOST=localhost
DB_NAME=nettoyage_2jk
DB_USER=root
DB_PASS=
JWT_SECRET=change-this-long-random-secret
FRONTEND_URL=http://localhost:3000
```

3. Placer le dossier du projet sous `C:\xampp\htdocs\SITE NETOYAGE`.
4. Vérifier l'API : `http://localhost/api/health`.

Endpoints principaux :

- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/password`
- `GET /api/services`, `POST /api/services`, `PUT /api/services/{id}`, `DELETE /api/services/{id}`
- `GET /api/posts`
- `GET /api/gallery`
- `GET /api/testimonials`
- `POST /api/quotes`
- `POST /api/appointments`
- `POST /api/contacts`
- `GET /api/faq`
- `GET /api/settings`

Les routes d'écriture administrateur nécessitent `Authorization: Bearer <token>`.

## Lancement frontend

```bash
cd frontend-nextjs
npm install
npm run dev
```

Frontend local : `http://localhost:3000`

Le fichier `frontend-nextjs/.env.local` pointe par défaut vers :

```env
NEXT_PUBLIC_API_URL=http://localhost/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Modules inclus

- Pages publiques : accueil, à propos, services, détail service, galerie, avant/après, blog, détail article, FAQ, contact, devis, rendez-vous, témoignages, confidentialité, mentions légales, conditions, 404.
- Admin : login, dashboard, statistiques Chart.js, modules services, blog, galerie, témoignages, demandes, paramètres.
- API : auth JWT, profil, mot de passe, CRUD REST, validation, PDO, requêtes préparées, CORS, uploads sécurisés.
- Base : utilisateurs, services, catégories, articles, galerie, albums, témoignages, devis, rendez-vous, messages, FAQ, paramètres, notifications, médias, journaux.
- SEO : Metadata API, sitemap, robots, Open Graph, Twitter Cards, JSON-LD local business.

## Build statique pour Hostinger

```bash
cd frontend-nextjs
npm run build
```

Le dossier généré `frontend-nextjs/out` contient le site statique. Déployer son contenu dans `public_html`.

Déployer ensuite le dossier `api` dans :

```text
public_html/api
```

Mettre à jour côté Hostinger :

- `api/.env` avec les identifiants MySQL Hostinger.
- `frontend-nextjs/.env.local` avant build avec l'URL finale, par exemple :

```env
NEXT_PUBLIC_API_URL=https://votre-domaine.com/api
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

## Notes production

- Remplacer `JWT_SECRET` par une valeur longue et aléatoire.
- Modifier le mot de passe administrateur après première connexion.
- Restreindre `Access-Control-Allow-Origin` au domaine final en production.
- Configurer les permissions du dossier `api/uploads`.
- Ajouter un vrai compte email SMTP si les notifications par courriel sont branchées.
- L'admin est exporté statiquement : la protection visuelle est côté client, mais la sécurité des données est assurée par l'API JWT.
