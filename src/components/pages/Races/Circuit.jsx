"use client";

import { useState } from "react";
import Link from "next/link";
import Globe from "./Globe";
import SearchBar from "../../ui/SearchBar";
import PageHeading from "../../ui/PageHeading";
import { ErrorMessage, EmptyMessage } from "../../ui/DataMessage";

// Le calendrier est chargé côté serveur (src/app/circuit/page.jsx) ;
// ce composant client gère le globe, la sélection et la recherche.
export default function Circuit({ races, error }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  if (error) return <ErrorMessage />;
  if (!races || races.length === 0) return <EmptyMessage />;

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
      <PageHeading>Les circuits</PageHeading>

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
                    <h2 className="text-lg font-bold text-white">
                      {race.raceName}
                    </h2>
                    <p className="text-sm text-white/60 mt-1">
                      <span className="text-red-500 font-semibold">Pays</span> ·{" "}
                      {race.Circuit.Location.country}
                    </p>
                    <p className="text-sm text-white/60">
                      <span className="text-red-500 font-semibold">Lieu</span> ·{" "}
                      {race.Circuit.Location.locality}
                    </p>
                    <Link
                      href={`/raceResult/${race.round}`}
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
