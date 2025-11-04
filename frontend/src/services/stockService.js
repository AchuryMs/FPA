import { apiFetch } from "./api";

export const stockService = {
  async getTopCompaniesLatam(countries = ["CO"]) {
    const query = countries.join(",");
    return apiFetch(`/stocks/latam/top-companies?countries=${query}`);
  },

  async getGraphData(symbol = "AAPL", days = 30) {
    return apiFetch(`/stocks/menu/graph?symbol=${symbol}&days=${days}`);
  },
};