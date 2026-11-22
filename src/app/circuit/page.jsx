import Circuit from "@/components/pages/Races/Circuit";
import { getSeasonRaces } from "@/lib/f1";

export const revalidate = 86400;

export const metadata = {
  title: "Calendrier et circuits de Formule 1",
  description: "Le calendrier de la saison de Formule 1 : tous les Grands Prix et leurs circuits, sur un globe interactif.",
  alternates: { canonical: "/circuit" },
};

export default async function Page() {
  const { races, error } = await getSeasonRaces();
  return <Circuit races={races} error={error} />;
}
