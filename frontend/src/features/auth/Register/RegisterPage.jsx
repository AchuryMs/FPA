import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { authService } from "../../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
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
      const { ok, data } = await authService.register(email, password, confirm);
      if (ok && data.success !== false) {
        setSuccess(data.message || "Usuario registrado correctamente");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Error al registrar");
      }
    } catch {
      setError("Falla de conexión");
    }
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleRegister}>
        <h1 className="login-title">Registro</h1>
        <div className="register-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="register-field">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="register-field">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
        </div>
        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}
        <button type="submit" className="register-btn">Registrarse</button>
        <div className="register-login">
          ¿Ya tienes cuenta?{" "}
          <span className="register-link" onClick={() => navigate("/login")}>
            Iniciar sesión
          </span>
        </div>
      </form>
    </div>
  );
}