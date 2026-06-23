import { useFetch } from "../../../hooks/useFetch";
import ResultTable from "../../ui/ResultTable";

const columns = [
  { header: "Position", render: (r) => r.position },
  {
    header: "Pilote",
    render: (r) => `${r.Driver.givenName} ${r.Driver.familyName}`,
  },
  { header: "Écurie", render: (r) => r.Constructors[0].name },
  { header: "Points", render: (r) => r.points },
];

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
      <ResultTable
        columns={columns}
        rows={standings}
        rowKey={(r) => r.Driver.driverId}
      />
    </div>
  );
}
