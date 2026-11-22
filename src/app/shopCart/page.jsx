import RequireAuth from "@/components/RequireAuth";
import ShopCart from "@/components/pages/Shop/ShopCart";

// Page privée : non indexée par les moteurs de recherche.
export const metadata = { title: "Mon panier", robots: { index: false } };

export default function Page() {
  return (
    <RequireAuth>
      <ShopCart />
    </RequireAuth>
  );
}
