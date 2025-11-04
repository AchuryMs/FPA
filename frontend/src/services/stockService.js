import { apiFetch } from "./api";

export const stockService = {
  async getTopCompaniesLatam(countries = ["CO", "PE", "EC", "VE"]) {
    const query = `?countries=${countries.join(",")}`;
    return apiFetch(`/stocks/latam/top-companies${query}`);
  },

  async getGraph(symbol, days = 30) {
    return apiFetch(`/stocks/menu/graph?symbol=${symbol}&days=${days}`);
  },

  async placeOrder(order) {
    return apiFetch("/stocks/order", {
      method: "POST",
      body: JSON.stringify(order),
    });
  },
};