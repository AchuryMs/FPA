import React from "react";
import styles from "./DashboardCards.module.css";

export function DashboardCards({ user }) {
  return (
    <div className={styles.cardsGrid}>
      <div className={styles.card}>
        <h3>Bienvenido</h3>
        <p>{user?.email || "Usuario no identificado"}</p>
      </div>
      <div className={styles.card}>
        <h3>Rol</h3>
        <p>{user?.user_type || "N/A"}</p>
      </div>
      <div className={styles.card}>
        <h3>Estado</h3>
        <p>{user ? "Conectado ✅" : "Cargando..."}</p>
      </div>
    </div>
  );
}