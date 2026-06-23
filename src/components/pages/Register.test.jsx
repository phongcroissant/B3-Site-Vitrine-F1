import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";

const { mockNavigate, mockSignUp, mockInsert } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSignUp: vi.fn(),
  mockInsert: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: { signUp: mockSignUp },
    from: () => ({ insert: mockInsert }),
  },
}));

function fillForm({
  email = "test@example.com",
  pseudo = "monpseudo",
  password = "motdepasse123",
  confirm = "motdepasse123",
} = {}) {
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText("Pseudo"), {
    target: { value: pseudo },
  });
  fireEvent.change(screen.getByLabelText("Mot de passe"), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), {
    target: { value: confirm },
  });
}

describe("Register", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche une erreur si les mots de passe ne correspondent pas", async () => {
    render(<Register />);
    fillForm({ confirm: "autrechose" });
    fireEvent.click(screen.getByRole("button"));

    expect(
      await screen.findByText("Les mots de passe ne correspondent pas."),
    ).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("redirige vers '/' après une inscription réussie", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "uid-123" } },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });

    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
  });
});
