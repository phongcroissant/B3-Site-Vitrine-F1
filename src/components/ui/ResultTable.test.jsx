import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResultTable from "./ResultTable";

const columns = [
  { header: "Pos", render: (row) => row.pos },
  { header: "Pilote", render: (row) => row.name },
];

const rows = [
  { id: 1, pos: 1, name: "Verstappen" },
  { id: 2, pos: 2, name: "Hamilton" },
];

describe("ResultTable", () => {
  it("affiche les en-têtes de colonnes", () => {
    render(
      <ResultTable columns={columns} rows={rows} rowKey={(r) => r.id} />,
    );

    expect(screen.getByText("Pos")).toBeInTheDocument();
    expect(screen.getByText("Pilote")).toBeInTheDocument();
  });

  it("rend une ligne par élément avec les valeurs rendues", () => {
    render(
      <ResultTable columns={columns} rows={rows} rowKey={(r) => r.id} />,
    );

    expect(screen.getByText("Verstappen")).toBeInTheDocument();
    expect(screen.getByText("Hamilton")).toBeInTheDocument();
    // 1 ligne d'en-tête + 2 lignes de données
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("gère une liste de lignes vide sans erreur", () => {
    render(
      <ResultTable columns={columns} rows={[]} rowKey={(r) => r.id} />,
    );

    expect(screen.getByText("Pos")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(1); // en-tête seul
  });

  it("passe l'index à la fonction render", () => {
    const indexedColumns = [
      { header: "#", render: (_row, index) => `idx-${index}` },
    ];
    render(
      <ResultTable columns={indexedColumns} rows={rows} rowKey={(r) => r.id} />,
    );

    expect(screen.getByText("idx-0")).toBeInTheDocument();
    expect(screen.getByText("idx-1")).toBeInTheDocument();
  });
});
