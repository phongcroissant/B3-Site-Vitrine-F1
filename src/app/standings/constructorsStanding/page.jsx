import ConstructorsStanding from "@/components/pages/Standings/ConstructorsStanding";
import { getConstructorStandings } from "@/lib/f1";

export const revalidate = 3600;

export const metadata = {
  title: "Classement constructeurs F1",
  description: "Le classement du championnat du monde des constructeurs de Formule 1, mis à jour après chaque Grand Prix.",
  alternates: { canonical: "/standings/constructorsStanding" },
};

export default async function Page() {
  const { standings, error } = await getConstructorStandings();
  return <ConstructorsStanding standings={standings} error={error} />;
}
