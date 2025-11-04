export const currencyByCountry = {
  CO: "COP",
  PE: "PEN",
  EC: "USD",
  VE: "VES",
};

export function formatCurrency(value, country = "CO") {
  const currency = currencyByCountry[country] || "USD";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}