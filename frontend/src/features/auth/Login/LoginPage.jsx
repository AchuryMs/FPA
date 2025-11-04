
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { apiFetch } from "../../../services/api.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { ok, data } = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (ok && data.token) {
        localStorage.setItem("authToken", data.token);
        // Obtener datos del usuario
        const { data: me } = await apiFetch("/auth/me");
        if (me?.user?.user_type) {
          localStorage.setItem("userRole", me.user.user_type);
        }
        navigate("/dashboard");
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
    }
  };

//PAra que muestre mensaje de expiracion
  useEffect(() => {
  const msg = localStorage.getItem("sessionExpired");
  if (msg) {
    setError(msg);
    localStorage.removeItem("sessionExpired");
  }
}, []);


  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="login-title">Login</h1>
        <div style={{ marginBottom: "1.2rem" }}>
          <label htmlFor="email" className="login-label">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="password" className="login-label">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>
        {error && <div style={{ color: "#dc2626", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
        <button type="submit" className="login-btn">
          Ingresar
        </button>
        <div className="login-register">
          ¿No tienes cuenta?{' '}
          <span className="login-link" onClick={() => navigate("/register")}>Quiere registrarse</span>
        </div>
      </form>
    </div>
  );
}
