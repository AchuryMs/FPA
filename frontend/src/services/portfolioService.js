import { apiFetch } from "./api";

export const portfolioService = {
  async getPortfolio(investorId) {
    return apiFetch(`/portfolio/portfolio/${investorId}`);
  },
  async getOrders(investorId) {
    return apiFetch(`/portfolio/orders/${investorId}`);
  }
};