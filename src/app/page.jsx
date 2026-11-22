import Home from "@/components/pages/Home";
import { getLastRace } from "@/lib/f1";

// Page régénérée au plus toutes les heures (ISR).
export const revalidate = 3600;

export const metadata = {
  title: { absolute: "F1 Tracker – Résultats du dernier Grand Prix de Formule 1" },
  alternates: { canonical: "/" },
};

export default async function Page() {
  const { race, error } = await getLastRace();
  return <Home race={race} error={error} />;
}
