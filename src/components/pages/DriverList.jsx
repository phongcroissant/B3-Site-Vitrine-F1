import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import SearchBar from "../ui/SearchBar";

export default function DriverList() {
  const { loading, error, data } = useFetch(
    "https://api.openf1.org/v1/drivers?session_key=latest",
  );
  const [search, setSearch] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Une erreur est survenue</p>;
  if (!data || data.length === 0) return <p>Aucune donnée</p>;

  const drivers = [...data].sort((a, b) =>
    a.team_name.localeCompare(b.team_name),
  );

  const term = search.toLowerCase();
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.full_name.toLowerCase().includes(term) ||
      driver.team_name.toLowerCase().includes(term),
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 f1-fade-up">
      <div className="f1-section-head">
        <p className="f1-eyebrow">Formula 1</p>
        <h2 className="f1-title text-4xl md:text-6xl mb-4">Les pilotes</h2>
        <div className="f1-accent-line max-w-xs mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un pilote ou une écurie..."
          className="col-span-1 sm:col-span-2 lg:col-span-3 mb-2"
        />
        {filteredDrivers.map((driver) => (
          <div
            key={driver.driver_number}
            className="f1-card overflow-hidden flex flex-col"
          >
            <div className="relative">
              <span className="absolute top-3 right-4 text-4xl font-black text-white/10 leading-none">
                {driver.driver_number}
              </span>
              <img
                src={driver.headshot_url}
                alt={`Photo de ${driver.full_name}`}
                loading="lazy"
                width="150"
                height="150"
                className="mx-auto mt-4 drop-shadow-[0_8px_20px_rgba(225,6,0,0.35)]"
              />
            </div>
            <div className="p-5 border-t border-white/5">
              <h3 className="text-lg font-bold text-white">
                {driver.full_name}
              </h3>
              <p className="text-sm text-white/60 mt-1">
                <span className="text-red-500 font-semibold">Écurie</span> ·{" "}
                {driver.team_name}
              </p>
              <p className="text-sm text-white/60">
                <span className="text-red-500 font-semibold">N°</span>{" "}
                {driver.driver_number}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
