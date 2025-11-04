import React from "react";
import styles from "./HeaderDash.module.css";

export function HeaderDash({ user }) {
  const totalAssets = user?.portfolio?.length || 0;
  const totalValue = user?.portfolio?.reduce((acc, p) => acc + (p.value || 0), 0) || 0;

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h2 className={styles.title}>Dashboard</h2>
        <span className={styles.subtitle}>
          Bienvenido, {user?.email || "usuario"} 👋
        </span>
      </div>

      <div className={styles.portfolioInfo}>
        <div>
          <span className={styles.label}>Activos:</span>
          <span className={styles.value}>{totalAssets}</span>
        </div>
        <div>
          <span className={styles.label}>Valor Total:</span>
          <span className={styles.value}>${totalValue.toFixed(2)}</span>
        </div>
      </div>
    </header>
  );
}