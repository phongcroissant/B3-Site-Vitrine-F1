import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import SearchBar from "../../ui/SearchBar";

export default function Shop() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [search, setSearch] = useState("");

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

    const {
      data: { user },
    } = await supabase.auth.getUser();
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

  const filteredProducts = products.filter((product) =>
    product.libelle.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 f1-fade-up">
      <div className="f1-section-head">
        <p className="f1-eyebrow">Formula 1</p>
        <h1 className="f1-title text-4xl md:text-6xl mb-4">Boutique</h1>
        <div className="f1-accent-line max-w-xs mx-auto" />
      </div>

      <div className="max-w-md mx-auto mb-8">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un produit..."
        />
      </div>

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
