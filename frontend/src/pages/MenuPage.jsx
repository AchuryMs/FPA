import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MenuPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Leer el token del localStorage
    const savedToken = localStorage.getItem("authToken");
    if (!savedToken) {
      setError("No tienes sesión activa. Inicia sesión primero.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    setToken(savedToken);
    // Decodificar el token JWT para obtener el usuario
    try {
      const payload = JSON.parse(atob(savedToken.split(".")[1]));
      setUser(payload);
    } catch {
      setError("Token inválido");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Menú Principal</h1>
      {error && <div style={{ color: "#dc2626", marginBottom: "1rem" }}>{error}</div>}
      {user && (
        <div>
          <p>Bienvenido, <b>{user.email}</b></p>
          <p>Tu token es:</p>
          <textarea value={token} readOnly style={{ width: "100%", height: "80px" }} />
          {/* Aquí puedes agregar botones para navegar a otras secciones */}
        </div>
      )}
    </div>
  );
}
