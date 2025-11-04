import React, { useEffect, useState } from "react";
import styles from "./DashboardPage.module.css";
import { HeaderDash } from "./components/HeaderDash";
import { Sidebar } from "./components/Sidebar";
import { DashboardCards } from "./components/DashboardCards";
import { StockCard } from "./components/StockCard/StockCard.jsx";
import TradeModal from "./components/TradeModal/TradeModal.jsx";
import { authService } from "../../services/authService";
import { stockService } from "../../services/stockService";
import { portfolioService } from "../../services/portfolioService";
import CountrySelector from "./components/CountrySelector/CountrySelector.jsx";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    localStorage.getItem("selectedCountry") || "CO"
  );
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem("selectedCurrency") || "COP"
  );
  const [selectedSymbol, setSelectedSymbol] = useState(
    localStorage.getItem("selectedSymbol") || "$"
  );
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { ok: okUser, data: userData },
          { ok: okStocks, data: stockData },
        ] = await Promise.all([
          authService.getMe(),
          stockService.getTopCompaniesLatam([
            "CO",
            "PE",
            "EC",
            "VE",
            "MX",
            "BR",
            "AR",
            "CL",
            "US",
            "EU",
            "ASIA",
          ]),
        ]);

        if (okUser && userData.success) {
          setUser(userData.user);
          const portfolioRes = await portfolioService.getPortfolio(userData.user.id);
          if (portfolioRes.ok && portfolioRes.data.success) {
            setUser((prev) => ({
              ...prev,
              portfolio: portfolioRes.data.data,
            }));
          }
        }

        if (okStocks && stockData.success) {
          const flatCompanies = (stockData.data || []).flatMap((entry) =>
            entry.companies.map((c) => ({ ...c, country: entry.country }))
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

  const handleCountrySelect = (country) => {
    setSelectedCountry(country.code);
    setSelectedCurrency(country.currency);
    setSelectedSymbol(country.symbol);
    localStorage.setItem("selectedCountry", country.code);
    localStorage.setItem("selectedCurrency", country.currency);
    localStorage.setItem("selectedSymbol", country.symbol);
    setShowSelector(false);
  };

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
        <HeaderDash
          user={user}
          onCountryChange={() => setShowSelector(true)}
          selectedCountry={selectedCountry}
          selectedCurrency={selectedCurrency}
        />

        <div className={styles.cardsSection}>
          <DashboardCards user={user} currencySymbol={selectedSymbol} />
        </div>

        <h2 className={styles.sectionTitle}>
          Mercado Andino y Global — ({selectedSymbol} {selectedCurrency})
        </h2>

        <div className={styles.stocksGrid}>
          {stocks.length > 0 ? (
            stocks.map((c) => (
              <StockCard
                key={c.symbol || c.name}
                company={c}
                currencySymbol={selectedSymbol}
                onSelect={setSelectedCompany}
              />
            ))
          ) : (
            <p>No hay datos de mercado disponibles.</p>
          )}
        </div>

        {selectedCompany && (
          <TradeModal
            company={selectedCompany}
            user={user}
            onClose={() => setSelectedCompany(null)}
          />
        )}

        {showSelector && (
          <CountrySelector
            onSelect={handleCountrySelect}
            selectedCountry={selectedCountry}
          />
        )}
      </div>
    </div>
  );
}