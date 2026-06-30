# Livret candidat – RNCP Concepteur Développeur Web Full Stack

Ce livret guide pas à pas la production des livrables et la préparation des soutenances pour chacun des blocs RNCP.

---

## BLOC 1 – Concevoir un projet de développement digital sécurisé

### Compétences

C1 Veille – C2 Analyse des besoins – C3 IA/Data – C4 Architecture – C5 Cahier des charges – C6 Accessibilité

### Finalité du bloc

Démontrer la capacité à analyser un besoin, à structurer un projet digital, à choisir une architecture sécurisée, accessible et responsable, et à produire la documentation complète.

### 1. Note de veille


- Objectifs du projet : 

Le projet Site Vitrine F1 est une application web monopage (SPA) permettant aux passionnés de Formule 1 de consulter des données en temps réel : résultats de courses, classements pilotes et constructeurs, liste des pilotes, calendrier des circuits, et boutique en ligne. Le projet intègre une gestion d'authentification complète (inscription, connexion, routes protégées) et un système de commentaires par course.

- Sources de veille :  

MDN Web Docs & documentation React 19 (hooks, Server Components, transitions)  
Documentation officielle Vite 7, Tailwind CSS v4 
Supabase Docs – Auth, Row Level Security (RLS), fonctions PostgreSQL (RPC)  
RGPD – CNIL : recommandations sur la collecte minimale de données, durée de conservation  
RGAA 4.1 – Référentiel général d'amélioration de l'accessibilité  
OWASP Top 10 – bonnes pratiques de sécurité web  
GitHub Dependabot & npm audit – surveillance des dépendances vulnérables  
State of JS 2024 – tendances frameworks et bundlers  

- Synthèse des évolutions observées :  

React 19 introduit les Actions et useActionState qui simplifient la gestion des formulaires asynchrones. Vite 7 apporte une compatibilité Node ≥20.19 et des performances accrues au build. Tailwind CSS v4 abandonne le fichier tailwind.config.js au profit d'une configuration CSS-native. Supabase continue d'enrichir ses fonctions RPC PostgreSQL et son système de RLS. La réglementation RGPD exige la mise à jour de l'interface de gestion des consentements et la documentation des données stockées.

- Impacts sur le projet :  

Migration vers React 19 avec adoption progressive des nouvelles APIs d'actions
Variables d'environnement séparées en .env (non commité) et .env.exemple pour sécuriser les clés Supabase
Mise en place de Row Level Security sur les tables Supabase (comments, cart, users)
Politique de not-tracking : aucun outil analytique tiers installé, conformité RGPD allégée
Accessibilité : skip-link, attributs aria-label sur la nav, balises sémantiques HTML5


### 2. Analyse des besoins et benchmark


- Présentation du client :  

Le site cible les fans de F1, sportifs curieux et acheteurs de merchandising. Il se positionne comme un agrégateur de données F1 open-source, gratuit, sans publicité, enrichi d'une boutique et d'un espace communautaire (commentaires).

- Analyse de marché :  

Le marché visé est celui des **plateformes de contenu autour de la Formule 1**, à
l'intersection du sport-data (statistiques, résultats), du média de fans et du
e-commerce de merchandising. C'est un marché en forte croissance : l'audience F1 a
fortement rajeuni et s'est élargie depuis la série Netflix *Drive to Survive*, avec
un public désormais très connecté et demandeur de données en temps réel.

**Cible :** fans de F1 (du suiveur occasionnel au passionné de statistiques),
sportifs curieux, et acheteurs de merchandising. Public majoritairement jeune
(18-40 ans), mobile-first, habitué aux interfaces réactives.

**Positionnement :** agrégateur de données F1 *open-source, gratuit et sans
publicité*, enrichi d'un espace communautaire (commentaires) et d'une boutique.
Le projet se différencie des acteurs propriétaires (F1 officiel) par sa gratuité,
son ouverture (APIs open data OpenF1 / Jolpica-Ergast) et l'absence de tracking.

**Analyse PESTEL :**

| Facteur          | Impact sur le projet                                                                 |
|------------------|--------------------------------------------------------------------------------------|
| **Politique**    | Réglementation européenne sur les données (RGPD) ; droits de diffusion F1 maîtrisés par la FOM (on s'appuie donc sur des données open, pas sur la vidéo). |
| **Économique**   | Marché du merchandising sportif en croissance ; modèle serverless à faible coût fixe permettant un lancement sans investissement lourd. |
| **Social**       | Rajeunissement et élargissement de l'audience F1 (effet *Drive to Survive*) ; forte attente de contenu temps réel et communautaire. |
| **Technologique**| Disponibilité d'APIs open data fiables (OpenF1, Jolpica) ; standardisation des SPA et du BaaS qui abaissent la barrière technique. |
| **Écologique**   | Éco-conception attendue : pas de tracking tiers, lazy-loading, hébergement mutualisé serverless (pas de serveur allumé en permanence). |
| **Légal**        | Conformité RGPD (collecte minimale email/pseudo), respect des conditions d'utilisation des APIs open data, accessibilité RGAA. |

**Analyse SWOT :**

| Interne                                                       | Externe                                                       |
|---------------------------------------------------------------|---------------------------------------------------------------|
| **Forces** : gratuit et sans publicité ; données open ; espace communautaire ; accessibilité (RGAA) ; coûts d'infra faibles (serverless). | **Opportunités** : audience F1 en pleine croissance et rajeunissement ; engouement pour la data sportive ; APIs open data riches et gratuites. |
| **Faiblesses** : dépendance à des APIs externes tierces ; pas de droits sur les contenus officiels (vidéos, logos) ; notoriété nulle au lancement. | **Menaces** : concurrence des acteurs officiels très bien dotés ; risque d'évolution/fermeture des APIs open ; volatilité de l'intérêt hors saison. |

**Stratégie webmarketing envisagée :** référencement naturel (SEO) sur les
requêtes « résultats GP », « classement pilotes » ; contenu communautaire
(commentaires) favorisant le retour des visiteurs ; partage sur les réseaux
sociaux lors des week-ends de course (pics de trafic anticipés dans les tests de
charge, cf. Bloc 4).

- Benchmark :  

| Critère | Site F1 Officiel | F1 Fantasy | Mon Projet |
|---------|------------------|------------|------------|
| API Données F1 | Propriétaire | Propriétaire | OpenF1 + Jolpica (open) |
| Commentaires | Non | Non | Oui (Supabase) |
| Boutique | Oui | Non | Oui (catalogue BDD) |
|Auth Incluse | Oui | Oui | Oui (Supabase Auth) |
| Accessibilité RGAA | Partielle | Non | Oui (skip-link, aria) |

- Synthèse des besoins fonctionnels :  

Consulter les résultats du dernier Grand Prix en page d'accueil  
Lister les pilotes de la saison en cours avec photo et écurie  
Afficher le calendrier complet des circuits de la saison  
Consulter les résultats détaillés de chaque course par round  
Poster et lire des commentaires sur chaque course (utilisateurs connectés)  
Consulter et gérer un classement pilotes et constructeurs  
Parcourir et ajouter des produits à un panier (boutique)  
S'inscrire, se connecter et accéder aux routes protégées (panier)  

- Synthèse des besoins non fonctionnels :  

Performance : build optimisé Vite avec code-splitting, lazy loading des images  
Sécurité : variables d'environnement, RLS Supabase, JWT sessions, routes protégées  
Accessibilité : RGAA 4.1 – skip-link, lang="fr", aria-label, contraste suffisant  
Maintenabilité : ESLint configuré, tests Vitest, CI GitHub Actions  
Responsive : Tailwind CSS mobile-first, menu hamburger pour mobile  
Déploiement continu : Vercel + vercel.json rewrites pour SPA routing  




### 3. Cadrage technique


- Schéma d’architecture :  

## Schéma d'architecture

```
Utilisateur → Vercel CDN (fichiers statiques) → React SPA (Vite + React Router)
                                                   │
                                   ┌───────────────┴───────────────┐
                                   ▼                               ▼
                        APIs F1 externes                    Supabase
                     OpenF1 · Jolpica-Ergast          Auth JWT · PostgreSQL · RLS
                        (lecture seule)         users · comments · products · cart · carts_products
                          
```


Architecture retenue : SPA React + BaaS Supabase
L'architecture choisie repose sur une séparation claire entre le front-end (React SPA) et le back-end as a service (Supabase). Cette approche supprime le besoin d'un serveur Node.js/Express dédié, réduisant la surface d'attaque et les coûts d'infrastructure.

- Description des couches et Choix technologiques

| Couche | Technologie | Justification |
|---------|------------------|------------|
| UI / Framework | React 19 + JSX | Écosystème mature, composants réutilisables, hooks puissants |
| Build / Bundler | Vite 7 | HMR ultra-rapide, ESM natif, build optimisé | 
| Routing | React Router v7 | Gestion SPA avec routes imbriquées (Standings) | 
| Styles | Tailwind CSS v4 | Utility-first, design system rapide, thèmes | 
| BDD & Auth | Supabase (PostgreSQL) | Auth JWT, RLS, RPC, temps réel intégré |
| APIs externes | OpenF1, Jolpica/Ergast | Données F1 gratuites et open-source |
| Tests | Vitest + Testing Library | Tests unitaires/composants, mocks intégrés |
| Linting | ESLint 9 + plugin React | Qualité du code, standards JSX |
| CI/CD | GitHub Actions + Vercel | Build, lint, deploy automatisé | 

### 4. Cahier des charges

Doit inclure :

- besoins fonctionnels
- contraintes techniques
- documentation API
- règles de déploiement
- exigences RGAA

## Routes de l'application

| Route                        | Page                                | Accès                          |
|------------------------------|-------------------------------------|--------------------------------|
| `/`                          | Accueil – résultats dernier GP      | Public                         |
| `/driverList`                | Liste des pilotes de la saison      | Public                         |
| `/circuit`                   | Calendrier des circuits             | Public                         |
| `/raceResult/:round`         | Résultat + commentaires d'une course| Public                         |
| `/standings`                 | Classement pilotes (outlet)         | Public                         |
| `/standings/constructorsStanding` | Classement constructeurs       | Public                         |
| `/shop`                      | Boutique – catalogue produits       | Public                         |
| `/shopCart`                  | Panier utilisateur                  | Protégé (auth)                 |
| `/register`                  | Inscription                         | Public route (redir. si connecté) |
| `/login`                     | Connexion                           | Public route (redir. si connecté) |
| `*`                          | Page 404                            | Public                         |

- Exigences RGAA appliquées :  

Skip-link fonctionnel (#main-content) avec classe sr-only
Attribut lang="fr" sur la balise HTML
aria-label sur le bouton menu hamburger et la nav principale
Attributs alt sur toutes les images de pilotes (src/components/pages/DriverList.jsx)
Balises sémantiques : nav, main (via root div), button, table avec thead/tbody
Contraste : texte noir sur fond blanc, texte blanc sur fonds sombres

- Sécurité :  

Variables d'environnement : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env (ignoré par .gitignore)
Row Level Security Supabase : les utilisateurs ne voient/modifient que leurs propres données (cart, comments)
Auth JWT Supabase : tokens signés côté serveur, rotation de refresh tokens activée
Routes protégées côté client : ProtectedRoute redirige vers /login si non authentifié
PublicRoute redirige vers / si déjà connecté (évite double-inscription)
Clé anon Supabase exposée côté client (RLS défense en profondeur)

---

## BLOC 2 – Développer la partie Front‑End d’une solution digitale

### Compétences

C7 Analyse des usages – C8 Maquettes et intégration – C9 Qualité du code – C10 Sécurité, accessibilité, éco‑conception – C11 Chaîne de développement

### Finalité du bloc

Démontrer la capacité à concevoir, intégrer et livrer une interface utilisateur ergonomique, accessible, sécurisée et conforme au cahier des charges, tout en garantissant la qualité et la maintenabilité du code.

### 1. Analyse des usages et contraintes


- Description des profils utilisateurs et des parcours ;

Visiteur non connecté : consultation des données F1 (résultats, pilotes, circuits, classements), navigation boutique – toutes les pages publiques
Fan connecté : toutes les fonctionnalités ci-dessus + dépôt de commentaires sur les courses + accès au panier d'achat
Utilisateur mobile : navigation responsive, menu hamburger, tableaux avec scroll horizontal

- Liste des contraintes (techniques, navigateurs, terminaux, design) ;

Compatibilité navigateurs : Chrome, Firefox, Safari (Edge) – via Browserslist + Vite/esbuild
Responsive mobile-first : breakpoints Tailwind (sm:, md:) – grille adaptive 1 à 4 colonnes
Performance : lazy loading images (loading="lazy"), hook useFetch réutilisable, pas de re-renders inutiles
SPA routing : vercel.json rewrites pour que React Router gère les URLs en production

- Justification des choix technologiques.

React 19 a été retenu pour sa maturité, son écosystème et la facilité de composition de composants. Tailwind CSS v4 en mode CSS-native élimine la configuration JavaScript et réduit la taille du bundle. Vite 7 offre un HMR instantané en développement et un build ESM optimisé pour la production.

### 2. Maquettes techniques et intégration

- Maquettes ou prototypes ;
- Pages intégrées ;
- Références aux règles d’accessibilité appliquées.

## Composants et fichiers

| Composant / Fichier              | Rôle                                                                 |
|----------------------------------|----------------------------------------------------------------------|
| `App.jsx`                        | Routeur principal – BrowserRouter + Routes imbriquées               |
| `layout/Header.jsx`              | Navigation principale – liens dynamiques selon auth, menu mobile    |
| `pages/Home.jsx`                 | Résultats du dernier GP – tableau issu de l'API Ergast              |
| `pages/DriverList.jsx`           | Grille de cards pilotes – API OpenF1, tri par écurie                |
| `pages/Races/Circuit.jsx`        | Liste des circuits de la saison avec lien vers les résultats        |
| `pages/Races/RaceResult.jsx`     | Tableau de résultats + CommentSection intégrée                      |
| `pages/Comments.jsx`             | Commentaires par course – CRUD Supabase, auth-gated                 |
| `pages/Standings/Standings.jsx`  | Layout outlet avec sous-navigation Pilotes/Constructeurs            |
| `pages/Shop/Shop.jsx`            | Catalogue produits – ajout panier via RPC Supabase                  |
| `pages/Shop/ShopCart.jsx`        | Gestion panier – quantités, suppression, total                      |
| `pages/Login.jsx + Register.jsx` | Formulaires auth Supabase avec validation et feedback               |
| `pages/NotFound.jsx`             | Page 404 avec lien retour accueil                                   |
| `ProtectedRoute.jsx`      | HOC – redirige vers /login si non authentifié                     |
| `PublicRoute.jsx`         | HOC – redirige vers / si déjà connecté                            |
| `context/AuthContext.jsx` | Provider React Context – état utilisateur global via Supabase     |
| `hooks/useFetch.js`       | Hook personnalisé – fetch API avec états loading/error/data       |
| `lib/supabase.js`         | Initialisation client Supabase avec variables d'environnement     |

- Hook personnalisé useFetch – extrait commenté :

Le hook useFetch centralise la logique de récupération de données asynchrones. Il expose trois états : loading (indicateur de chargement), error (erreur réseau ou HTTP) et data (données parsées). Il se réinitialise automatiquement si l'URL change grâce à la dépendance du useEffect.

```
export function useFetch(url) {
  const [state, setState] = useState({ loading: true, error: false, data: null });

  useEffect(() => {
    if (!url) return;
    setState({ loading: true, error: false, data: null });

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setState({ loading: false, error: false, data }))
      .catch(() => setState({ loading: false, error: true, data: null }));
  }, [url]);

  return state;
}
```

### 3. Qualité du code

- l’application des normes et standards ;

ESLint 9 avec plugin react – détection des erreurs JSX, props-types, hooks rules
Règles désactivées volontairement : react/prop-types (projet sans TypeScript), react/react-in-jsx-scope (React 17+)
Babel ESLint parser avec preset-react pour le support JSX
Nommage cohérent : PascalCase pour les composants, camelCase pour les fonctions/hooks
Séparation des responsabilités : hooks/, context/, lib/, components/pages/, components/layout/

- l’utilisation de la méthode SOLID ;

Single Responsibility : chaque composant a un rôle unique (Comments séparé de RaceResult, useFetch isolé)
Open/Closed : Header générique alimenté par tableaux de liens, extensible sans modification du composant
Dependency Inversion : les composants consomment useAuth() et useFetch() via abstractions, pas Supabase directement

- la sécurité et la compatibilité multi‑navigateurs et multi‑supports ;
- la prise en compte de l’éco‑conception.

Lazy loading natif sur les images (<img loading="lazy">) – réduit la bande passante
Bundle optimisé Vite avec tree-shaking automatique – élimine le code mort
Pas de bibliothèque d'icônes lourde – emojis natifs pour les indicateurs visuels
Aucun tracking tiers (Google Analytics, etc.) – réduction des requêtes réseau


### 4. Documentation de la chaîne front‑end

- l’organisation du code ;

src/components/ – tous les composants React (layout/, pages/ avec sous-dossiers Races/, Shop/, Standings/)  
src/context/ – AuthContext.jsx pour la gestion de l'état d'authentification global  
src/hooks/ – hooks personnalisés (useFetch.js)  
src/lib/ – initialisation des clients externes (supabase.js)  
src/css/ – style.css avec imports Tailwind
src/setupTests.jsx – configuration Jest-DOM pour les tests  

- les outils de versioning et de build ;

Vite 7 : transpilation, bundling, HMR (npm run dev) et production build (npm run build)  
Git : branches feature/, commits conventionnels, historique dans .github/  
GitHub Actions (ci.yml) : pipeline sur push/PR – checkout → setup-node → npm ci → lint → build  
Vercel : déploiement automatique sur push main, preview deployments sur PRs

- les procédures de contrôle qualité.

npm run lint – ESLint sur tous les fichiers .js/.jsx/.ts/.tsx  
npm run test – Vitest avec jsdom, setup Testing Library, coverage sur Login et Register  
npm run build – vérification que le build de production ne génère pas d'erreur  
CI bloquante : le merge est impossible si lint ou build échouent  

---

## BLOC 3 – Développer la partie Back‑End d’une solution digitale

### Compétences

C12 Environnement – C13 Bases de données – C14 Architecture logicielle – C15 Sécurité – C16 à C20 Tests, maintenance, documentation

### Finalité du bloc

Démontrer la capacité à concevoir, développer, sécuriser, tester et documenter la partie serveur d’une solution digitale.

### 1. Environnement et architecture

- le choix justifié des technologies, plateformes et langages ;

Le back-end repose sur Supabase, un Backend-as-a-Service open-source construit sur PostgreSQL. Cette architecture élimine la nécessité d'un serveur applicatif dédié tout en offrant des fonctionnalités avancées : authentification JWT, Row Level Security, fonctions PostgreSQL (RPC) et API REST auto-générée.

Base de données : PostgreSQL 17 (Supabase géré) – relationnel, ACID, support JSON  
Auth : Supabase Auth – JWT, refresh token rotation (10s réuse interval), bcrypt passwords  
API : PostgREST auto-généré par Supabase – endpoints REST pour chaque table  
RPC : fonctions PL/pgSQL exposées via supabase.rpc() – ex. upsert_cart_product  
CLI Supabase : migrations versionnées, seed, configuration locale (config.toml)  
Hébergement : cloud Supabase (SaaS) – région configurable, backups automatiques  

#### Couche backend applicative – Supabase Edge Functions

Au-delà de l'API REST auto-générée (PostgREST) et des fonctions RPC PL/pgSQL, le
projet expose une **Edge Function serverless** (`supabase/functions/checkout`)
écrite en TypeScript/Deno. Elle constitue une véritable couche de logique métier
côté serveur, non contournable par le client :

- **Authentification serveur** : l'identité est lue depuis le JWT (`auth.getUser()`),
  jamais depuis le corps de la requête.
- **Validation serveur** : recalcul du total à partir des prix réellement stockés
  en base (le front n'envoie aucun prix), contrôle des quantités (entiers positifs).
  → protection contre la falsification de prix (OWASP A04/A08).
- **Transition d'état contrôlée** : passage du panier de `en_cours` à `valide`
  avec garde-fou anti double-validation.

Appelée côté front via `supabase.functions.invoke("checkout")` depuis la page
panier. Déploiement : `npx supabase functions deploy checkout`.

### 2. Base de données

- MCD et schéma relationnel ;

```
auth.users (Supabase Auth)
      │ 1
      │
      │ 1
    users (id PK/FK, username)
      │ 1
      ├──────────────┐
      │ N            │ N
   comments        cart
(id_utilisateur FK)  │ 1
                      │
                      │ N
              carts_products (id_panier FK, id_produit FK)
                      │ N
                      │
                      │ 1
                  products (id, libelle, prix)
```

- Relations et types de champs ;

| Table | Champ | Type | Contrainte |
|---|---|---|---|
| `users` | `id` | `uuid` | PK, FK → `auth.users(id)` ON DELETE CASCADE |
| `users` | `username` | `text` | UNIQUE, NOT NULL |
| `products` | `id` | `serial` | PK |
| `products` | `libelle` | `text` | NOT NULL |
| `products` | `prix` | `numeric(10,2)` | NOT NULL |
| `comments` | `id` | `serial` | PK |
| `comments` | `id_utilisateur` | `uuid` | FK → `users(id)` ON DELETE CASCADE |
| `comments` | `commentaire` | `text` | NOT NULL |
| `comments` | `id_course` | `varchar(30)` | NOT NULL (identifiant de course venant de l'API externe) |
| `cart` | `id` | `serial` | PK |
| `cart` | `id_utilisateur` | `uuid` | FK → `users(id)` ON DELETE CASCADE |
| `cart` | `statut` | `enum cart_statut` | NOT NULL, défaut `'en_cours'`, valeurs `en_cours`\|`valide` |
| `cart` | `created_at` | `timestamptz` | défaut `now()` |
| `carts_products` | `id` | `serial` | PK |
| `carts_products` | `id_panier` | `int` | FK → `cart(id)` ON DELETE CASCADE |
| `carts_products` | `id_produit` | `int` | FK → `products(id)` ON DELETE CASCADE |
| `carts_products` | `quantite` | `int` | NOT NULL, défaut `1` |
| `carts_products` | — | — | UNIQUE(`id_panier`, `id_produit`) |

Cardinalités : un utilisateur a 0..1 panier actif et 0..N commentaires ; un panier
contient 0..N lignes `carts_products`, chaque ligne référant un produit unique du
panier (contrainte `unique(id_panier, id_produit)`) ; un produit peut apparaître
dans N paniers.

- Justification des choix.

**`id` = `auth.uid()` plutôt qu'un id applicatif séparé.** La table `users` ne
duplique pas l'identité : son `id` référence directement `auth.users(id)` avec
`ON DELETE CASCADE`. Cela évite la désynchronisation entre l'utilisateur Auth et
son profil applicatif, et garantit la suppression en cascade des données liées
(panier, commentaires) si le compte est supprimé.

**Table `cart` séparée de `carts_products` (et non un JSON dans `cart`).** Le
panier est modélisé de façon relationnelle (une ligne par produit) plutôt que
stocké en JSONB pour pouvoir exploiter les contraintes SQL natives : clé unique
`(id_panier, id_produit)` qui empêche les doublons de lignes, clés étrangères
avec `ON DELETE CASCADE`, et requêtes/agrégations simples (`SUM(quantite * prix)`)
sans parsing applicatif.

**`statut` en `enum` plutôt qu'en `text` ou `boolean`.** Le panier suit un cycle
de vie à deux états (`en_cours` → `valide`) géré exclusivement côté serveur par
l'Edge Function `checkout` (cf. Bloc 3.1). Un type `enum` PostgreSQL empêche
toute valeur invalide au niveau base de données, contrainte qu'un simple `text`
ne donnerait pas.

**`prix` en `numeric(10,2)` plutôt qu'en `float`.** Les montants monétaires
utilisent un type à précision fixe pour éviter les erreurs d'arrondi binaire des
flottants — indispensable pour le recalcul serveur du total de commande.

**`id_course` en `varchar(30)` plutôt qu'une clé étrangère vers une table
`races`.** Les données de courses proviennent d'APIs externes (OpenF1,
Jolpica-Ergast) et ne sont pas stockées en base : l'identifiant de course (round)
est donc une simple référence texte, sans intégrité référentielle SQL possible
puisque la table de référence n'existe pas côté Supabase.

**Suppressions en cascade (`ON DELETE CASCADE`) systématiques sur les FK vers
`users`.** Conformité RGPD : la suppression d'un compte utilisateur entraîne
automatiquement la suppression de son panier et de ses commentaires, sans
nécessiter de logique applicative supplémentaire ni laisser de données
orphelines.

**Row Level Security plutôt que filtrage applicatif.** Le schéma relationnel
seul ne suffit pas à isoler les données par utilisateur côté client (clé `anon`
publique) : la sécurité d'accès est donc reportée sur des politiques RLS
PostgreSQL (cf. Bloc 3.3), qui s'appliquent au niveau base de données et ne
peuvent pas être contournées par un appel API direct.

### 3. Sécurité et conformité

- l’authentification et l’autorisation ;

Supabase Auth : inscription par email/password, hashage bcrypt, JWT signé côté serveur
Durée de session : 3600 secondes (1h) avec rotation de refresh token activée
Longueur minimale du mot de passe : 6 caractères côté Supabase, 8 caractères côté client (validation Register.jsx)
Clé anon Supabase : exposée côté client (nécessaire) – sécurité assurée par RLS
Row Level Security : chaque utilisateur ne peut lire/écrire que ses propres enregistrements dans cart, carts_products et comments
ProtectedRoute React : vérification côté client du contexte auth avant accès à /shopCart

- la protection des données ;

Variables d'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env (listé dans .gitignore)
Fichier .env.exemple fourni sans valeurs réelles pour guider les développeurs
Aucune donnée sensible stockée en localStorage – sessions gérées par Supabase Auth
Politique RGPD : collecte minimale (email, pseudo uniquement), pas de tracking tiers

- la conformité RGPD.

enable_anonymous_sign_ins = false – pas de comptes anonymes  
enable_confirmations = false (dev) – à activer en production avec SMTP  
double_confirm_changes = true – double confirmation email pour changement d'email  
enable_refresh_token_rotation = true – rotation automatique des tokens  
minimum_password_length = 6 (Supabase) + 8 (validation front)


### 4. Tests et maintenance

- la mise en place de tests unitaires et automatisés ;
- le monitoring et la journalisation.

vi.hoisted() pour déclarer les mocks avant les imports – évite les problèmes de hoisting ESM  
vi.mock('react-router-dom') – mock de useNavigate avec mockNavigate  
vi.mock('../../lib/supabase') – mock de supabase.auth.signInWithPassword / signUp  
vi.clearAllMocks() dans beforeEach – isolation des tests

Vitest 4 avec environment jsdom (DOM simulé) configuré dans vite.config.js  
@testing-library/jest-dom pour les matchers dom (toBeInTheDocument, etc.)  
@testing-library/react pour render, screen, fireEvent, waitFor  
setupFiles : src/setupTests.jsx importe jest-dom automatiquement  



### 5. Documentation

Elle doit être rédigée en français et en anglais.

---

## BLOC 4 – Piloter un projet DevOps de développement

### Compétences

C21 à C23 Environnement collaboratif et agile – C24 à C26 Pilotage – C27 Tests de charge – C28 Autoscaling

### Finalité du bloc

Démontrer la capacité à organiser, piloter et optimiser un projet DevOps en intégrant collaboration, agilité, performance, sécurité et amélioration continue.

### 1. Environnement collaboratif et SCM

Workflow Git implémenté :  

Dépôt GitHub public avec historique de commits complet  
Branche main protégée – pipeline CI obligatoire avant merge  
Branches feature/nomFeature pour chaque nouvelle fonctionnalité (ex : feature/shop-cart, feature/comments)  
Commits atomiques et descriptifs – un commit = une modification logique  
Pull Requests avec revue de code avant merge  
Tags de version sur les releases significatives  

Pipeline CI/CD (.github/workflows/ci.yml) :  
La pipeline GitHub Actions se déclenche sur chaque push et pull request. Elle exécute trois étapes en séquence :  
actions/checkout@v4 – récupération du code source  
actions/setup-node@v4 – installation de Node.js  
npm ci – installation déterministe des dépendances (package-lock.json)  
npm run lint – vérification ESLint (bloquant si erreurs)  
npm run build – build Vite de production (bloquant si erreurs)

### 3. Tests de performance et montée en charge

Des tests de charge ont été mis en place avec **k6** (Grafana Labs). Les
scénarios, scripts et résultats détaillés sont versionnés dans le dossier
[`load-tests/`](load-tests/README.md).

**Outil retenu : k6.** Choisi plutôt que JMeter car les scénarios sont écrits en
JavaScript (cohérent avec la stack du projet), versionnables dans Git et lisibles,
là où un export JMeter `.jmx` est en XML peu lisible.

**Hypothèse de trafic :**

| Scénario         | Utilisateurs simultanés | Justification                                |
|------------------|-------------------------|----------------------------------------------|
| Nominal          | ~50                     | trafic courant d'un site vitrine de niche    |
| Pic (jour de GP) | ~200                    | affluence lors d'un Grand Prix / actualité F1|

Critères d'acceptation : latence **p95 < 800 ms** et **taux d'erreur < 1 %**.

**Scénarios de test** (paliers montée → palier nominal → pic → descente) :

- `load-tests/read-drivers.js` – lecture API REST Supabase (`/rest/v1/products`), 50 → 200 VUs.
- `load-tests/checkout.js` – Edge Function `checkout` avec auth JWT (écriture, charge modérée).

**Résultats** (lecture, scénario complet 50 → 200 VUs sur 2 min 30, environnement Supabase local) :

| Métrique                    | Valeur mesurée  | Seuil    | Verdict |
|-----------------------------|-----------------|----------|---------|
| Requêtes totales (débit)    | 10 411 (69,2/s) | —        | —       |
| `http_req_duration` médiane | 8,11 ms         | —        | —       |
| `http_req_duration` p95     | 50,66 ms        | < 800 ms | ✅      |
| `http_req_failed` (erreurs) | 0,00 %          | < 1 %    | ✅      |
| Checks réussis              | 20 822 / 20 822 | 100 %    | ✅      |
| VUs max                     | 200             | —        | —       |

**Analyse des goulots d'étranglement.** Sous un pic de 200 utilisateurs
simultanés, l'API de lecture reste très performante (p95 ≈ 51 ms, ~16× sous le
seuil) avec un taux d'erreur nul. Le facteur limitant identifié de l'architecture
n'est pas le front (servi par CDN) mais le **nombre de connexions PostgreSQL**
(pooler Supavisor de Supabase) : sous très forte charge, c'est la base de données
qui sature en premier.

### 4. Autoscaling et optimisation


L'architecture étant **entièrement serverless**, il n'y a pas de serveur à
dimensionner manuellement : la montée en charge est assurée automatiquement par
les plateformes.

| Couche                     | Mécanisme de montée en charge                        | Limite / point d'attention                        |
|----------------------------|------------------------------------------------------|---------------------------------------------------|
| Front (Vercel)             | CDN edge mondial, scaling automatique                | Statique : pratiquement illimité                  |
| Edge Functions (Supabase)  | Isolates Deno instanciés à la demande                | Cold start sur la première requête                |
| Base PostgreSQL (Supabase) | Pooler de connexions Supavisor                       | **Goulot réel** : nombre de connexions Postgres   |

**Maintien de la performance sous charge** : confirmé par les tests de charge
(p95 ≈ 51 ms, 0 % d'erreur à 200 VUs).

**Optimisation des coûts** : le modèle serverless ne facture que l'usage réel
(pas de serveur allumé en permanence). Pistes d'optimisation identifiées :
mise en cache côté front pour réduire les re-fetch, pagination des résultats, et
passage à un plan Supabase supérieur uniquement si le trafic réel dépasse
l'hypothèse de pic.