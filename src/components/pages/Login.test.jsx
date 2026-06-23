import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";

const { mockNavigate, mockSignIn } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSignIn: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: { signInWithPassword: mockSignIn },
  },
}));

function fillForm({
  email = "test@example.com",
  password = "motdepasse123",
} = {}) {
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText("Mot de passe"), {
    target: { value: password },
  });
}

describe("Login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("affiche une erreur si les identifiants sont incorrects", async () => {
    mockSignIn.mockResolvedValue({
      data: {},
      error: { message: "Identifiants invalides" },
    });

    render(<Login />);
    fillForm();
    fireEvent.click(screen.getByRole("button"));

    expect(
      await screen.findByText("Identifiants invalides"),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("redirige vers '/' après une connexion réussie", async () => {
    mockSignIn.mockResolvedValue({
      data: { user: { id: "uid-123" } },
      error: null,
    });

    render(<Login />);
    fillForm();
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
  });
});
