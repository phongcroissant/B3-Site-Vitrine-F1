import PublicOnly from "@/components/PublicOnly";
import Login from "@/components/pages/Login";

export const metadata = { title: "Connexion", robots: { index: false } };

export default function Page() {
  return (
    <PublicOnly>
      <Login />
    </PublicOnly>
  );
}
