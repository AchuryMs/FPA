import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ detecta la ruta actual

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // 🔹 Función para saber si una ruta está activa
  const isActive = (path) => location.pathname === path;

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.logo}>FPA</h3>
      <nav className={styles.menu}>
        <button
          onClick={() => navigate("/dashboard")}
          className={isActive("/dashboard") ? styles.active : ""}
        >
          Inicio
        </button>
        <button
          onClick={() => navigate("/contracts")}
          className={isActive("/contracts") ? styles.active : ""}
        >
          Contratos
        </button>
        <button
          onClick={() => navigate("/brokers")}
          className={isActive("/brokers") ? styles.active : ""}
        >
          Brokers
        </button>
        <button
          onClick={() => navigate("/portfolio")}
          className={isActive("/portfolio") ? styles.active : ""}
        >
          Portafolio
        </button>
        <button onClick={handleLogout} className={styles.logout}>
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}