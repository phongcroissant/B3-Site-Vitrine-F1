import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase"; 

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null); // produit en cours d'ajout

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, libelle, prix");

      if (error) setError(error.message);
      else setProducts(data);

      setLoading(false);
    }

    fetchProducts();
  }, []);

  async function addToCart(productId) {
    setAddingId(productId);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Récupérer ou créer le panier en cours
    let { data: cart } = await supabase
      .from("cart")
      .select("id")
      .eq("id_utilisateur", user.id)
      .eq("statut", "en_cours")
      .single();

    if (!cart) {
      const { data: newCart } = await supabase
        .from("cart")
        .insert({ id_utilisateur: user.id })
        .select("id")
        .single();
      cart = newCart;
    }

    // 2. Ajouter le produit ou incrémenter la quantité via RPC
    await supabase.rpc("upsert_cart_product", {
      p_id_panier: cart.id,
      p_id_produit: productId,
    });

    setAddingId(null);
  }

  if (loading)
    return <p className="text-slate-100 text-center mt-10">Chargement...</p>;

  if (error)
    return <p className="text-red-400 text-center mt-10">Erreur : {error}</p>;

  return (
    <>
      <h1 className="text-4xl text-slate-100 font-bold text-center pb-5">
        Shop
      </h1>
      <ul className="grid grid-cols-4 gap-4 justify-items-start mb-4 container mx-auto">
        {products.map((product) => (
          <li
            key={product.id}
            className="bg-slate-100 p-4 w-75 rounded text-black mx-auto"
          >
            <div className="flex justify-between mb-4">
              <h2>{product.libelle}</h2>
              <p>Prix : {product.prix} €</p>
            </div>
            <button
              onClick={() => addToCart(product.id)}
              disabled={addingId === product.id}
              className="w-full text-black p-1 rounded text-lg border bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingId === product.id ? "Ajout..." : "Ajouter au panier"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}