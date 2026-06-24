// Edge Function : checkout
// -----------------------------------------------------------------------------
// Couche backend serverless (Deno) qui valide la commande CÔTÉ SERVEUR.
// Pourquoi une fonction et pas un appel direct depuis le front :
//   - Le prix et le total NE DOIVENT JAMAIS être calculés ni envoyés par le
//     client (risque de falsification de prix — OWASP A04/A08). On recalcule
//     ici à partir des prix réellement stockés en base.
//   - On revalide les quantités (entiers positifs) avant de figer la commande.
//   - On effectue la transition de statut du panier de façon contrôlée.
//
// Auth : le JWT de l'utilisateur est transmis dans l'en-tête Authorization et
// propagé au client Supabase, donc auth.uid() et les politiques RLS s'appliquent.
// -----------------------------------------------------------------------------

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface CartLine {
  id: number;
  quantite: number;
  products: { id: number; libelle: string; prix: number } | null;
}

Deno.serve(async (req) => {
  const cors = corsHeaders(req);
  // Pré-vol CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  if (req.method !== "POST") {
    return json({ error: "Méthode non autorisée" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Authentification requise" }, 401);
  }

  // Client Supabase lié à l'utilisateur appelant (RLS appliquée).
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  // 1. Vérifier l'identité réelle via le JWT (jamais via le corps de requête).
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Session invalide" }, 401);
  }

  // 2. Récupérer le panier en cours de CET utilisateur (RLS garantit la propriété).
  const { data: cart, error: cartError } = await supabase
    .from("cart")
    .select("id, statut")
    .eq("id_utilisateur", user.id)
    .eq("statut", "en_cours")
    .single();

  if (cartError || !cart) {
    return json({ error: "Aucun panier en cours" }, 404);
  }

  // 3. Charger les lignes + prix réels depuis la base (source de vérité).
  const { data: lines, error: linesError } = await supabase
    .from("carts_products")
    .select("id, quantite, products(id, libelle, prix)")
    .eq("id_panier", cart.id)
    .returns<CartLine[]>();

  if (linesError) {
    return json({ error: "Lecture du panier impossible" }, 500);
  }
  if (!lines || lines.length === 0) {
    return json({ error: "Panier vide" }, 422);
  }

  // 4. Valider chaque ligne côté serveur et recalculer le total.
  let total = 0;
  for (const line of lines) {
    if (!Number.isInteger(line.quantite) || line.quantite < 1) {
      return json({ error: `Quantité invalide pour la ligne ${line.id}` }, 422);
    }
    if (!line.products || typeof line.products.prix !== "number") {
      return json({ error: `Produit introuvable (ligne ${line.id})` }, 422);
    }
    total += line.products.prix * line.quantite;
  }
  total = Math.round(total * 100) / 100;

  // 5. Figer la commande : transition de statut contrôlée côté serveur.
  const { error: updateError } = await supabase
    .from("cart")
    .update({ statut: "valide" })
    .eq("id", cart.id)
    .eq("statut", "en_cours"); // garde-fou anti double-validation

  if (updateError) {
    return json({ error: "Validation de la commande impossible" }, 500);
  }

  // 6. Réponse : récapitulatif calculé par le serveur uniquement.
  return json({
    success: true,
    commande: {
      id_panier: cart.id,
      lignes: lines.map((l) => ({
        produit: l.products!.libelle,
        prix_unitaire: l.products!.prix,
        quantite: l.quantite,
        sous_total: Math.round(l.products!.prix * l.quantite * 100) / 100,
      })),
      total,
    },
  });
});

function json(body: unknown, status = 200, cors: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
