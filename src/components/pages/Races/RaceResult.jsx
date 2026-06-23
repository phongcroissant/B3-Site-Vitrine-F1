import { useParams, Link } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import CommentSection from "../Comments";
import ResultTable from "../../ui/ResultTable";

const columns = [
  { header: "Position", render: (r) => r.position },
  {
    header: "Pilote",
    render: (r) => `${r.Driver.givenName} ${r.Driver.familyName}`,
  },
  { header: "Écurie", render: (r) => r.Constructor.name },
  { header: "Points", render: (r) => r.points },
];

export default function RaceResult() {
  const { round } = useParams();
  const { loading, error, data } = useFetch(
    `https://api.jolpi.ca/ergast/f1/current/${round}/results/`,
  );

  const race = data?.MRData.RaceTable.Races[0];
  const results = race?.Results;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Une erreur est survenue</p>;
  if (!results || results.length === 0) return <p>Aucune donnée</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Link to={`/circuit`}>Retour</Link>
      <h2 className="text-2xl font-bold mb-6 text-center">{race.raceName}</h2>
      <ResultTable
        columns={columns}
        rows={results}
        rowKey={(r) => r.Driver.driverId}
      />
      <CommentSection idRace={race.Circuit.circuitId} />
    </div>
  );
}
