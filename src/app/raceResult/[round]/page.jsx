import { notFound } from "next/navigation";
import RaceResult from "@/components/pages/Races/RaceResult";
import { getRaceResult } from "@/lib/f1";

export const revalidate = 3600;

// Une manche est un nombre de 1 ou 2 chiffres : sinon, page 404.
const isValidRound = (round) => /^\d{1,2}$/.test(round);

// Titre et description propres à chaque Grand Prix.
export async function generateMetadata({ params }) {
  const { round } = await params;
  if (!isValidRound(round)) notFound();
  const { race } = await getRaceResult(round);
  const name = race?.raceName ?? `Manche ${round}`;
  return {
    title: `Résultats du ${name} ${race?.season ?? ""}`.trim(),
    description: `Classement complet du ${name} : positions, pilotes, écuries et points.`,
    alternates: { canonical: `/raceResult/${round}` },
  };
}

export default async function Page({ params }) {
  const { round } = await params;
  if (!isValidRound(round)) notFound();
  const { race, error } = await getRaceResult(round);
  return <RaceResult race={race} error={error} />;
}
