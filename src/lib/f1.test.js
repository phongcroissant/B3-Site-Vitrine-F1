import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchJson,
  getLastRace,
  getDriverStandings,
  getConstructorStandings,
  getDrivers,
  getSeasonRaces,
  getRaceResult,
} from "./f1";

const ok = (payload) => ({ ok: true, json: () => Promise.resolve(payload) });

describe("lib/f1 (données côté serveur)", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it("fetchJson met la réponse en cache avec la durée demandée", async () => {
    fetch.mockResolvedValue(ok({ a: 1 }));
    const res = await fetchJson("https://api.test/x", 60);
    expect(res).toEqual({ data: { a: 1 }, error: false });
    expect(fetch).toHaveBeenCalledWith("https://api.test/x", {
      next: { revalidate: 60 },
    });
  });

  it("fetchJson renvoie une erreur si la réponse n'est pas OK", async () => {
    fetch.mockResolvedValue({ ok: false });
    expect(await fetchJson("https://api.test/x")).toEqual({ data: null, error: true });
  });

  it("fetchJson renvoie une erreur si le réseau échoue", async () => {
    fetch.mockRejectedValue(new Error("network"));
    expect(await fetchJson("https://api.test/x")).toEqual({ data: null, error: true });
  });

  it("getLastRace extrait la dernière course", async () => {
    fetch.mockResolvedValue(ok({ MRData: { RaceTable: { Races: [{ raceName: "GP" }] } } }));
    expect(await getLastRace()).toEqual({ race: { raceName: "GP" }, error: false });
    expect(fetch.mock.calls[0][0]).toBe("https://api.jolpi.ca/ergast/f1/current/last/results/");
  });

  it("getRaceResult interroge la bonne manche", async () => {
    fetch.mockResolvedValue(ok({ MRData: { RaceTable: { Races: [] } } }));
    expect(await getRaceResult("8")).toEqual({ race: null, error: false });
    expect(fetch.mock.calls[0][0]).toBe("https://api.jolpi.ca/ergast/f1/current/8/results/");
  });

  it("getDriverStandings interroge l'endpoint des classements pilotes", async () => {
    fetch.mockResolvedValue(
      ok({ MRData: { StandingsTable: { StandingsLists: [{ DriverStandings: [{ position: "1" }] }] } } }),
    );
    const res = await getDriverStandings();
    expect(res.standings).toEqual([{ position: "1" }]);
    expect(fetch.mock.calls[0][0]).toBe(
      "https://api.jolpi.ca/ergast/f1/current/driverStandings.json",
    );
  });

  it("getConstructorStandings renvoie une liste vide en cas d'erreur", async () => {
    fetch.mockResolvedValue({ ok: false });
    expect(await getConstructorStandings()).toEqual({ standings: [], error: true });
  });

  it("getDrivers renvoie la liste des pilotes", async () => {
    fetch.mockResolvedValue(ok([{ full_name: "Max Verstappen" }]));
    const res = await getDrivers();
    expect(res.drivers).toHaveLength(1);
    expect(fetch.mock.calls[0][0]).toBe("https://api.openf1.org/v1/drivers?session_key=latest");
  });

  it("getSeasonRaces met le calendrier en cache 24 h", async () => {
    fetch.mockResolvedValue(ok({ MRData: { RaceTable: { Races: [{ round: "1" }] } } }));
    const res = await getSeasonRaces();
    expect(res.races).toEqual([{ round: "1" }]);
    expect(fetch.mock.calls[0][1]).toEqual({ next: { revalidate: 86400 } });
  });
});
