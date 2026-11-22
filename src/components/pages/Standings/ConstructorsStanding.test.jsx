import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConstructorsStanding from "./ConstructorsStanding";

const standings = [
  { position: "1", points: "500", Constructor: { name: "Red Bull" } },
  { position: "2", points: "420", Constructor: { name: "Ferrari" } },
];

describe("ConstructorsStanding", () => {
  it("affiche une erreur", () => {
    render(<ConstructorsStanding standings={[]} error={true} />);
    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
  });

  it("affiche le classement constructeurs", () => {
    render(<ConstructorsStanding standings={standings} error={false} />);
    expect(screen.getByText("Red Bull")).toBeInTheDocument();
    expect(screen.getByText("Ferrari")).toBeInTheDocument();
  });
});
