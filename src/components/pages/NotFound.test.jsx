import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("affiche le code 404 et un lien de retour à l'accueil", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Retour à l'accueil" });
    expect(link).toHaveAttribute("href", "/");
  });
});
