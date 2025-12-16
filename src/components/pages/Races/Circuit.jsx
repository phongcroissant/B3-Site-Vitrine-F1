import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Circuit() {
  const [APIState, setAPIState] = useState({
    loading: false,
    error: true,
    data: undefined,
  });
  useEffect(() => {
    setAPIState({ ...APIState, loading: true });
    fetch("https://api.jolpi.ca/ergast/f1/current/")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        // data.sort((a, b) => a.team_name.localeCompare(b.team_name));
        setAPIState({
          loading: false,
          error: false,
          data: data.MRData.RaceTable.Races,
        });
        console.log(data.MRData.RaceTable.Races);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {APIState.data?.map((race, index) => (
          <div key={index} className="card w-96 bg-base-100 shadow-xl mx-auto">
            <div className="card-body">
              <h2 className="card-title">{race.raceName}</h2>
              <p>Pays : {race.Circuit.Location.country}</p>
              <p>Localisation : {race.Circuit.Location.locality}</p>
              <Link to={`/raceResult/${race.Circuit.circuitId}`}>Resultat</Link>
            </div>
          </div>
        ))}
      </div>
    );
  } else if (APIState.data?.length === 0) {
    content = <p>Aucune donnée</p>;
  }
  return <div>{content}</div>;
}
