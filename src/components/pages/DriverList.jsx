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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un pilote ou une écurie..."
        className="col-span-1 sm:col-span-2"
      />
      {filteredDrivers.map((driver) => (
        <div
          key={driver.driver_number}
          className="card w-96 bg-base-100 shadow-xl mx-auto"
        >
          <figure>
            <img
              src={driver.headshot_url}
              alt={`Photo de ${driver.full_name}`}
              loading="lazy"
              width="150"
              height="150"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{driver.full_name}</h2>
            <p>Écurie : {driver.team_name}</p>
            <p>Numéro : {driver.driver_number}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
