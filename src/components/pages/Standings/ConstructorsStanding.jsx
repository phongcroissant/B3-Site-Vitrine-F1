import ResultTable from "../../ui/ResultTable";
import { ErrorMessage, EmptyMessage } from "../../ui/DataMessage";

const columns = [
  { header: "Position", render: (r) => r.position },
  { header: "Écurie", render: (r) => r.Constructor.name },
  { header: "Points", render: (r) => r.points },
];

// Classement chargé côté serveur (src/app/standings/constructorsStanding/page.jsx).
export default function ConstructorsStanding({ standings, error }) {
  if (error) return <ErrorMessage />;
  if (!standings || standings.length === 0) return <EmptyMessage />;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <ResultTable
        columns={columns}
        rows={standings}
        rowKey={(r, index) => index}
      />
    </div>
  );
}
