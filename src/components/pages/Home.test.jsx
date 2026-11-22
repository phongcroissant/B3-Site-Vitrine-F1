import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

// Les données sont désormais chargées côté serveur et passées en props.
const race = {
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
};

describe("Home", () => {
  it("affiche une erreur", () => {
    render(<Home race={null} error={true} />);
    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
  });

  it("affiche un message si aucune donnée", () => {
    render(<Home race={null} error={false} />);
    expect(screen.getByText("Aucune donnée")).toBeInTheDocument();
  });

  it("affiche le nom du dernier GP en titre principal et les résultats", () => {
    render(<Home race={race} error={false} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Monaco Grand Prix" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Charles Leclerc")).toBeInTheDocument();
  });
});
