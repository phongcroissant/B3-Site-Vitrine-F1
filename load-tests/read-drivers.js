// Test de charge — lecture publique de l'API Supabase (catalogue produits)
// -----------------------------------------------------------------------------
// Scénario : montée progressive en charge sur un endpoint en LECTURE seule
// (aucune écriture en base, donc sans risque pour les données de prod).
// Objectif : mesurer la latence (p95), le débit (RPS) et le taux d'erreur
// de la couche données sous charge, et observer le comportement d'autoscaling.
//
// Lancement :
//   k6 run --env VITE_SUPABASE_URL=... --env VITE_SUPABASE_ANON_KEY=... load-tests/read-drivers.js
// -----------------------------------------------------------------------------

import http from "k6/http";
import { check, sleep } from "k6";

const SUPABASE_URL = __ENV.VITE_SUPABASE_URL;
const ANON_KEY = __ENV.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error(
    "Variables manquantes : passez --env VITE_SUPABASE_URL et --env VITE_SUPABASE_ANON_KEY",
  );
}

export const options = {
  // Paliers : montée à 50 VUs, palier, pic à 200, puis descente.
  // Ajustez les cibles selon votre hypothèse de trafic (voir README).
  stages: [
    { duration: "30s", target: 50 }, // montée
    { duration: "1m", target: 50 }, // palier nominal
    { duration: "30s", target: 200 }, // pic de charge
    { duration: "30s", target: 0 }, // retour au calme
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"], // 95% des requêtes < 800 ms
    http_req_failed: ["rate<0.01"], // moins de 1% d'erreurs
  },
};

const headers = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
};

export default function () {
  // Lecture du catalogue produits (endpoint REST auto-généré par Supabase).
  const res = http.get(`${SUPABASE_URL}/rest/v1/products?select=*`, {
    headers,
  });

  check(res, {
    "statut 200": (r) => r.status === 200,
    "corps non vide": (r) => r.body && r.body.length > 0,
  });

  sleep(1); // pause d'1s pour simuler un utilisateur réaliste
}
