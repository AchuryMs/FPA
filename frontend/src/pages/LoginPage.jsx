
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        navigate("/menu");
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

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
