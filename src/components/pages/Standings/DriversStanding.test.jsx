import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DriversStanding from "./DriversStanding";

const standings = [
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
];

describe("DriversStanding", () => {
  it("affiche un message d'erreur en cas d'échec", () => {
    render(<DriversStanding standings={[]} error={true} />);
    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
  });

  it("affiche un message si le classement est vide", () => {
    render(<DriversStanding standings={[]} error={false} />);
    expect(screen.getByText("Aucune donnée")).toBeInTheDocument();
  });

  it("affiche le classement quand les données sont chargées", () => {
    render(<DriversStanding standings={standings} error={false} />);

    expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
    expect(screen.getByText("Red Bull")).toBeInTheDocument();
    expect(screen.getByText("310")).toBeInTheDocument();
  });
});
