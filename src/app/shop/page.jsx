import Shop from "@/components/pages/Shop/Shop";
import { getProducts } from "@/lib/products";

export const revalidate = 600;

export const metadata = {
  title: "Boutique F1",
  description: "La boutique F1 Tracker : produits dérivés de Formule 1.",
  alternates: { canonical: "/shop" },
};

export default async function Page() {
  const { products, error } = await getProducts();
  return <Shop products={products} error={error} />;
}
