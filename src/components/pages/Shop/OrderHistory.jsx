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
    return <p className="text-slate-100 text-center mt-10">Chargement...</p>;

  if (error)
    return <p className="text-red-400 text-center mt-10">Erreur : {error}</p>;

  return (
    <>
      <h1 className="text-4xl text-slate-100 font-bold text-center pb-5">
        Mes commandes
      </h1>

      {orders.length === 0 ? (
        <p className="text-slate-300 text-center mt-10">
          Vous n'avez pas encore passé de commande.
        </p>
      ) : (
        <div className="container mx-auto flex flex-col gap-6">
          {orders.map((order) => (
            <section
              key={order.id}
              className="bg-slate-100 p-4 rounded text-black"
            >
              <header className="flex justify-between items-center border-b border-gray-300 pb-2 mb-3">
                <h2 className="font-semibold">Commande #{order.id}</h2>
                <span className="text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </span>
              </header>

              <ul className="flex flex-col gap-2">
                {order.carts_products.map((line) => (
                  <li key={line.id} className="flex justify-between text-sm">
                    <span>
                      {line.products.libelle}{" "}
                      <span className="text-gray-500">× {line.quantite}</span>
                    </span>
                    <span className="font-medium">
                      {(line.products.prix * line.quantite).toFixed(2)} €
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-right font-bold mt-3 border-t border-gray-300 pt-2">
                Total : {orderTotal(order).toFixed(2)} €
              </p>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
