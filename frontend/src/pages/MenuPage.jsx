import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MenuPage.css";

function Sparkline({ prices = [], color = '#0ea5e9' }) {
  if (!prices || prices.length === 0) return <div className="sparkline empty">No data</div>;
  const w = 240;
  const h = 60;
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w;
    const y = h - ((p - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg className="sparkline" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function MenuPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [prices, setPrices] = useState([]);
  const [symbol, setSymbol] = useState("AAPL");     // <- fix typo
  const [days, setDays] = useState(90);             // <- define days
  const [loadingChart, setLoadingChart] = useState(false);

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

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPrices() {
      setLoadingChart(true);
      try {
        const url = `http://localhost:3002/stock-service/menu/graph?symbol=${encodeURIComponent(symbol)}&days=${days}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // Esperado: { success: boolean, data: { symbol, labels: string[], data: number[] } }
        const payload = json?.data;
        const series = Array.isArray(payload?.data) ? payload.data : [];

        setPrices(series.slice(-30)); // últimos 30 puntos
      } catch (err) {
        console.error("Graph fetch error", err);
        setPrices([]);
      } finally {
        setLoadingChart(false);
      }
    }

    fetchPrices();
    return () => controller.abort(); // <- cleanup correcto
  }, [symbol, days]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleBuy = () => navigate("/buy");
  const handleSell = () => navigate("/sell");
  const handlePortfolio = () => navigate("/portfolio");

  return (
    <div className="menu-page">
      <div className="menu-card">
        <h1 className="menu-title">Menú Principal</h1>
        {error && <div className="menu-error">{error}</div>}

        {user && (
          <div className="menu-body">
            <div className="user-block">
              <p className="welcome">Bienvenido, <b>{user.email}</b></p>
            </div>

            <div className="actions">
              <button className="btn btn-primary" onClick={handleBuy}>Adquirir acciones</button>
              <button className="btn btn-primary" onClick={handleSell}>Vender acciones</button>
              <button className="btn" onClick={handlePortfolio}>Ver mi portafolio</button>
              <button className="btn btn-ghost" onClick={handleLogout}>Deslogearse</button>
            </div>

            <div className="chart-block">
              <div className="chart-header">
                <label>Símbolo: </label>
                <input
                  value={symbol}
                  onChange={e => setSymbol(e.target.value.toUpperCase())}
                  className="symbol-input"
                />
                <label style={{ marginLeft: 8 }}>Días: </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={days}
                  onChange={e => setDays(Number(e.target.value) || 90)}
                  className="symbol-input"
                  style={{ width: 80 }}
                />
                <span className="small-note">Datos: Yahoo Finance</span>
              </div>

              <div className="chart-area">
                {loadingChart ? (
                  <div className="chart-loading">Cargando gráfico...</div>
                ) : (
                  <Sparkline prices={prices} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
