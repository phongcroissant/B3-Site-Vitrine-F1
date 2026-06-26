import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import Globe from "./Globe";
import SearchBar from "../../ui/SearchBar";

export default function Circuit() {
  const { loading, error, data } = useFetch(
    "https://api.jolpi.ca/ergast/f1/current/",
  );
  const races = data?.MRData.RaceTable.Races;
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Une erreur est survenue</p>;
  if (!races || races.length === 0) return <p>Aucune donnée</p>;

  const filteredRaces = races.filter((race) => {
    const term = search.toLowerCase();
    return (
      race.raceName.toLowerCase().includes(term) ||
      race.Circuit.Location.country.toLowerCase().includes(term) ||
      race.Circuit.Location.locality.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 f1-fade-up">
      <div className="f1-section-head">
        <p className="f1-eyebrow">Formula 1</p>
        <h2 className="f1-title text-4xl md:text-6xl mb-4">Les circuits</h2>
        <div className="f1-accent-line max-w-xs mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:sticky lg:top-6 self-start">
          <Globe races={races} selected={selected} onSelect={setSelected} />
          <p className="text-center text-sm text-white/60 mt-2">
            Fais tourner le globe et clique sur un circuit
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher un circuit, pays ou ville..."
          />
          {filteredRaces.map((race) => {
            const isSelected = String(selected) === String(race.round);
            return (
              <div
                key={race.round}
                onClick={() => setSelected(race.round)}
                className={`f1-card cursor-pointer p-5 ${
                  isSelected ? "border-[var(--f1-red)]! -translate-y-1" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 grid place-items-center h-9 w-9 rounded-lg bg-[#e10600] text-white font-black text-sm shadow-[0_4px_14px_rgba(225,6,0,0.5)]">
                    {" "}
                    {race.round}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      {race.raceName}
                    </h3>
                    <p className="text-sm text-white/60 mt-1">
                      <span className="text-red-500 font-semibold">Pays</span> ·{" "}
                      {race.Circuit.Location.country}
                    </p>
                    <p className="text-sm text-white/60">
                      <span className="text-red-500 font-semibold">Lieu</span> ·{" "}
                      {race.Circuit.Location.locality}
                    </p>
                    <Link
                      to={`/raceResult/${race.round}`}
                      onClick={(e) => e.stopPropagation()}
                      className="f1-link inline-block mt-3 text-sm"
                    >
                      Voir le résultat →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
