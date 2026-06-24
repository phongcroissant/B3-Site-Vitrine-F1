import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "./useFetch";

describe("useFetch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retourne l'état initial loading=true", () => {
    fetch.mockReturnValue(new Promise(() => {})); // jamais résolu
    const { result } = renderHook(() => useFetch("https://api.test/data"));

    expect(result.current).toEqual({ loading: true, error: false, data: null });
  });

  it("expose les données après une réponse OK", async () => {
    const payload = { drivers: ["VER", "HAM"] };
    fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(payload) });

    const { result } = renderHook(() => useFetch("https://api.test/data"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(payload);
    expect(result.current.error).toBe(false);
  });

  it("passe en erreur si la réponse n'est pas OK", async () => {
    fetch.mockResolvedValue({ ok: false, json: () => Promise.resolve({}) });

    const { result } = renderHook(() => useFetch("https://api.test/data"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it("passe en erreur si le fetch rejette", async () => {
    fetch.mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useFetch("https://api.test/data"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);
  });

  it("ne lance aucune requête si l'url est vide", () => {
    renderHook(() => useFetch(""));
    expect(fetch).not.toHaveBeenCalled();
  });

  it("refait une requête quand l'url change", async () => {
    fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ ok: 1 }) });

    const { rerender } = renderHook(({ url }) => useFetch(url), {
      initialProps: { url: "https://api.test/a" },
    });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    rerender({ url: "https://api.test/b" });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(fetch).toHaveBeenLastCalledWith("https://api.test/b");
  });
});
