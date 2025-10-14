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
  const [symbol, setSymbol] = useState('APPL');
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
    // Fetch a small historical series from Yahoo Finance public chart API
    async function fetchPrices() {
      setLoadingChart(true);
      try {
        // Yahoo Finance chart endpoint
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d&indicators=quote`;
        const res = await fetch(url);
        const json = await res.json();
        const result = json.chart && json.chart.result && json.chart.result[0];
        if (result && result.indicators && result.indicators.quote && result.indicators.quote[0].close) {
          const closes = result.indicators.quote[0].close.filter(c => c !== null);
          setPrices(closes.slice(-30));
        } else {
          setPrices([]);
        }
      } catch (err) {
        console.error('Chart fetch error', err);
        setPrices([]);
      } finally {
        setLoadingChart(false);
      }
    }
    fetchPrices();
  }, [symbol]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleBuy = () => {
    // Rudimentary: navigate to a buy page or open a modal later
    navigate('/buy');
  };

  const handleSell = () => {
    // Rudimentary: navigate to a sell page or open a modal later
    navigate('/sell');
  };

  const handlePortfolio = () => {
    navigate('/portfolio');
  };

  return (
    <div className="menu-page">
      <div className="menu-card">
        <h1 className="menu-title">Menú Principal</h1>
        {error && <div className="menu-error">{error}</div>}

        {user && (
          <div className="menu-body">
            <div className="user-block">
              <div>
                <p className="welcome">Bienvenido, <b>{user.email}</b></p>
              </div>
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
                <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} className="symbol-input" />
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

            {/* <div className="token-area">
              <p>Tu token (solo lectura):</p>
              <textarea value={token} readOnly className="token-textarea" />
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
