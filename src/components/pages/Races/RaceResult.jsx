import { useParams, Link } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import CommentSection from "../Comments";

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
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-black">
                Position
              </th>
              <th className="text-left py-3 px-4 font-medium text-black">
                Pilote
              </th>
              <th className="text-left py-3 px-4 font-medium text-black">
                Écurie
              </th>
              <th className="text-left py-3 px-4 font-medium text-black">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={result.Driver.driverId}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-3 px-4 text-black">{result.position}</td>
                <td className="py-3 px-4 text-black">
                  {result.Driver.givenName} {result.Driver.familyName}
                </td>
                <td className="py-3 px-4 text-black">
                  {result.Constructor.name}
                </td>
                <td className="py-3 px-4 text-black">{result.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CommentSection idRace={race.Circuit.circuitId} />
    </div>
  );
}
