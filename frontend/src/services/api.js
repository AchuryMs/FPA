const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // Manejo global de sesión
  if (response.status === 401 || response.status === 403) {
    localStorage.setItem("sessionExpired", "Tu sesión ha expirado, por favor inicia sesión nuevamente.");

    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    // Redirigir al login automáticamente
    window.location.href = "/login";
    return { ok: false, data: { message: "Sesión expirada" } };
  }

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, data };
}