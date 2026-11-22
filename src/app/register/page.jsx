import PublicOnly from "@/components/PublicOnly";
import Register from "@/components/pages/Register";

export const metadata = { title: "Créer un compte", robots: { index: false } };

export default function Page() {
  return (
    <PublicOnly>
      <Register />
    </PublicOnly>
  );
}
