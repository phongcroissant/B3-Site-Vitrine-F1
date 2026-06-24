import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  it("affiche la valeur et le placeholder fournis", () => {
    render(
      <SearchBar value="ver" onChange={() => {}} placeholder="Rechercher" />,
    );

    const input = screen.getByPlaceholderText("Rechercher");
    expect(input).toHaveValue("ver");
  });

  it("appelle onChange avec la nouvelle valeur saisie", () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} placeholder="Rechercher" />);

    fireEvent.change(screen.getByPlaceholderText("Rechercher"), {
      target: { value: "hamilton" },
    });

    expect(onChange).toHaveBeenCalledWith("hamilton");
  });

  it("applique la classe additionnelle passée en prop", () => {
    render(
      <SearchBar
        value=""
        onChange={() => {}}
        placeholder="Rechercher"
        className="mb-4"
      />,
    );

    expect(screen.getByPlaceholderText("Rechercher")).toHaveClass("mb-4");
  });
});
