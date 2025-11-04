import React, { useEffect, useState } from "react";
import styles from "./DashboardPage.module.css";
import { HeaderDash } from "./components/HeaderDash";
import { Sidebar } from "./components/Sidebar";
import { DashboardCards } from "./components/DashboardCards";
import { StockCard } from "./components/StockCard/StockCard.jsx";
import { authService } from "../../services/authService";
import { stockService } from "../../services/stockService";
import { portfolioService } from "../../services/portfolioService";


export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { ok: okUser, data: userData },
          { ok: okStocks, data: stockData },
        ] = await Promise.all([
          authService.getMe(),
          stockService.getTopCompaniesLatam(["CO", "MX", "AR"]),
        ]);

        if (okUser && userData.success) {
          setUser(userData.user);
          // 🔹 Llamar al portafolio una vez tengamos el usuario
          const portfolioRes = await portfolioService.getPortfolio(userData.user.id);
          if (portfolioRes.ok && portfolioRes.data.success) {
            setUser((prev) => ({
              ...prev,
              portfolio: portfolioRes.data.data,
            }));
          }
        }

        if (okStocks && stockData.success) {
          // 🔧 Aplanamos la estructura
          const flatCompanies = (stockData.data || []).flatMap((entry) =>
            entry.companies.map((c) => ({
              ...c,
              country: entry.country, // Añadimos el país a cada empresa
            }))
          );
          setStocks(flatCompanies);
        }
      } catch (err) {
        console.error("Error al cargar Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando tu información...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <HeaderDash user={user} />
        <div className={styles.cardsSection}>
          <DashboardCards user={user} />
        </div>

        {/* Sección de Stocks */}
        <h2 className={styles.sectionTitle}>Mercado LATAM</h2>
        <div className={styles.stocksGrid}>
          {stocks.length > 0 ? (
            stocks.map((c) => (
              <StockCard key={c.symbol || c.name} company={c} />
            ))
          ) : (
            <p>No hay datos de mercado disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}