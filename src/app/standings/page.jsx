import DriversStanding from "@/components/pages/Standings/DriversStanding";
import { getDriverStandings } from "@/lib/f1";

export const revalidate = 3600;

export const metadata = {
  title: "Classement pilotes F1",
  description: "Le classement du championnat du monde des pilotes de Formule 1, mis à jour après chaque Grand Prix.",
  alternates: { canonical: "/standings" },
};

export default async function Page() {
  const { standings, error } = await getDriverStandings();
  return <DriversStanding standings={standings} error={error} />;
}
