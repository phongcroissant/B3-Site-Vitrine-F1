import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function ShopCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutMsg, setCheckoutMsg] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

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

  // La validation passe par l'Edge Function "checkout" : c'est le serveur qui
  // recalcule le total et vérifie le panier. Le front n'envoie aucun prix.
  async function handleCheckout() {
    setCheckingOut(true);
    setCheckoutMsg(null);

    const { data, error } = await supabase.functions.invoke("checkout");

    if (error || data?.error) {
      setCheckoutMsg({
        type: "error",
        text: data?.error || "Échec de la validation de la commande.",
      });
    } else {
      setCheckoutMsg({
        type: "success",
        text: `Commande validée ! Total : ${data.commande.total.toFixed(2)} €`,
      });
      setCartItems([]);
    }

    setCheckingOut(false);
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
    <div className="max-w-3xl mx-auto mt-10 px-4 f1-fade-up">
      <div className="f1-section-head">
        <p className="f1-eyebrow">Formula 1</p>
        <h1 className="f1-title text-4xl md:text-6xl mb-4">Mon panier</h1>
        <div className="f1-accent-line max-w-xs mx-auto" />
      </div>

      {cartItems.length === 0 ? (
        <p className="text-white/60 text-center mt-10">
          Votre panier est vide.
        </p>
      ) : (
        <div>
          <ul className="flex flex-col gap-4 mb-6">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="f1-card p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-white truncate">
                    {item.products.libelle}
                  </h2>
                  <p className="text-sm text-white/50">
                    {item.products.prix} € / unité
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantite - 1)}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-lg text-lg font-bold transition"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-white">
                    {item.quantite}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantite + 1)}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-lg text-lg font-bold transition"
                  >
                    +
                  </button>
                </div>

                <p className="w-24 text-right font-bold text-red-500">
                  {(item.products.prix * item.quantite).toFixed(2)} €
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-white/40 hover:text-red-500 text-sm transition"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          <div className="f1-card flex justify-between items-center p-4">
            <button
              onClick={clearCart}
              className="text-white/60 hover:text-red-500 text-sm border border-white/15 hover:border-red-500 px-3 py-1.5 rounded-lg transition"
            >
              Vider le panier
            </button>
            <p className="text-xl font-bold text-white">
              Total : <span className="text-red-500">{total.toFixed(2)} €</span>
            </p>
          </div>

          <div className="mt-4 flex flex-col items-end gap-2">
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="f1-btn disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {checkingOut ? "Validation..." : "Valider la commande"}
            </button>
          </div>
        </div>
      )}

      {checkoutMsg && (
        <p
          className={`text-center mt-6 ${
            checkoutMsg.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {checkoutMsg.text}
        </p>
      )}
    </div>
  );
}
