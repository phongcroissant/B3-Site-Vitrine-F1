# F1 Showcase Site — Technical & Functional Documentation (EN)

> English version of the project documentation (RNCP C20 — *technical and functional documentation in French and English*).
> French version: see [`README.md`](./README.md).

---

## 1. Overview

**F1 Showcase Site** is a single-page application (SPA) that lets Formula 1 fans browse
live racing data — latest Grand Prix results, driver and constructor standings, the
season's driver list and circuit calendar — alongside an online shop and a per-race
comment system.

### User profiles

| Profile | Capabilities |
|---|---|
| **Visitor** (not signed in) | Browse all public data (results, drivers, circuits, standings) and the shop catalogue |
| **Authenticated fan** | Everything above **+** post comments on races **+** manage a shopping cart and checkout |

### Main features

- Latest Grand Prix results on the home page (external F1 API)
- Season driver list with team and photo
- Full circuit calendar with links to each race result
- Detailed per-round race results with a comment section
- Driver and constructor standings (nested routes)
- Shop catalogue, cart management and server-side checkout
- Authentication (sign up, sign in, protected/public routes)

---

## 2. Tech stack & architecture

| Layer | Technology | Rationale |
|---|---|---|
| UI / Framework | React 19 + JSX | Mature ecosystem, reusable components, powerful hooks |
| Build / Bundler | Vite 7 | Instant HMR, native ESM, optimized production build |
| Routing | React Router v7 | SPA routing with nested routes (Standings) |
| Styling | Tailwind CSS v4 + DaisyUI v5 | Utility-first, ready-made design system, theming |
| Database & Auth | Supabase (PostgreSQL 17) | JWT auth, Row Level Security, RPC functions |
| Backend logic | Supabase Edge Function (Deno/TypeScript) | Server-side business logic (checkout) |
| External APIs | OpenF1, Jolpica/Ergast | Free, open-source F1 data |
| Tests | Vitest + Testing Library | Unit/component tests with built-in mocks |
| Linting | ESLint 9 + React plugin | Code quality, JSX standards |
| CI/CD | GitHub Actions + Vercel | Automated lint, test, build and deploy |

### Architecture diagram

```
User → Vercel CDN → React SPA (Vite build) → [React Router] → Page components
                                       │
                                       ├─→ External APIs: OpenF1 / Jolpica-Ergast (read-only F1 data)
                                       │
                                       └─→ Supabase
                                             ├─ Auth (JWT)
                                             ├─ PostgreSQL + Row Level Security
                                             │    tables: users | comments | products | cart | carts_products
                                             ├─ RPC: upsert_cart_product
                                             └─ Edge Function: checkout (server-side validation)
```

The application uses a **SPA + BaaS** architecture: the React front end talks directly
to Supabase, which provides authentication, the database and serverless backend logic.
This removes the need for a dedicated Node.js/Express server, reducing both the attack
surface and infrastructure cost. Security-sensitive logic that must not be trusted to
the client (price calculation, order validation) lives in a Supabase Edge Function.

---

## 3. Getting started

### Prerequisites

- Node.js **≥ 20.19**
- A Supabase project (URL + anon key)

### Installation

```bash
git clone <repository-url>
cd B3-Site-Vitrine-F1
npm install
cp .env.example .env   # then fill in your Supabase credentials
```

### Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key (safe to expose — protected by RLS) |

The `.env` file is git-ignored. Use `.env.example` as a template.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Vite + HMR) |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on all `.js/.jsx/.ts/.tsx` files |
| `npm run test` | Run the Vitest test suite |

---

## 4. Project structure

```
src/
├─ components/
│  ├─ layout/         Header (main navigation, mobile menu)
│  ├─ pages/          Route pages (Home, DriverList, Races/, Shop/, Standings/, ...)
│  ├─ ui/             Reusable UI (ResultTable, SearchBar)
│  ├─ ProtectedRoute.jsx   Redirects to /login if not authenticated
│  └─ PublicRoute.jsx      Redirects to / if already authenticated
├─ context/           AuthContext (global auth state via Supabase)
├─ hooks/             useFetch (async fetch with loading/error/data states)
├─ lib/               supabase.js (Supabase client initialization)
└─ css/               Tailwind + DaisyUI styles
supabase/
├─ migrations/        Versioned SQL schema, RPC and RLS policies
└─ functions/         Edge Functions (checkout) + shared helpers
```

---

## 5. Application routes

| Route | Page | Access |
|---|---|---|
| `/` | Home – latest GP results | Public |
| `/driverList` | Season driver list | Public |
| `/circuit` | Circuit calendar | Public |
| `/raceResult/:round` | Race result + comments | Public |
| `/standings` | Driver standings (outlet) | Public |
| `/standings/constructorsStanding` | Constructor standings | Public |
| `/shop` | Shop catalogue | Public |
| `/shopCart` | User cart | Protected (auth) |
| `/register` | Sign up | Public (redirects if signed in) |
| `/login` | Sign in | Public (redirects if signed in) |
| `*` | 404 page | Public |

---

## 6. Backend & API documentation

### Data model (PostgreSQL)

| Table | Purpose | Key relations |
|---|---|---|
| `users` | Application users | `id` = `auth.uid()` |
| `products` | Shop catalogue | — |
| `cart` | One cart per user | `id_utilisateur` → `users.id` |
| `carts_products` | Cart line items | `id_panier` → `cart.id`, product ref |
| `comments` | Per-race comments | `id_utilisateur` → `users.id` |

### Row Level Security (RLS)

RLS is enabled on **all** tables (see `supabase/migrations/...rls.sql`). Summary:

- `products` — public read; no client-side writes
- `comments` — public read; insert/update/delete restricted to the author (`auth.uid() = id_utilisateur`)
- `users` — each user can only read/update their own row
- `cart` / `carts_products` — accessible only to the owner of the cart

Because the anon key is public, RLS is the primary defense-in-depth mechanism: a user
can never read or modify another user's cart or comments.

### RPC function

- `upsert_cart_product` — adds a product to the cart or increments its quantity in a
  single transactional call (`supabase.rpc('upsert_cart_product', ...)`).

### Edge Function — `checkout`

A serverless backend function (Deno/TypeScript) located in
`supabase/functions/checkout`. It enforces business rules that must **not** be trusted
to the client:

| Aspect | Behavior |
|---|---|
| **Endpoint** | `POST` — called via `supabase.functions.invoke("checkout")` |
| **Auth** | Identity read from the JWT (`Authorization` header), never from the request body |
| **Server-side validation** | Recomputes the total from prices stored in the database (the front end sends no prices) and validates quantities (positive integers) — protects against price tampering (OWASP A04/A08) |
| **State transition** | Moves the cart from `en_cours` to `valide` with a guard against double validation |
| **Deploy** | `npx supabase functions deploy checkout` |

---

## 7. Security

- **Authentication**: Supabase Auth (email/password, bcrypt hashing, signed JWT,
  refresh-token rotation). Client-side minimum password length: 8 characters.
- **Authorization**: Row Level Security on every table + `ProtectedRoute` on the client.
- **Secrets**: credentials in git-ignored `.env`; only the public anon key reaches the client.
- **Server-side trust boundary**: price and order validation handled by the `checkout`
  Edge Function, not the browser.
- **Privacy (GDPR)**: minimal data collection (email + username), no third-party tracking.

---

## 8. Testing & CI/CD

- **Tests**: Vitest 4 with the `jsdom` environment and Testing Library; Supabase and
  React Router are mocked (`vi.mock`, `vi.hoisted`).
- **Continuous integration** (`.github/workflows/ci.yml`): on every push and pull
  request, the pipeline runs `npm ci` → `npm run lint` → `npm run test -- run` →
  `npm run build`. A failing step blocks the merge.

---

## 9. Deployment

- **Hosting**: Vercel, auto-deploy on push to `main`, preview deployments on pull requests.
- **SPA routing**: `vercel.json` rewrites so React Router handles client-side URLs.
- **Edge Function**: deployed separately with `npx supabase functions deploy checkout`.
- **Database**: migrations applied via the Supabase CLI (`supabase db push`).

---

## 10. Maintenance

See the dedicated maintenance plan (French) in [`README.md`](./README.md). Key points:
dependency updates monitored via `npm audit` and GitHub Dependabot, versioned SQL
migrations for any schema change, and the blocking CI pipeline as the quality gate
before every merge.
