import ResultTable from "../../ui/ResultTable";
import { ErrorMessage, EmptyMessage } from "../../ui/DataMessage";

const columns = [
  { header: "Position", render: (r) => r.position },
  {
    header: "Pilote",
    render: (r) => `${r.Driver.givenName} ${r.Driver.familyName}`,
  },
  { header: "Écurie", render: (r) => r.Constructors[0].name },
  { header: "Points", render: (r) => r.points },
];

// Classement chargé côté serveur (src/app/standings/page.jsx).
export default function DriversStanding({ standings, error }) {
  if (error) return <ErrorMessage />;
  if (!standings || standings.length === 0) return <EmptyMessage />;

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
