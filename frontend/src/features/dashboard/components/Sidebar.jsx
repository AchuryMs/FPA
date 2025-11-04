import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.logo}>FPA</h3>
      <nav className={styles.menu}>
        <button onClick={() => navigate("/dashboard")}>Inicio</button>
        <button onClick={() => navigate("/contracts")}>Contratos</button>
        <button onClick={() => navigate("/brokers")}>Brokers</button>
        <button onClick={() => navigate("/portfolio")}>Portafolio</button>
        <button onClick={handleLogout} className={styles.logout}>
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}