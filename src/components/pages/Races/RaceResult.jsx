import Link from "next/link";
import CommentSection from "../Comments";
import ResultTable from "../../ui/ResultTable";
import { ErrorMessage, EmptyMessage } from "../../ui/DataMessage";

const columns = [
  { header: "Position", render: (r) => r.position },
  {
    header: "Pilote",
    render: (r) => `${r.Driver.givenName} ${r.Driver.familyName}`,
  },
  { header: "Écurie", render: (r) => r.Constructor.name },
  { header: "Points", render: (r) => r.points },
];

// Résultats chargés côté serveur (src/app/raceResult/[round]/page.jsx) ;
// seuls les commentaires sont gérés dans le navigateur.
export default function RaceResult({ race, error }) {
  const results = race?.Results;

  if (error) return <ErrorMessage />;
  if (!results || results.length === 0) return <EmptyMessage />;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Link href="/circuit" className="f1-link">
        ← Retour aux circuits
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-center">{race.raceName}</h1>
      <ResultTable
        columns={columns}
        rows={results}
        rowKey={(r) => r.Driver.driverId}
      />
      <CommentSection idRace={race.Circuit.circuitId} />
    </div>
  );
}
