import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DriverList from "./DriverList";

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
  it("affiche une erreur", () => {
    render(<DriverList drivers={[]} error={true} />);
    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
  });

  it("affiche un message si aucun pilote", () => {
    render(<DriverList drivers={[]} error={false} />);
    expect(screen.getByText("Aucune donnée")).toBeInTheDocument();
  });

  it("affiche tous les pilotes par défaut", () => {
    render(<DriverList drivers={drivers} error={false} />);
    expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
    expect(screen.getByText("Lewis Hamilton")).toBeInTheDocument();
  });

  it("filtre les pilotes selon la recherche (par nom)", () => {
    render(<DriverList drivers={drivers} error={false} />);

    fireEvent.change(
      screen.getByPlaceholderText("Rechercher un pilote ou une écurie..."),
      { target: { value: "hamilton" } },
    );

    expect(screen.getByText("Lewis Hamilton")).toBeInTheDocument();
    expect(screen.queryByText("Max Verstappen")).not.toBeInTheDocument();
  });

  it("filtre les pilotes selon la recherche (par écurie)", () => {
    render(<DriverList drivers={drivers} error={false} />);

    fireEvent.change(
      screen.getByPlaceholderText("Rechercher un pilote ou une écurie..."),
      { target: { value: "red bull" } },
    );

    expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
    expect(screen.queryByText("Lewis Hamilton")).not.toBeInTheDocument();
  });
});
