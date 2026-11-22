import RequireAuth from "@/components/RequireAuth";
import OrderHistory from "@/components/pages/Shop/OrderHistory";

// Page privée : non indexée par les moteurs de recherche.
export const metadata = { title: "Mes commandes", robots: { index: false } };

export default function Page() {
  return (
    <RequireAuth>
      <OrderHistory />
    </RequireAuth>
  );
}
