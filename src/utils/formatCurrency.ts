/**
 * Formatea un número como moneda en Pesos Mexicanos (MXN).
 * Ejemplo: 2300 -> "$2,300.00 MXN" o "$2,300 MXN"
 */
export function formatMXN(amount: number, includeDecimals = false): string {
  if (isNaN(amount)) return "$0 MXN";
  const formatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);

  return `${formatted} MXN`;
}
