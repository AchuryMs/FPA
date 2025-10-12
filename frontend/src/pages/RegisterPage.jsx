import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const res = await fetch("http://localhost:3003/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password , confirm })
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setSuccess(data.message || "Usuario registrado correctamente");
        window.alert(data.message || "Usuario registrado correctamente");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        window.alert(data.message || "Error al registrar");
      }
    } catch (err) {
      setError("Falla de conexión");
    }
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleRegister}>
        <h1 className="login-title">Registro</h1>
          {/* ...existing code... */}
          <div className="register-field">
            <label htmlFor="email" className="register-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="register-input"
            />
          </div>
          <div className="register-field">
            <label htmlFor="password" className="register-label">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="register-input"
            />
          </div>
          <div className="register-field">
            <label htmlFor="confirm" className="register-label">Confirmar contraseña</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="register-input"
            />
          </div>
          {error && <div className="register-error">{error}</div>}
          {success && <div className="register-success">{success}</div>}
          <button type="submit" className="register-btn">Registrarse</button>
          <div className="register-login">
            ¿Ya tienes cuenta?{' '}
            <span className="register-link" onClick={() => navigate("/login")}>Iniciar sesión</span>
          </div>
      </form>
    </div>
  );
}
