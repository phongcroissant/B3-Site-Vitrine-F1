import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DriversStanding from "./DriversStanding";

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }));

vi.mock("../../../hooks/useFetch", () => ({
  useFetch: (...args) => mockUseFetch(...args),
}));

const sampleData = {
  MRData: {
    StandingsTable: {
      StandingsLists: [
        {
          DriverStandings: [
            {
              position: "1",
              points: "310",
              Driver: {
                driverId: "max_verstappen",
                givenName: "Max",
                familyName: "Verstappen",
              },
              Constructors: [{ name: "Red Bull" }],
            },
          ],
        },
      ],
    },
  },
};

describe("DriversStanding", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche un indicateur de chargement", () => {
    mockUseFetch.mockReturnValue({ loading: true, error: false, data: null });
    render(<DriversStanding />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("affiche un message d'erreur en cas d'échec", () => {
    mockUseFetch.mockReturnValue({ loading: false, error: true, data: null });
    render(<DriversStanding />);
    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
  });

  it("affiche le classement quand les données sont chargées", () => {
    mockUseFetch.mockReturnValue({
      loading: false,
      error: false,
      data: sampleData,
    });
    render(<DriversStanding />);

    expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
    expect(screen.getByText("Red Bull")).toBeInTheDocument();
    expect(screen.getByText("310")).toBeInTheDocument();
  });

  it("interroge bien l'endpoint des classements pilotes", () => {
    mockUseFetch.mockReturnValue({ loading: true, error: false, data: null });
    render(<DriversStanding />);
    expect(mockUseFetch).toHaveBeenCalledWith(
      "https://api.jolpi.ca/ergast/f1/current/driverStandings.json",
    );
  });
});
