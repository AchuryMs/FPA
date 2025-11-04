import React from "react";
import styles from "./StockCard.module.css";

export function StockCard({ company }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{company.symbol}</h3>
        <span className={styles.country}>{company.country}</span>
      </div>
      <p className={styles.name}>{company.name}</p>
      <div className={styles.priceInfo}>
        <span className={styles.price}>${company.price?.toFixed(2) ?? "N/A"}</span>
        <span
          className={`${styles.change} ${
            company.change >= 0 ? styles.positive : styles.negative
          }`}
        >
          {company.change?.toFixed(2)} ({company.percent?.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}