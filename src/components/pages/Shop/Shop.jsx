"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import SearchBar from "../../ui/SearchBar";
import PageHeading from "../../ui/PageHeading";
import { ErrorMessage } from "../../ui/DataMessage";

// Le catalogue est chargé côté serveur (src/app/shop/page.jsx) pour être
// référencé ; l'ajout au panier reste une action du navigateur.
export default function Shop({ products, error }) {
  const { user } = useAuth();
  const [addingId, setAddingId] = useState(null);
  const [addError, setAddError] = useState(null);
  const [search, setSearch] = useState("");

  async function addToCart(productId) {
    setAddingId(productId);
    setAddError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Récupérer ou créer le panier en cours
      let { data: cart, error: selectError } = await supabase
        .from("cart")
        .select("id")
        .eq("id_utilisateur", user.id)
        .eq("statut", "en_cours")
        .maybeSingle();
      if (selectError) throw selectError;

      if (!cart) {
        const { data: newCart, error: insertError } = await supabase
          .from("cart")
          .insert({ id_utilisateur: user.id })
          .select("id")
          .single();
        if (insertError) throw insertError;
        cart = newCart;
      }

      // 2. Ajouter le produit ou incrémenter la quantité via RPC
      const { error: rpcError } = await supabase.rpc("upsert_cart_product", {
        p_id_panier: cart.id,
        p_id_produit: productId,
      });
      if (rpcError) throw rpcError;
    } catch (err) {
      console.error("Ajout au panier impossible :", err);
      setAddError(err.message ?? "Impossible d'ajouter le produit au panier.");
    } finally {
      setAddingId(null);
    }
  }

  if (error) return <ErrorMessage />;

  const filteredProducts = products.filter((product) =>
    product.libelle.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 f1-fade-up">
      <PageHeading>Boutique</PageHeading>

      <div className="max-w-md mx-auto mb-8">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un produit..."
        />
      </div>

      {addError && (
        <p role="alert" className="text-red-400 text-center mb-6">
          Erreur : {addError}
        </p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <li key={product.id} className="f1-card p-5 flex flex-col">
            <h2 className="text-lg font-bold text-white">{product.libelle}</h2>
            <p className="text-2xl font-black text-red-500 mt-1 mb-4">
              {product.prix} €
            </p>
            {user && (
              <button
                onClick={() => addToCart(product.id)}
                disabled={addingId === product.id}
                className="f1-btn w-full mt-auto disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {addingId === product.id ? "Ajout..." : "Ajouter au panier"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
