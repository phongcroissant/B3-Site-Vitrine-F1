# Tests de charge & autoscaling

> Compétences visées : **C27 / C28** — concevoir et exécuter des tests de
> charge, analyser la montée en charge et la stratégie d'autoscaling.

## 1. Outil retenu

[**k6**](https://k6.io) (Grafana Labs). Choisi plutôt que JMeter car :

- scripts en **JavaScript**, cohérents avec la stack du projet (React/JS) ;
- léger (un seul binaire), exécutable en CLI et intégrable en CI ;
- les scénarios sont **versionnés dans Git** (lisibles par le jury), contrairement
  à un export `.jmx` XML de JMeter.

Installation (Windows) : `winget install --id GrafanaLabs.k6`

## 2. Hypothèse de trafic

Site vitrine F1 avec boutique. Trafic estimé pour le dimensionnement :

| Scénario           | Utilisateurs simultanés | Justification                                  |
| ------------------ | ----------------------- | ---------------------------------------------- |
| Nominal            | ~50                     | trafic courant d'un site vitrine de niche      |
| Pic (jour de GP)   | ~200                    | affluence lors d'un Grand Prix / actualité F1  |

Critères d'acceptation : latence **p95 < 800 ms** en lecture et **taux d'erreur < 1 %**.

## 3. Protocole

Deux cibles, représentatives des deux couches de l'architecture serverless :

| Script              | Cible                                   | Type      | Charge        |
| ------------------- | --------------------------------------- | --------- | ------------- |
| `read-drivers.js`   | API REST Supabase (`/rest/v1/products`) | Lecture   | 50 → 200 VUs  |
| `checkout.js`       | Edge Function `checkout`                | Écriture  | 10 VUs (modéré) |

Scénario en paliers : montée → palier nominal → pic → descente.

### Environnement de test

Les tests ci-dessous ont été exécutés contre une **instance Supabase locale**
(`supabase start`, `http://127.0.0.1:54321`) plutôt que contre le projet cloud.
Ce choix est volontaire :

- aucun risque pour les données ni les quotas du plan gratuit de production ;
- l'environnement local reproduit la même stack (PostgreSQL + PostgREST + Edge
  Functions) que la prod, donc le comportement applicatif est représentatif.

À noter : les valeurs absolues de latence reflètent les performances de la
machine de test locale ; en production (CDN Vercel + Supabase managé), le
profil serait différent mais l'analyse d'autoscaling (§5) reste valable.

### Lancement

Le plus simple — un script qui charge le `.env` et lance k6 automatiquement
(depuis la racine du projet) :

```powershell
.\load-tests\run.ps1
# ou, si l'exécution de scripts est bloquée :
powershell -ExecutionPolicy Bypass -File load-tests\run.ps1
```

Ou manuellement, en lecture (sûr, aucune écriture) :

```powershell
k6 run --env VITE_SUPABASE_URL=$env:VITE_SUPABASE_URL --env VITE_SUPABASE_ANON_KEY=$env:VITE_SUPABASE_ANON_KEY load-tests/read-drivers.js
```

Edge Function (écrit en base — environnement de test uniquement) :

```powershell
# JWT récupéré côté front via supabase.auth.getSession().access_token
k6 run --env SUPABASE_URL=$env:VITE_SUPABASE_URL --env JWT="<token>" load-tests/checkout.js
```

> ⚠️ Le test de charge envoie du trafic réel vers Supabase. Sur le plan gratuit,
> rester sur des volumes modérés pour ne pas atteindre les quotas / le rate-limiting.

## 4. Résultats

Test exécuté le 24/06/2026 — scénario complet 50 → 200 VUs sur 2 min 30
(environnement : Supabase local, voir §3).

### Lecture (`read-drivers.js`)

| Métrique                     | Valeur mesurée   | Seuil    | Verdict |
| ---------------------------- | ---------------- | -------- | ------- |
| `http_reqs` (débit, RPS)     | 10 411 (69,2/s)  | —        | —       |
| `http_req_duration` médiane  | 8,11 ms          | —        | —       |
| `http_req_duration` p95      | 50,66 ms         | < 800 ms | ✅      |
| `http_req_duration` max      | 636 ms           | —        | —       |
| `http_req_failed` (erreurs)  | 0,00 %           | < 1 %    | ✅      |
| Checks réussis               | 20 822 / 20 822  | 100 %    | ✅      |
| VUs max                      | 200              | —        | —       |
| Données reçues               | 10 MB            | —        | —       |

**Interprétation.** Sous un pic de 200 utilisateurs simultanés, l'API de lecture
reste très performante (p95 ≈ 51 ms, soit ~16× sous le seuil de 800 ms) avec un
taux d'erreur nul. La couche de lecture tient largement l'hypothèse de trafic.

_(Insérer ici la capture d'écran de la sortie k6.)_

### Edge Function (`checkout.js`)

| Métrique                     | Valeur mesurée | Verdict |
| ---------------------------- | -------------- | ------- |
| `http_req_duration` p95      | _… ms_         |         |
| Taux de 5xx                  | _… %_          |         |

## 5. Analyse de l'autoscaling

L'architecture est **entièrement serverless** : il n'y a pas de serveur à
dimensionner manuellement, la montée en charge est assurée par les plateformes.

| Couche                     | Mécanisme de montée en charge                              | Limite / point d'attention                          |
| -------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| Front (Vercel)             | Servi par le CDN edge mondial, scaling automatique         | Statique : pratiquement illimité                    |
| Edge Functions (Supabase)  | Isolates Deno instanciés à la demande                      | **Cold start** sur première requête                 |
| Base PostgreSQL (Supabase) | Pooler de connexions **Supavisor**                         | **Goulot d'étranglement réel** : nb de connexions   |

**Conclusion.** Le front et les fonctions montent en charge de façon transparente.
Le facteur limitant identifié est le **nombre de connexions PostgreSQL** (borné par
le plan Supabase) : sous très forte charge, c'est la base — et non le front — qui
sature en premier. Pistes d'amélioration : mise en cache côté front (réduire les
re-fetch), pagination des résultats, et passage à un plan Supabase supérieur si le
trafic réel dépasse l'hypothèse de pic.
