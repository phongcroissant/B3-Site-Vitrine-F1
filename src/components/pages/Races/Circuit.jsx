import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import Globe from "./Globe";

export default function Circuit() {
  const { loading, error, data } = useFetch(
    "https://api.jolpi.ca/ergast/f1/current/",
  );
  const races = data?.MRData.RaceTable.Races;
  const [selected, setSelected] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Une erreur est survenue</p>;
  if (!races || races.length === 0) return <p>Aucune donnée</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 px-4">
      <div className="lg:sticky lg:top-6 self-start">
        <Globe races={races} selected={selected} onSelect={setSelected} />
        <p className="text-center text-sm opacity-70 mt-2">
          Fais tourner le globe et clique sur un circuit
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {races.map((race) => {
          const isSelected = String(selected) === String(race.round);
          return (
            <div
              key={race.round}
              onClick={() => setSelected(race.round)}
              className={`card bg-base-100 shadow-xl cursor-pointer transition ${
                isSelected ? "ring-2 ring-warning" : ""
              }`}
            >
              <div className="card-body">
                <h2 className="card-title">
                  <span className="badge badge-neutral">{race.round}</span>
                  {race.raceName}
                </h2>
                <p>Pays : {race.Circuit.Location.country}</p>
                <p>Localisation : {race.Circuit.Location.locality}</p>
                <Link to={`/raceResult/${race.round}`} className="link link-primary">
                  Resultat
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
