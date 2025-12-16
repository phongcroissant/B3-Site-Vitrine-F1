import { useEffect, useState } from "react";

export default function ConstructorsStanding() {
  const [APIState, setAPIState] = useState({
    loading: false,
    error: true,
    data: undefined,
  });
  useEffect(() => {
    setAPIState({ ...APIState, loading: true });
    fetch("https://api.jolpi.ca/ergast/f1/current/constructorStandings.json")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setAPIState({
          loading: false,
          error: false,
          data: data.MRData.StandingsTable.StandingsLists[0]
            .ConstructorStandings,
        });
      })
      .catch(() => {
        setAPIState({ loading: false, error: true, data: undefined });
      });
  }, []);

  let content;
  if (APIState.loading) content = <p>Loading...</p>;
  else if (APIState.error) content = <p>Une erreur est survenue</p>;
  else if (APIState.data.length > 0) {
    content = (
      <div className="max-w-3xl mx-auto mt-10 px-4">
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
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {APIState.data.map((result, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4 text-black">{result.position}</td>
                  <td className="py-3 px-4 text-black">
                    {result.Constructor.name}
                  </td>
                  <td className="py-3 px-4 text-black">{result.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else if (APIState.data?.length === 0) {
    content = <p>Aucune donnée</p>;
  }
  return <div>{content}</div>;
}
