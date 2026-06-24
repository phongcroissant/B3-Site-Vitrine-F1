import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ConstructorsStanding from "./ConstructorsStanding";

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }));

vi.mock("../../../hooks/useFetch", () => ({
  useFetch: (...args) => mockUseFetch(...args),
}));

const sampleData = {
  MRData: {
    StandingsTable: {
      StandingsLists: [
        {
          ConstructorStandings: [
            { position: "1", points: "500", Constructor: { name: "Red Bull" } },
            { position: "2", points: "420", Constructor: { name: "Ferrari" } },
          ],
        },
      ],
    },
  },
};

describe("ConstructorsStanding", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement", () => {
    mockUseFetch.mockReturnValue({ loading: true, error: false, data: null });
    render(<ConstructorsStanding />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("affiche une erreur", () => {
    mockUseFetch.mockReturnValue({ loading: false, error: true, data: null });
    render(<ConstructorsStanding />);
    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
  });

  it("affiche le classement constructeurs", () => {
    mockUseFetch.mockReturnValue({
      loading: false,
      error: false,
      data: sampleData,
    });
    render(<ConstructorsStanding />);
    expect(screen.getByText("Red Bull")).toBeInTheDocument();
    expect(screen.getByText("Ferrari")).toBeInTheDocument();
  });
});
