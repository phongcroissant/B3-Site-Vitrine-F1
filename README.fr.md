# Site Vitrine F1 — Documentation technique et fonctionnelle (FR)

> Version française de la documentation projet (RNCP C20 — *documentation technique et fonctionnelle en français et en anglais*).
> English version : voir [`README.en.md`](./README.en.md).

---

## 1. Présentation

**Site Vitrine F1** est une application web monopage (SPA) qui permet aux passionnés de
Formule 1 de consulter des données de course — résultats du dernier Grand Prix,
classements pilotes et constructeurs, liste des pilotes de la saison et calendrier des
circuits — en plus d'une boutique en ligne et d'un système de commentaires par course.

### Profils utilisateurs

| Profil | Capacités |
|---|---|
| **Visiteur** (non connecté) | Consulter toutes les données publiques (résultats, pilotes, circuits, classements) et la boutique |
| **Fan authentifié** | Tout ce qui précède **+** poster des commentaires **+** gérer un panier et valider une commande |

### Fonctionnalités principales

- Résultats du dernier Grand Prix sur la page d'accueil (API F1 externe)
- Liste des pilotes de la saison avec écurie et photo
- Calendrier complet des circuits avec lien vers chaque résultat
- Résultats détaillés par course (round) avec section commentaires
- Classements pilotes et constructeurs (routes imbriquées)
- Catalogue boutique, gestion du panier et validation de commande côté serveur
- Authentification (inscription, connexion, routes protégées/publiques)

---

## 2. Stack technique et architecture

| Couche | Technologie | Justification |
|---|---|---|
| UI / Framework | React 19 + JSX | Écosystème mature, composants réutilisables, hooks puissants |
| Build / Bundler | Vite 7 | HMR instantané, ESM natif, build de production optimisé |
| Routing | React Router v7 | Routing SPA avec routes imbriquées (Standings) |
| Styles | Tailwind CSS v4 + DaisyUI v5 | Utility-first, design system prêt à l'emploi, thèmes |
| BDD & Auth | Supabase (PostgreSQL 17) | Auth JWT, Row Level Security, fonctions RPC |
| Logique backend | Supabase Edge Function (Deno/TypeScript) | Logique métier côté serveur (checkout) |
| APIs externes | OpenF1, Jolpica/Ergast | Données F1 gratuites et open-source |
| Tests | Vitest + Testing Library | Tests unitaires/composants avec mocks intégrés |
| Linting | ESLint 9 + plugin React | Qualité du code, standards JSX |
| CI/CD | GitHub Actions + Vercel | Lint, tests, build et déploiement automatisés |

### Schéma d'architecture

```
Utilisateur → Vercel CDN → React SPA (build Vite) → [React Router] → Composants pages
                                       │
                                       ├─→ APIs externes : OpenF1 / Jolpica-Ergast (données F1 en lecture)
                                       │
                                       └─→ Supabase
                                             ├─ Auth (JWT)
                                             ├─ PostgreSQL + Row Level Security
                                             │    tables : users | comments | products | cart | carts_products
                                             ├─ RPC : upsert_cart_product
                                             └─ Edge Function : checkout (validation côté serveur)
```

L'application repose sur une architecture **SPA + BaaS** : le front React communique
directement avec Supabase, qui fournit l'authentification, la base de données et la
logique backend serverless. Cette approche supprime le besoin d'un serveur Node.js/Express
dédié, réduisant à la fois la surface d'attaque et les coûts d'infrastructure. La logique
sensible qui ne doit pas être confiée au client (calcul du prix, validation de commande)
est isolée dans une Edge Function Supabase.

---

## 3. Démarrage

### Prérequis

- Node.js **≥ 20.19**
- Un projet Supabase (URL + clé anon)

### Installation

```bash
git clone <url-du-depot>
cd B3-Site-Vitrine-F1
npm install
cp .env.example .env   # puis renseigner les identifiants Supabase
```

### Variables d'environnement

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clé anon publique (exposable — protégée par la RLS) |

Le fichier `.env` est ignoré par Git. Utiliser `.env.example` comme modèle.

### Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement (Vite + HMR) |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualise le build de production en local |
| `npm run lint` | Lance ESLint sur tous les fichiers `.js/.jsx/.ts/.tsx` |
| `npm run test` | Lance la suite de tests Vitest |

---

## 4. Structure du projet

```
src/
├─ components/
│  ├─ layout/         Header (navigation principale, menu mobile)
│  ├─ pages/          Pages de routes (Home, DriverList, Races/, Shop/, Standings/, ...)
│  ├─ ui/             UI réutilisable (ResultTable, SearchBar)
│  ├─ ProtectedRoute.jsx   Redirige vers /login si non authentifié
│  └─ PublicRoute.jsx      Redirige vers / si déjà authentifié
├─ context/           AuthContext (état d'authentification global via Supabase)
├─ hooks/             useFetch (fetch asynchrone avec états loading/error/data)
├─ lib/               supabase.js (initialisation du client Supabase)
└─ css/               Styles Tailwind + DaisyUI
supabase/
├─ migrations/        Schéma SQL versionné, RPC et politiques RLS
└─ functions/         Edge Functions (checkout) + helpers partagés
```

---

## 5. Routes de l'application

| Route | Page | Accès |
|---|---|---|
| `/` | Accueil – résultats du dernier GP | Public |
| `/driverList` | Liste des pilotes de la saison | Public |
| `/circuit` | Calendrier des circuits | Public |
| `/raceResult/:round` | Résultat de course + commentaires | Public |
| `/standings` | Classement pilotes (outlet) | Public |
| `/standings/constructorsStanding` | Classement constructeurs | Public |
| `/shop` | Catalogue boutique | Public |
| `/shopCart` | Panier utilisateur | Protégé (auth) |
| `/register` | Inscription | Public (redirige si connecté) |
| `/login` | Connexion | Public (redirige si connecté) |
| `*` | Page 404 | Public |

---

## 6. Documentation backend & API

### Modèle de données (PostgreSQL)

| Table | Rôle | Relations clés |
|---|---|---|
| `users` | Utilisateurs de l'application | `id` = `auth.uid()` |
| `products` | Catalogue boutique | — |
| `cart` | Un panier par utilisateur | `id_utilisateur` → `users.id` |
| `carts_products` | Lignes du panier | `id_panier` → `cart.id`, réf. produit |
| `comments` | Commentaires par course | `id_utilisateur` → `users.id` |

### Row Level Security (RLS)

La RLS est activée sur **toutes** les tables (voir `supabase/migrations/...rls.sql`). En résumé :

- `products` — lecture publique ; aucune écriture côté client
- `comments` — lecture publique ; insertion/modification/suppression réservées à l'auteur (`auth.uid() = id_utilisateur`)
- `users` — chaque utilisateur ne lit/modifie que sa propre ligne
- `cart` / `carts_products` — accessibles uniquement au propriétaire du panier

La clé anon étant publique, la RLS constitue le mécanisme principal de défense en
profondeur : un utilisateur ne peut jamais lire ni modifier le panier ou les
commentaires d'un autre.

### Fonction RPC

- `upsert_cart_product` — ajoute un produit au panier ou incrémente sa quantité en un
  seul appel transactionnel (`supabase.rpc('upsert_cart_product', ...)`).

### Edge Function — `checkout`

Fonction backend serverless (Deno/TypeScript) située dans `supabase/functions/checkout`.
Elle applique des règles métier qui ne doivent **pas** être confiées au client :

| Aspect | Comportement |
|---|---|
| **Endpoint** | `POST` — appelée via `supabase.functions.invoke("checkout")` |
| **Authentification** | Identité lue depuis le JWT (en-tête `Authorization`), jamais depuis le corps de la requête |
| **Validation côté serveur** | Recalcul du total à partir des prix stockés en base (le front n'envoie aucun prix) et contrôle des quantités (entiers positifs) — protection contre la falsification de prix (OWASP A04/A08) |
| **Transition d'état** | Passage du panier de `en_cours` à `valide` avec garde-fou anti double-validation |
| **Déploiement** | `npx supabase functions deploy checkout` |

---

## 7. Sécurité

- **Authentification** : Supabase Auth (email/mot de passe, hashage bcrypt, JWT signé,
  rotation des refresh tokens). Longueur minimale du mot de passe côté client : 8 caractères.
- **Autorisation** : Row Level Security sur chaque table + `ProtectedRoute` côté client.
- **Secrets** : identifiants dans `.env` ignoré par Git ; seule la clé anon publique atteint le client.
- **Frontière de confiance serveur** : validation du prix et de la commande assurée par
  l'Edge Function `checkout`, pas par le navigateur.
- **RGPD** : collecte minimale (email + pseudo), aucun tracking tiers.

---

## 8. Tests & CI/CD

- **Tests** : Vitest 4 avec environnement `jsdom` et Testing Library ; Supabase et
  React Router sont mockés (`vi.mock`, `vi.hoisted`).
- **Intégration continue** (`.github/workflows/ci.yml`) : à chaque push et pull request,
  la pipeline exécute `npm ci` → `npm run lint` → `npm run test -- run` → `npm run build`.
  Une étape en échec bloque le merge.

---

## 9. Déploiement

- **Hébergement** : Vercel, déploiement automatique sur push vers `main`, déploiements de
  prévisualisation sur les pull requests.
- **Routing SPA** : `vercel.json` (rewrites) pour que React Router gère les URLs côté client.
- **Edge Function** : déployée séparément avec `npx supabase functions deploy checkout`.
- **Base de données** : migrations appliquées via la CLI Supabase (`supabase db push`).

---

## 10. Maintenance

- **Dépendances** : suivi des vulnérabilités via `npm audit` et GitHub Dependabot ;
  montées de version testées localement avant merge.
- **Schéma de base** : toute évolution passe par une migration SQL versionnée dans
  `supabase/migrations/` (jamais de modification manuelle en production).
- **Gestion des anomalies** : suivi via les issues GitHub ; correction sur une branche
  dédiée puis pull request.
- **Quality gate** : la pipeline CI (lint + tests + build) est bloquante avant chaque
  merge et constitue le garde-fou de non-régression.
