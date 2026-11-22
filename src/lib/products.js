import { supabase } from "./supabase";

// Lecture du catalogue côté serveur (lecture publique autorisée par la RLS).
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, libelle, prix")
      .order("id");
    if (error) return { products: [], error: true };
    return { products: data ?? [], error: false };
  } catch {
    return { products: [], error: true };
  }
}
