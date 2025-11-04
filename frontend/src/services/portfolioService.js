import { apiFetch } from "./api";

export const portfolioService = {
  async getPortfolio(investorId) {
    return apiFetch(`/portfolio/portfolio/${investorId}`);
  },

  async getOrders(investorId) {
    return apiFetch(`/portfolio/orders/${investorId}`);
  },

  async createOrder(body) {
    return apiFetch(`/portfolio/orders`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async processOrder(orderId, body) {
    return apiFetch(`/portfolio/orders/${orderId}/process`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
