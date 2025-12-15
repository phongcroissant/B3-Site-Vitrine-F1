import { useEffect, useState } from "react";

export default function DriverList() {
  const [APIState, setAPIState] = useState({
    loading: false,
    error: true,
    data: undefined,
  });
  useEffect(() => {
    setAPIState({ ...APIState, loading: true });
    fetch("https://api.openf1.org/v1/drivers?session_key=latest")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        data.sort((a, b) => a.team_name.localeCompare(b.team_name));
        setAPIState({
          loading: false,
          error: false,
          data: data,
        });
        console.log(data);
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
        {APIState.data?.map((driver) => (
          <div
            key={driver.driver_number}
            className="card w-96 bg-base-100 shadow-xl mx-auto"
          >
            <figure>
              <img src={driver.headshot_url} alt={driver.name_acronym} />
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
  } else if (APIState.data?.length === 0) {
    content = <p>Aucune donnée</p>;
  }
  return <div>{content}</div>;
}
