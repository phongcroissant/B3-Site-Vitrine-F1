import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart")
      .select(
        "id, created_at, carts_products(id, quantite, products(libelle, prix))",
      )
      .eq("id_utilisateur", user.id)
      .eq("statut", "valide")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setOrders(data ?? []);

    setLoading(false);
  }

  const orderTotal = (order) =>
    order.carts_products.reduce(
      (sum, line) => sum + line.products.prix * line.quantite,
      0,
    );

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading)
    return <p className="text-white/70 text-center mt-10">Chargement...</p>;

  if (error)
    return <p className="text-red-400 text-center mt-10">Erreur : {error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 f1-fade-up">
      <div className="f1-section-head">
        <p className="f1-eyebrow">Formula 1</p>
        <h1 className="f1-title text-4xl md:text-6xl mb-4">Mes commandes</h1>
        <div className="f1-accent-line max-w-xs mx-auto" />
      </div>

      {orders.length === 0 ? (
        <p className="text-white/60 text-center mt-10">
          Vous n'avez pas encore passé de commande.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <section key={order.id} className="f1-card p-5">
              <header className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
                <h2 className="font-bold text-white">
                  Commande{" "}
                  <span className="text-red-500">#{order.id}</span>
                </h2>
                <span className="text-sm text-white/50">
                  {formatDate(order.created_at)}
                </span>
              </header>

              <ul className="flex flex-col gap-2">
                {order.carts_products.map((line) => (
                  <li
                    key={line.id}
                    className="flex justify-between text-sm text-white/80"
                  >
                    <span>
                      {line.products.libelle}{" "}
                      <span className="text-white/40">× {line.quantite}</span>
                    </span>
                    <span className="font-medium text-white">
                      {(line.products.prix * line.quantite).toFixed(2)} €
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-right font-bold text-white mt-3 border-t border-white/10 pt-3">
                Total :{" "}
                <span className="text-red-500">
                  {orderTotal(order).toFixed(2)} €
                </span>
              </p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
