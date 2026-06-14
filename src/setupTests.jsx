import "@testing-library/jest-dom";

import { render, screen, test, expect } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../src/components/pages/Register";

test("affiche le formulaire d inscription", () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Pseudo")).toBeInTheDocument();
  expect(screen.getByText("Créer mon compte")).toBeInTheDocument();
});
