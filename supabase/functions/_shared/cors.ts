// Origines autorisées à appeler les Edge Functions (liste blanche).
const ALLOWED_ORIGINS = [
  "https://b3-site-vitrine-f1.vercel.app",
  "http://localhost:5173",
];

// Construit les en-têtes CORS en fonction de l'origine de la requête.
// Si l'origine n'est pas dans la liste blanche, on ne renvoie pas
// d'Access-Control-Allow-Origin → le navigateur bloque l'appel.
export function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("Origin") ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin);

  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}
