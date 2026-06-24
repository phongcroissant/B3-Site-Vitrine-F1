import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }));

vi.mock("../../hooks/useFetch", () => ({
  useFetch: (...args) => mockUseFetch(...args),
}));

const sampleData = {
  MRData: {
    RaceTable: {
      Races: [
        {
          raceName: "Monaco Grand Prix",
          Results: [
            {
              position: "1",
              points: "25",
              Driver: {
                driverId: "leclerc",
                givenName: "Charles",
                familyName: "Leclerc",
              },
              Constructor: { name: "Ferrari" },
            },
          ],
        },
      ],
    },
  },
};

describe("Home", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement", () => {
    mockUseFetch.mockReturnValue({ loading: true, error: false, data: null });
    render(<Home />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("affiche une erreur", () => {
    mockUseFetch.mockReturnValue({ loading: false, error: true, data: null });
    render(<Home />);
    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
  });

  it("affiche le nom du dernier GP et les résultats", () => {
    mockUseFetch.mockReturnValue({
      loading: false,
      error: false,
      data: sampleData,
    });
    render(<Home />);
    expect(screen.getByText(/Monaco Grand Prix/)).toBeInTheDocument();
    expect(screen.getByText("Charles Leclerc")).toBeInTheDocument();
  });
});
