import { createClient } from "@supabase/supabase-js";

// Client Supabase public (clé anon, protégée par la RLS).
// Utilisé dans les composants client et, sans session, pour les lectures
// publiques côté serveur (catalogue produits).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
