import { Link } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";

export default function Circuit() {
  const { loading, error, data } = useFetch(
    "https://api.jolpi.ca/ergast/f1/current/",
  );
  const races = data?.MRData.RaceTable.Races;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Une erreur est survenue</p>;
  if (!races || races.length === 0) return <p>Aucune donnée</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
      {races.map((race, index) => (
        <div key={index} className="card w-96 bg-base-100 shadow-xl mx-auto">
          <div className="card-body">
            <h2 className="card-title">{race.raceName}</h2>
            <p>Pays : {race.Circuit.Location.country}</p>
            <p>Localisation : {race.Circuit.Location.locality}</p>
            <Link to={`/raceResult/${race.round}`}>Resultat</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
