import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CommentSection from "./Comments";

const { mockFrom, mockInsert, mockUseAuth, orderResult } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockInsert: vi.fn(),
  mockUseAuth: vi.fn(),
  orderResult: { current: { data: [] } },
}));

vi.mock("../../lib/supabase", () => ({
  supabase: { from: (...a) => mockFrom(...a) },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Chaîne de lecture : from().select().eq().order() -> Promise
// Chaîne d'écriture : from().insert() -> Promise
function setupSupabase() {
  mockFrom.mockReturnValue({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve(orderResult.current),
      }),
    }),
    insert: mockInsert,
  });
}

function renderCmp() {
  return render(
    <MemoryRouter>
      <CommentSection idRace="monaco" />
    </MemoryRouter>,
  );
}

describe("CommentSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    orderResult.current = { data: [] };
    setupSupabase();
  });

  it("invite à se connecter quand l'utilisateur est anonyme", async () => {
    mockUseAuth.mockReturnValue({ user: null });
    renderCmp();
    expect(await screen.findByText("Connectez-vous")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Laisser un commentaire...")).toBeNull();
  });

  it("affiche les commentaires existants", async () => {
    mockUseAuth.mockReturnValue({ user: null });
    orderResult.current = {
      data: [{ id: 1, commentaire: "Super course !", users: { username: "max" } }],
    };
    renderCmp();
    expect(await screen.findByText("Super course !")).toBeInTheDocument();
    expect(screen.getByText("max")).toBeInTheDocument();
  });

  it("affiche le formulaire pour un utilisateur connecté", async () => {
    mockUseAuth.mockReturnValue({ user: { id: "uid-1" } });
    renderCmp();
    expect(
      await screen.findByPlaceholderText("Laisser un commentaire..."),
    ).toBeInTheDocument();
  });

  it("envoie un nouveau commentaire via Supabase", async () => {
    mockUseAuth.mockReturnValue({ user: { id: "uid-1" } });
    mockInsert.mockResolvedValue({ error: null });
    renderCmp();

    fireEvent.change(
      await screen.findByPlaceholderText("Laisser un commentaire..."),
      { target: { value: "Belle remontée" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Publier" }));

    await waitFor(() =>
      expect(mockInsert).toHaveBeenCalledWith({
        id_utilisateur: "uid-1",
        commentaire: "Belle remontée",
        id_course: "monaco",
      }),
    );
  });

  it("n'envoie rien si le commentaire est vide", async () => {
    mockUseAuth.mockReturnValue({ user: { id: "uid-1" } });
    renderCmp();
    await screen.findByPlaceholderText("Laisser un commentaire...");

    fireEvent.click(screen.getByRole("button", { name: "Publier" }));
    expect(mockInsert).not.toHaveBeenCalled();
  });
});
