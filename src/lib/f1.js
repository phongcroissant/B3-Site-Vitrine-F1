// Récupération des données F1 CÔTÉ SERVEUR, avec mise en cache (ISR).
// -----------------------------------------------------------------------------
// Les pages appellent ces fonctions pendant le rendu serveur : le HTML envoyé
// au navigateur (et à Google) contient déjà les résultats. Next.js garde la
// réponse en cache pendant `revalidate` secondes, ce qui limite aussi le nombre
// d'appels aux API F1 externes.
// -----------------------------------------------------------------------------

export const JOLPICA = "https://api.jolpi.ca/ergast/f1";
export const OPENF1 = "https://api.openf1.org/v1";

// Durées de cache (en secondes)
export const HOUR = 3600;
export const DAY = 86400;

export async function fetchJson(url, revalidate = HOUR) {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return { data: null, error: true };
    return { data: await res.json(), error: false };
  } catch {
    return { data: null, error: true };
  }
}

export async function getLastRace() {
  const { data, error } = await fetchJson(`${JOLPICA}/current/last/results/`);
  return { race: data?.MRData?.RaceTable?.Races?.[0] ?? null, error };
}

export async function getRaceResult(round) {
  const { data, error } = await fetchJson(
    `${JOLPICA}/current/${encodeURIComponent(round)}/results/`,
  );
  return { race: data?.MRData?.RaceTable?.Races?.[0] ?? null, error };
}

export async function getSeasonRaces() {
  const { data, error } = await fetchJson(`${JOLPICA}/current/`, DAY);
  return { races: data?.MRData?.RaceTable?.Races ?? [], error };
}

export async function getDrivers() {
  const { data, error } = await fetchJson(
    `${OPENF1}/drivers?session_key=latest`,
  );
  return { drivers: Array.isArray(data) ? data : [], error };
}

export async function getDriverStandings() {
  const { data, error } = await fetchJson(
    `${JOLPICA}/current/driverStandings.json`,
  );
  return {
    standings:
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [],
    error,
  };
}

export async function getConstructorStandings() {
  const { data, error } = await fetchJson(
    `${JOLPICA}/current/constructorStandings.json`,
  );
  return {
    standings:
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ??
      [],
    error,
  };
}
