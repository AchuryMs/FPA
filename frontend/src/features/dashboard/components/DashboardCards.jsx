import React from "react";
import styles from "./DashboardCards.module.css";

export function DashboardCards({ user, currencySymbol }) {
  const balance = user?.portfolio?.reduce(
    (acc, item) => acc + (item.totalValue || 0),
    0
  );

  return (
    <div className={styles.cardsGrid}>
      <div className={styles.card}>
        <h3>Valor Total del Portafolio</h3>
        <p className={styles.value}>
          {currencySymbol} {balance?.toLocaleString() || "0"}
        </p>
      </div>
      <div className={styles.card}>
        <h3>Acciones</h3>
        <p>{user?.portfolio?.length || 0}</p>
      </div>
    </div>
  );
}