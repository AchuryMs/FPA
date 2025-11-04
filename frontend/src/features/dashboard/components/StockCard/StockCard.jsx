import React from "react";
import styles from "./StockCard.module.css";

export function StockCard({ company, currencySymbol, onSelect }) {
  return (
    <div className={styles.card} onClick={() => onSelect(company)}>
      <div className={styles.header}>
        <h4>{company.name}</h4>
        <span className={styles.symbol}>{company.symbol}</span>
      </div>

      <div className={styles.price}>
        {currencySymbol} {company.price?.toFixed(2) || "--"}
      </div>

      <div
        className={`${styles.change} ${company.change > 0 ? styles.positive : styles.negative
          }`}
      >
        {(company.change * 100).toFixed(2)}%
      </div>
    </div>
  );
}