import React from "react";
import styles from "./HeaderDash.module.css";

export function HeaderDash({ user, selectedCountry, onCountryChange }) {
  const flags = {
    CO: "🇨🇴", PE: "🇵🇪", EC: "🇪🇨", VE: "🇻🇪",
    MX: "🇲🇽", BR: "🇧🇷", AR: "🇦🇷", CL: "🇨🇱",
    US: "🇺🇸", EU: "🇪🇺", ASIA: "🌏"
  };

  return (
    <header className={styles.header}>
      <h1>Andina Trading</h1>
      <div className={styles.userSection}>
        <button className={styles.countryBtn} onClick={onCountryChange}>
          {flags[selectedCountry] || "🌎"} {selectedCountry}
        </button>
        <span className={styles.userName}>{user?.email || "Invitado"}</span>
      </div>
    </header>
  );
}