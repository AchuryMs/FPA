import { apiFetch } from "./api";

export const authService = {
  async login(email, password) {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(email, password, confirm) {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, confirm }),
    });
  },

  async getMe() {
    return apiFetch("/auth/me");
  },
};