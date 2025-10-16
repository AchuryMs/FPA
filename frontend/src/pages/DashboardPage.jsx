import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import InvestmentPerformanceCard from "../components/InvestmentPerformanceCard";
import AnalysisChartCard from "../components/AnalysisChartCard";
import RiskIndicatorCard from "../components/RiskIndicatorCard";
import AllocationTableCard from "../components/AllocationTableCard";
import "./DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  
  // Estados para datos del gráfico
  const [prices, setPrices] = useState([]);
  const [symbol, setSymbol] = useState("AAPL");
  const [days, setDays] = useState(20);
  const [loadingChart, setLoadingChart] = useState(false);

  // Estados para otros datos del dashboard (puedes agregar más endpoints)
  const [portfolioData, setPortfolioData] = useState(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (!savedToken) {
      setError("No tienes sesión activa. Inicia sesión primero.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    setToken(savedToken);
    try {
      const payload = JSON.parse(atob(savedToken.split(".")[1]));
      setUser(payload);
    } catch {
      setError("Token inválido");
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [navigate]);

  // Fetch datos del gráfico (del MenuPage original)
  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    async function fetchPrices() {
      setLoadingChart(true);
      try {
        const url = `http://localhost:3002/stock-service/menu/graph?symbol=${encodeURIComponent(symbol)}&days=${days}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const payload = json?.data;
        const series = Array.isArray(payload?.data) ? payload.data : [];

        setPrices(series);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Graph fetch error", err);
          setPrices([]);
        }
      } finally {
        setLoadingChart(false);
      }
    }

    fetchPrices();
    return () => controller.abort();
  }, [symbol, days, token]);

  // Fetch datos del portafolio (opcional - agrega tu endpoint)
  useEffect(() => {
    if (!token) return;

    async function fetchPortfolioData() {
      setLoadingPortfolio(true);
      try {
        // Reemplaza con tu endpoint real
        const res = await fetch('http://localhost:3002/api/portfolio', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPortfolioData(data);
      } catch (err) {
        console.error("Portfolio fetch error", err);
        setPortfolioData(null);
      } finally {
        setLoadingPortfolio(false);
      }
    }

    // Descomentar cuando tengas el endpoint listo
    // fetchPortfolioData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Datos del gráfico procesados para AnalysisChartCard
  const chartData = prices.length > 0 ? prices.map((price, idx) => ({
    month: `Day ${idx + 1}`,
    value1: price,
    value2: price * 0.9,
    value3: price * 0.8
  })) : [];

  // Datos mock mientras no tengas endpoints (puedes eliminar cuando conectes APIs reales)
  const investmentAssets = [
    { name: 'Acciones', color: '#1f2937', percentage: 40 },
    { name: 'Bonos', color: '#6b7280', percentage: 25 },
    { name: 'ETFs', color: '#9ca3af', percentage: 15 }
  ];

  const assetAllocation = portfolioData?.allocation || [
    { name: 'Stocks & ETFs', percentage: '43', amount: 67500 },
    { name: 'Bonds', percentage: '22', amount: 37500 },
    { name: 'Commodities', percentage: '10', amount: 15000 },
    { name: 'Cash & Others', percentage: '3', amount: 7500 }
  ];

  const salesTable = portfolioData?.sales || [
    { name: 'Tech Growth Fund', percentage: 'BUY', amount: 125000 },
    { name: 'Tesla Inc. Stocks', percentage: 'BUY', amount: 87500 },
    { name: 'Bitcoin (BTC)', percentage: 'BUY', amount: 99500 },
    { name: 'Gold ETF', percentage: 'BUY', amount: 32490 }
  ];

  if (error && !user) {
    return (
      <div className="error-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <Header user={user} onLogout={handleLogout} />
        
        <div className="dashboard-content">
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Invierte inteligente con Nosotros</h2>
              <p className="section-subtitle">Acciones con un balance favorable</p>
            </div>

            {/* Controles del gráfico */}
            <div className="chart-controls">
              <label>
                Símbolo: 
                <input
                  value={symbol}
                  onChange={e => setSymbol(e.target.value.toUpperCase())}
                  className="symbol-input"
                  placeholder="AAPL"
                />
              </label>
              <label>
                Días: 
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={days}
                  onChange={e => setDays(Number(e.target.value) || 90)}
                  className="days-input"
                />
              </label>
              <span className="data-source">Datos: Yahoo Finance</span>
            </div>

            <div className="dashboard-grid">
              <InvestmentPerformanceCard 
                totalValue={8750}
                percentage={12.5}
                assets={investmentAssets}
              />

              <AnalysisChartCard data={chartData} />

              <RiskIndicatorCard />

              <AllocationTableCard 
                title="Asset Allocation"
                data={assetAllocation}
                accentColor="#0f5c4c"
              />

              <AllocationTableCard 
                title="Investment Sales Table"
                data={salesTable}
                accentColor="#1e3a5f"
              />
            </div>

            {loadingChart && (
              <div className="loading-overlay">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}