// Test de charge — Edge Function "checkout" (couche backend serverless)
// -----------------------------------------------------------------------------
// Scénario : valider la commande sous charge en passant par l'Edge Function,
// qui recalcule le total et applique la RLS via le JWT de l'utilisateur.
//
// ATTENTION : cet endpoint ÉCRIT en base (transition de statut du panier).
// À n'exécuter que sur un environnement de test / un utilisateur dédié,
// avec une charge modérée. Ne le lancez PAS contre la prod avec des comptes
// réels. La fonction comporte un garde-fou anti double-validation, donc après
// la 1re validation les requêtes suivantes renverront une erreur 404 attendue.
//
// Pré-requis : un JWT utilisateur valide (récupérable côté front via
//   supabase.auth.getSession() -> data.session.access_token).
//
// Lancement :
//   k6 run --env SUPABASE_URL=... --env JWT=eyJ... load-tests/checkout.js
// -----------------------------------------------------------------------------

import http from "k6/http";
import { check, sleep } from "k6";

const SUPABASE_URL = __ENV.SUPABASE_URL || __ENV.VITE_SUPABASE_URL;
const JWT = __ENV.JWT;

if (!SUPABASE_URL || !JWT) {
  throw new Error(
    "Variables manquantes : passez --env SUPABASE_URL et --env JWT (token utilisateur)",
  );
}

export const options = {
  // Charge volontairement modérée car l'endpoint écrit en base.
  stages: [
    { duration: "20s", target: 10 },
    { duration: "40s", target: 10 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<1500"], // tolérance plus large (cold start + écriture)
    // Pas de seuil strict sur les erreurs : le garde-fou anti double-validation
    // génère des 404 légitimes une fois le panier validé.
  },
};

const url = `${SUPABASE_URL}/functions/v1/checkout`;
const params = {
  headers: {
    Authorization: `Bearer ${JWT}`,
    "Content-Type": "application/json",
  },
};

export default function () {
  const res = http.post(url, "{}", params);

  check(res, {
    // 200 = commande validée ; 404 = panier déjà validé (comportement attendu).
    "réponse traitée (200/404)": (r) => r.status === 200 || r.status === 404,
    "pas d'erreur serveur 5xx": (r) => r.status < 500,
  });

  sleep(1);
}
