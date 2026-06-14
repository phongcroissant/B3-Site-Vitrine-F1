import { useFetch } from "../../../hooks/useFetch";

export default function DriversStanding() {
  const { loading, error, data } = useFetch(
    "https://api.jolpi.ca/ergast/f1/current/driverStandings.json",
  );

  const standings =
    data?.MRData.StandingsTable.StandingsLists[0].DriverStandings;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Une erreur est survenue</p>;
  if (!standings || standings.length === 0) return <p>Aucune donnée</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
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
            {standings.map((result, index) => (
              <tr
                key={result.Driver.driverId}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-3 px-4 text-black">{result.position}</td>
                <td className="py-3 px-4 text-black">
                  {result.Driver.givenName} {result.Driver.familyName}
                </td>
                <td className="py-3 px-4 text-black">
                  {result.Constructors[0].name}
                </td>
                <td className="py-3 px-4 text-black">{result.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
