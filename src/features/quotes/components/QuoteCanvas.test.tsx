import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuoteCanvas } from "./QuoteCanvas";
import { QuoteItem } from "../../../types/tenant";

describe("QuoteCanvas Component", () => {
  const sampleItems: QuoteItem[] = [
    {
      id: "item-1",
      treatmentName: "Corona de Zirconia",
      description: "Corona sobre diente 16",
      toothNumber: 16,
      unitPrice: 4500,
      quantity: 1,
      discount: 500,
      total: 4000,
    },
    {
      id: "item-2",
      treatmentName: "Limpieza Ultrasónica",
      toothNumber: undefined,
      unitPrice: 800,
      quantity: 1,
      discount: 0,
      total: 800,
    },
  ];

  test("QuoteCanvas debe renderizar los datos del médico y el monograma correctamente", () => {
    render(<QuoteCanvas items={[]} doctorName="Dra. Daniela Cázares" professionalId="Céd. Prof. 12345678" />);

    expect(screen.getByText("Dra. Daniela Cázares")).toBeInTheDocument();
    expect(screen.getByText("Prostodoncia Avanzada")).toBeInTheDocument();
    expect(screen.getByText("Céd. Prof. 12345678")).toBeInTheDocument();
    expect(screen.getByLabelText("Monograma DC")).toBeInTheDocument();
    expect(screen.getByText("DC")).toBeInTheDocument();
  });

  test("QuoteCanvas debe renderizar las filas de la tabla de tratamientos recibidas en la prop items", () => {
    render(<QuoteCanvas items={sampleItems} />);

    expect(screen.getByText("Corona de Zirconia")).toBeInTheDocument();
    expect(screen.getByText("Corona sobre diente 16")).toBeInTheDocument();
    expect(screen.getByText("Limpieza Ultrasónica")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
  });
});
