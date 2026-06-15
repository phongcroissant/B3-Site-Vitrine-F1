import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function ShopCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  async function getOrCreateCart(userId) {
    let { data: cart } = await supabase
      .from("cart")
      .select("id")
      .eq("id_utilisateur", userId)
      .eq("statut", "en_cours")
      .single();

    if (!cart) {
      const { data: newCart } = await supabase
        .from("cart")
        .insert({ id_utilisateur: userId })
        .select("id")
        .single();
      cart = newCart;
    }

    return cart;
  }

  async function fetchCart() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const cart = await getOrCreateCart(user.id);

    const { data, error } = await supabase
      .from("carts_products")
      .select("id, quantite, products(id, libelle, prix)")
      .eq("id_panier", cart.id);

    if (error) setError(error.message);
    else setCartItems(data);

    setLoading(false);
  }

  async function updateQuantity(itemId, newQuantite) {
    if (newQuantite < 1) return removeItem(itemId);

    await supabase
      .from("carts_products")
      .update({ quantite: newQuantite })
      .eq("id", itemId);

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantite: newQuantite } : item,
      ),
    );
  }

  async function removeItem(itemId) {
    await supabase.from("carts_products").delete().eq("id", itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  async function clearCart() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const cart = await getOrCreateCart(user.id);

    await supabase.from("carts_products").delete().eq("id_panier", cart.id);
    setCartItems([]);
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.products.prix * item.quantite,
    0,
  );

  if (loading)
    return <p className="text-slate-100 text-center mt-10">Chargement...</p>;

  if (error)
    return <p className="text-red-400 text-center mt-10">Erreur : {error}</p>;

  return (
    <>
      <h1 className="text-4xl text-slate-100 font-bold text-center pb-5">
        Mon panier
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-slate-300 text-center mt-10">
          Votre panier est vide.
        </p>
      ) : (
        <div className="container mx-auto">
          <ul className="flex flex-col gap-4 mb-6">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="bg-slate-100 p-4 rounded text-black flex items-center justify-between"
              >
                <div className="flex-1">
                  <h2 className="font-semibold">{item.products.libelle}</h2>
                  <p className="text-sm text-gray-500">
                    {item.products.prix} € / unité
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantite - 1)}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.quantite}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantite + 1)}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                <p className="w-24 text-right font-semibold">
                  {(item.products.prix * item.quantite).toFixed(2)} €
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-400 hover:text-red-600 text-sm"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center bg-slate-100 p-4 rounded text-black">
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm border border-red-400 hover:border-red-600 px-3 py-1 rounded"
            >
              Vider le panier
            </button>
            <p className="text-xl font-bold">Total : {total.toFixed(2)} €</p>
          </div>
        </div>
      )}
    </>
  );
}
