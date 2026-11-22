import ResultTable from "../ui/ResultTable";
import { ErrorMessage, EmptyMessage } from "../ui/DataMessage";

const columns = [
  { header: "Position", render: (r) => r.position },
  {
    header: "Pilote",
    render: (r) => `${r.Driver.givenName} ${r.Driver.familyName}`,
  },
  { header: "Écurie", render: (r) => r.Constructor.name },
  { header: "Points", render: (r) => r.points },
];

// Composant d'affichage : les données sont chargées côté serveur par
// src/app/page.jsx puis passées en props (rendu SSR / ISR).
export default function Home({ race, error }) {
  const results = race?.Results;

  if (error) return <ErrorMessage />;
  if (!results || results.length === 0) return <EmptyMessage />;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 f1-fade-up">
      <div className="f1-section-head">
        <p className="f1-eyebrow">Formula 1 · Dernier Grand Prix</p>
        <h1 className="f1-title text-4xl md:text-6xl mb-4">{race.raceName}</h1>
        <div className="f1-accent-line max-w-xs mx-auto" />
      </div>
      <div className="f1-card p-4 md:p-6">
        <ResultTable
          columns={columns}
          rows={results}
          rowKey={(r) => r.Driver.driverId}
        />
      </div>
    </div>
  );
}
