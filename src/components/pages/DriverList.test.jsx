import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DriverList from "./DriverList";

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }));

vi.mock("../../hooks/useFetch", () => ({
  useFetch: (...args) => mockUseFetch(...args),
}));

const drivers = [
  {
    driver_number: 1,
    full_name: "Max Verstappen",
    team_name: "Red Bull",
    headshot_url: "https://img/ver.png",
  },
  {
    driver_number: 44,
    full_name: "Lewis Hamilton",
    team_name: "Ferrari",
    headshot_url: "https://img/ham.png",
  },
];

describe("DriverList", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche le chargement", () => {
    mockUseFetch.mockReturnValue({ loading: true, error: false, data: null });
    render(<DriverList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("affiche une erreur", () => {
    mockUseFetch.mockReturnValue({ loading: false, error: true, data: null });
    render(<DriverList />);
    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
  });

  it("affiche tous les pilotes par défaut", () => {
    mockUseFetch.mockReturnValue({ loading: false, error: false, data: drivers });
    render(<DriverList />);
    expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
    expect(screen.getByText("Lewis Hamilton")).toBeInTheDocument();
  });

  it("filtre les pilotes selon la recherche (par nom)", () => {
    mockUseFetch.mockReturnValue({ loading: false, error: false, data: drivers });
    render(<DriverList />);

    fireEvent.change(
      screen.getByPlaceholderText("Rechercher un pilote ou une écurie..."),
      { target: { value: "hamilton" } },
    );

    expect(screen.getByText("Lewis Hamilton")).toBeInTheDocument();
    expect(screen.queryByText("Max Verstappen")).not.toBeInTheDocument();
  });

  it("filtre les pilotes selon la recherche (par écurie)", () => {
    mockUseFetch.mockReturnValue({ loading: false, error: false, data: drivers });
    render(<DriverList />);

    fireEvent.change(
      screen.getByPlaceholderText("Rechercher un pilote ou une écurie..."),
      { target: { value: "red bull" } },
    );

    expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
    expect(screen.queryByText("Lewis Hamilton")).not.toBeInTheDocument();
  });
});
