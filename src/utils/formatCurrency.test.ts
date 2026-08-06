import { describe, it, expect } from "vitest";
import { formatMXN } from "./formatCurrency";

describe("formatMXN Utility", () => {
  it("debe formatear números enteros correctamente a MXN", () => {
    const result = formatMXN(2300);
    expect(result).toContain("2,300");
    expect(result).toContain("MXN");
  });

  it("debe formatear decimales cuando includeDecimals es true", () => {
    const result = formatMXN(690.5, true);
    expect(result).toContain("690.50");
    expect(result).toContain("MXN");
  });

  it("debe retornar $0 MXN cuando recibe un número no válido", () => {
    expect(formatMXN(NaN)).toBe("$0 MXN");
  });
});
