# Livret candidat – RNCP Concepteur Développeur Web Full Stack

Ce livret guide pas à pas la production des livrables et la préparation des soutenances pour chacun des blocs RNCP.

---

## BLOC 1 – Concevoir un projet de développement digital sécurisé

### Compétences

C1 Veille – C2 Analyse des besoins – C3 IA/Data – C4 Architecture – C5 Cahier des charges – C6 Accessibilité

### Finalité du bloc

Démontrer la capacité à analyser un besoin, à structurer un projet digital, à choisir une architecture sécurisée, accessible et responsable, et à produire la documentation complète.

### 1. Note de veille

Elle doit montrer :

- l’existence d’un processus structuré de veille (technologique, juridique, concurrentielle, environnementale) ;
- l’identification des évolutions technologiques et réglementaires (RGPD, CNIL, RSE, RGAA) ;
- la justification des choix techniques et d’hébergement au regard de la performance, de la sécurité et de l’éco‑responsabilité ;
- la prise en compte des recommandations du CIGREF et des problématiques d’obsolescence.

À produire :

- Objectifs du projet : 

Le projet Site Vitrine F1 est une application web monopage (SPA) permettant aux passionnés de Formule 1 de consulter des données en temps réel : résultats de courses, classements pilotes et constructeurs, liste des pilotes, calendrier des circuits, et boutique en ligne. Le projet intègre une gestion d'authentification complète (inscription, connexion, routes protégées) et un système de commentaires par course.

- Sources de veille :  

MDN Web Docs & documentation React 19 (hooks, Server Components, transitions)  
Documentation officielle Vite 7, Tailwind CSS v4, DaisyUI v5  
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

Doit démontrer :

- la compréhension du marché, de la cible et de la concurrence ;
- l’utilisation d’outils type SWOT et PESTEL ;
- l’analyse de la stratégie webmarketing ;
- la prise en compte des situations de handicap.

À produire :

- Présentation du client :  

Le site cible les fans de F1, sportifs curieux et acheteurs de merchandising. Il se positionne comme un agrégateur de données F1 open-source, gratuit, sans publicité, enrichi d'une boutique et d'un espace communautaire (commentaires).

- Analyse de marché :  


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

Doit démontrer :

- le choix argumenté d’une architecture (MERN, MEAN, etc.) :
- la cohérence de la stack technique ;
- la prise en compte de la sécurité, de l’éthique et de l’accessibilité.

À produire :

- Schéma d’architecture :  

## Schéma d'architecture

```
Utilisateur → Vercel CDN → React SPA (Vite build) → [React Router] → Composants pages
                                             ↓
                          Supabase (Auth JWT + PostgreSQL + RLS)
                                             ↓
                          Tables : users | comments | products | cart | carts_products
                                             ↑
                          APIs externes : OpenF1 API / Jolpi Ergast API
```


Architecture retenue : SPA React + BaaS Supabase
L'architecture choisie repose sur une séparation claire entre le front-end (React SPA) et le back-end as a service (Supabase). Cette approche supprime le besoin d'un serveur Node.js/Express dédié, réduisant la surface d'attaque et les coûts d'infrastructure.

- Description des couches et Choix technologiques

| Couche | Technologie | Justification |
|---------|------------------|------------|
| UI / Framework | React 19 + JSX | Écosystème mature, composants réutilisables, hooks puissants |
| Build / Bundler | Vite 7 | HMR ultra-rapide, ESM natif, build optimisé | 
| Routing | React Router v7 | Gestion SPA avec routes imbriquées (Standings) | 
| Styles | Tailwind CSS v4 + DaisyUI v5 | Utility-first, design system rapide, thèmes | 
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



### Préparation à l’oral

Présenter :

- la démarche d’analyse
- la veille
- l’architecture
- les choix IA
- la sécurité et l’accessibilité

---

## BLOC 2 – Développer la partie Front‑End d’une solution digitale

### Compétences

C7 Analyse des usages – C8 Maquettes et intégration – C9 Qualité du code – C10 Sécurité, accessibilité, éco‑conception – C11 Chaîne de développement

### Finalité du bloc

Démontrer la capacité à concevoir, intégrer et livrer une interface utilisateur ergonomique, accessible, sécurisée et conforme au cahier des charges, tout en garantissant la qualité et la maintenabilité du code.

### 1. Analyse des usages et contraintes

Elle doit montrer :

- l’identification des usages de la solution (profils utilisateurs, parcours, objectifs) ;
- l’analyse des contraintes techniques et graphiques ;
- la justification des choix de plateformes, de langages et de frameworks.

À produire :

- Description des profils utilisateurs et des parcours ;

Visiteur non connecté : consultation des données F1 (résultats, pilotes, circuits, classements), navigation boutique – toutes les pages publiques
Fan connecté : toutes les fonctionnalités ci-dessus + dépôt de commentaires sur les courses + accès au panier d'achat
Utilisateur mobile : navigation responsive, menu hamburger, tableaux avec scroll horizontal

- Liste des contraintes (techniques, navigateurs, terminaux, design) ;

Compatibilité navigateurs : Chrome, Firefox, Safari (Edge) – via Browserslist + Vite/esbuild
Responsive mobile-first : breakpoints Tailwind (sm:, md:) – grille adaptive 1 à 4 colonnes
Thème DaisyUI Dracula (attribut data-theme dans index.html)
Performance : lazy loading images (loading="lazy"), hook useFetch réutilisable, pas de re-renders inutiles
SPA routing : vercel.json rewrites pour que React Router gère les URLs en production

- Justification des choix technologiques.

React 19 a été retenu pour sa maturité, son écosystème et la facilité de composition de composants. Tailwind CSS v4 en mode CSS-native élimine la configuration JavaScript et réduit la taille du bundle. DaisyUI fournit un design system prêt à l'emploi (cards, tables, navbars) sans JavaScript supplémentaire. Vite 7 offre un HMR instantané en développement et un build ESM optimisé pour la production.

### 2. Maquettes techniques et intégration

Elle doit montrer :

- la maîtrise de HTML, CSS, JavaScript et des frameworks (React, Angular…) ;
- le respect du cahier des charges, des règles d’ergonomie et du RGAA ;
- la cohérence de la structure des pages.

À produire :

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

Elle doit montrer :

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
DaisyUI chargé uniquement via plugin CSS – pas de JavaScript DaisyUI en bundle
Aucun tracking tiers (Google Analytics, etc.) – réduction des requêtes réseau


À produire :

- Extraits de code commentés ;
- Résultats de tests de compatibilité ;
- Justification des bonnes pratiques.

### 4. Documentation de la chaîne front‑end

Elle doit montrer :

- l’organisation du code ;

src/components/ – tous les composants React (layout/, pages/ avec sous-dossiers Races/, Shop/, Standings/)  
src/context/ – AuthContext.jsx pour la gestion de l'état d'authentification global  
src/hooks/ – hooks personnalisés (useFetch.js)  
src/lib/ – initialisation des clients externes (supabase.js)  
src/css/ – style.css avec imports Tailwind et plugin DaisyUI  
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


### Préparation à l’oral

Présenter :

- la maquette et les choix UX/UI ;
- les choix technologiques ;
- la façon dont l’accessibilité, la sécurité et la performance ont été prises en compte.

---

## BLOC 3 – Développer la partie Back‑End d’une solution digitale

### Compétences

C12 Environnement – C13 Bases de données – C14 Architecture logicielle – C15 Sécurité – C16 à C20 Tests, maintenance, documentation

### Finalité du bloc

Démontrer la capacité à concevoir, développer, sécuriser, tester et documenter la partie serveur d’une solution digitale.

### 1. Environnement et architecture

Elle doit montrer :

- le choix justifié des technologies, plateformes et langages ;

Le back-end repose sur Supabase, un Backend-as-a-Service open-source construit sur PostgreSQL. Cette architecture élimine la nécessité d'un serveur applicatif dédié tout en offrant des fonctionnalités avancées : authentification JWT, Row Level Security, fonctions PostgreSQL (RPC) et API REST auto-générée.

Base de données : PostgreSQL 17 (Supabase géré) – relationnel, ACID, support JSON  
Auth : Supabase Auth – JWT, refresh token rotation (10s réuse interval), bcrypt passwords  
API : PostgREST auto-généré par Supabase – endpoints REST pour chaque table  
RPC : fonctions PL/pgSQL exposées via supabase.rpc() – ex. upsert_cart_product  
CLI Supabase : migrations versionnées, seed, configuration locale (config.toml)  
Hébergement : cloud Supabase (SaaS) – région configurable, backups automatiques  

- la cohérence de l’architecture logicielle.

À produire :

- Description du framework, de l’API et du cloud;
- Schéma d’architecture.

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

Elle doit montrer :

- la conception d’un schéma relationnel optimisé ;
- l’intégration de l’ORM ;
- la sécurité et la conformité.

À produire :

- MCD et schéma relationnel ;
- Relations et types de champs ;
- Justification des choix.

### 3. Sécurité et conformité

Elle doit montrer :

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

Elle doit montrer :

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

### Préparation à l’oral

Présenter :

- l’architecture back‑end ;
- la sécurité ;
- la base de données ;
- une partie du projet en anglais ;
- une revue de code.

---

## BLOC 4 – Piloter un projet DevOps de développement

### Compétences

C21 à C23 Environnement collaboratif et agile – C24 à C26 Pilotage – C27 Tests de charge – C28 Autoscaling

### Finalité du bloc

Démontrer la capacité à organiser, piloter et optimiser un projet DevOps en intégrant collaboration, agilité, performance, sécurité et amélioration continue.

### 1. Environnement collaboratif et SCM

Il doit montrer :

- la cartographie des processus du projet (de la demande client au déploiement) ;
- le déploiement d’un système de gestion de code source distribué (Git) ;
- la définition d’un workflow (branches, merge, revue de code, gestion des bugs) ;
- le paramétrage des outils collaboratifs (tickets, documentation, CI/CD).

À produire :

- Schéma des processus ;
- Dépôt Git avec historique ;
- Description du workflow ;
- Accès à la documentation.

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



### 2. Gestion agile et pilotage d’équipe

Elle doit montrer :

- l’identification des ressources humaines par tâche ;
- la priorisation du backlog ;
- la planification des sprints ;
- l’animation des réunions (daily, review, rétrospective) ;
- la rédaction des comptes rendus.

À produire :

- Backlog ;
- Planning des sprints ;
- Comptes rendus ;
- Indicateurs de suivi.

### 3. Tests de performance et montée en charge

Elle doit montrer :

- la définition d’hypothèses de trafic (utilisateurs, pages, durée, volume) ;
- l’utilisation d’outils (JMeter, Gatling, Siege) ;
- la mesure des indicateurs clés (temps de réponse, débit, erreurs, ressources) ;
- l’analyse des goulots d’étranglement.

À produire :

- Scénarios de test ;
- Résultats ;
- Analyse.

### 4. Autoscaling et optimisation

Elle doit montrer :

- la mise en place de règles d’autoscaling ;
- la capacité à maintenir la performance sous charge ;
- l’optimisation des coûts.

### Préparation à l’oral

Présenter :

- l’organisation DevOps ;
- la gestion agile ;
- les résultats des tests de charge ;
- l’autoscaling ;
- la démarche d’amélioration continue.
Affichage de Livret candidat – RNCP Concepteur Développeur Web Full Stack.md