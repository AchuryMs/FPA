import React from "react";
import styles from "./CountrySelector.module.css";

const COUNTRY_OPTIONS = [
  { code: "CO", name: "Colombia", flag: "🇨🇴", currency: "COP", symbol: "$" },
  { code: "PE", name: "Perú", flag: "🇵🇪", currency: "PEN", symbol: "S/." },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", currency: "USD", symbol: "$" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", currency: "VES", symbol: "Bs." },
];

export default function CountrySelector({ onSelect, selectedCountry }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Selecciona tu país</h2>
        <div className={styles.grid}>
          {COUNTRY_OPTIONS.map((c) => (
            <button
              key={c.code}
              className={`${styles.countryBtn} ${
                selectedCountry === c.code ? styles.active : ""
              }`}
              onClick={() => onSelect(c)}
            >
              <span className={styles.flag}>{c.flag}</span>
              <span className={styles.name}>{c.name}</span>
              <small className={styles.currency}>{c.symbol} ({c.currency})</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}