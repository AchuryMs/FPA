import React from "react";
import Header from "../components/Header.jsx";

export default function MainPage() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem" }}>
        <section style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.2rem", color: "#1e293b" }}>Bienvenido a InverSite</h1>
          <p style={{ fontSize: "1.2rem", color: "#334155" }}>
            Tu plataforma confiable para invertir y hacer crecer tu dinero. Explora oportunidades, gestiona tu portafolio y recibe asesoría personalizada.
          </p>
        </section>
        <section style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "250px", background: "#f1f5f9", borderRadius: "12px", padding: "1.5rem" }}>
            <h2 style={{ color: "#2563eb" }}>Oportunidades de Inversión</h2>
            <ul>
              <li>Fondo de renta fija - 8% anual</li>
              <li>Acciones tecnológicas - 12% anual</li>
              <li>Criptomonedas - 20% anual</li>
            </ul>
          </div>
          <div style={{ flex: "1", minWidth: "250px", background: "#f1f5f9", borderRadius: "12px", padding: "1.5rem" }}>
            <h2 style={{ color: "#2563eb" }}>Tu Portafolio</h2>
            <p>Saldo actual: <strong>$12,500 USD</strong></p>
            <p>Rendimiento estimado: <strong>11.2% anual</strong></p>
          </div>
          <div style={{ flex: "1", minWidth: "250px", background: "#f1f5f9", borderRadius: "12px", padding: "1.5rem" }}>
            <h2 style={{ color: "#2563eb" }}>Asesoría Personalizada</h2>
            <p>Recibe recomendaciones de inversión según tu perfil y objetivos.</p>
            <button style={{ background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer" }}>Solicitar asesoría</button>
          </div>
        </section>
        <section style={{ marginTop: "2rem", textAlign: "center", color: "#64748b" }}>
          <p>Datos ficticios para pruebas de desarrollo. Próximamente más funciones.</p>
        </section>
      </main>
    </div>
  );
}
