import { useFetch } from "../../hooks/useFetch";

export default function DriverList() {
  const { loading, error, data } = useFetch(
    "https://api.openf1.org/v1/drivers?session_key=latest",
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Une erreur est survenue</p>;
  if (!data || data.length === 0) return <p>Aucune donnée</p>;

  const drivers = [...data].sort((a, b) =>
    a.team_name.localeCompare(b.team_name),
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
      {drivers.map((driver) => (
        <div
          key={driver.driver_number}
          className="card w-96 bg-base-100 shadow-xl mx-auto"
        >
          <figure>
            <img
              src={driver.headshot_url}
              alt={`Photo de ${driver.full_name}`}
              loading="lazy"
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
