import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("affiche le code 404 et un lien de retour à l'accueil", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Retour à l'accueil" });
    expect(link).toHaveAttribute("href", "/");
  });
});
