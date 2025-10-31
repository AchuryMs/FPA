import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./TradePage.css";

export default function BuyPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  
  // Estados para el trading
  const [symbol, setSymbol] = useState("AAPL");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loadingPrice, setLoadingPrice] = useState(false);
  
  // Estados del formulario
  const [youSell, setYouSell] = useState("1");
  const [youGet, setYouGet] = useState("0");
  const [balance, setBalance] = useState(78820.00);
  const [exchangeRate, setExchangeRate] = useState(30834.00);
  
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

  // Fetch precio actual y datos del gráfico
  useEffect(() => {
    if (!token) return;

    async function fetchStockData() {
      setLoadingPrice(true);
      try {
        // TODO: Reemplazar con tu endpoint real
        // const url = `http://localhost:3002/api/stock/price?symbol=${symbol}`;
        // const res = await fetch(url, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        // const data = await res.json();
        
        // MOCK DATA - Reemplazar con data real del API
        const mockPrice = 16430.00;
        const mockChange = 241.43;
        const mockChangePercent = 1.02;
        const mockChart = Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          price: mockPrice + (Math.random() - 0.5) * 1000
        }));
        
        setCurrentPrice(mockPrice);
        setPriceChange(mockChange);
        setPriceChangePercent(mockChangePercent);
        setChartData(mockChart);
        setExchangeRate(mockPrice);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      } finally {
        setLoadingPrice(false);
      }
    }

    fetchStockData();
  }, [symbol, token]);

  // Calcular conversión
  useEffect(() => {
    const sellAmount = parseFloat(youSell) || 0;
    const calculated = (sellAmount * exchangeRate).toFixed(2);
    setYouGet(calculated);
  }, [youSell, exchangeRate]);

 const handleExchange = async () => {
  if (!youSell || parseFloat(youSell) <= 0) {
    alert("Por favor ingresa una cantidad válida");
    return;
  }

  try {
    const orderData = {
      investor: user?.id || user?.email || "INV001", // ajusta según payload de tu token
      broker: "BROKER001", // puedes cambiarlo si tienes un broker real
      ticker: symbol,      // símbolo actual mostrado en pantalla
      side: "buy",         // compra
      qty: parseFloat(youSell),
      type: "market"
    };

    const res = await fetch("http://localhost:3002/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (data.success) {
      alert(`✅ ${data.message}\nHas comprado ${youSell} ${symbol} por $${youGet}`);
      navigate("/menu");
    } else {
      alert(`❌ Error: ${data.message}`);
    }

  } catch (err) {
    console.error("Error en la compra:", err);
    alert("⚠️ Error al realizar la compra. Intenta nuevamente.");
  }
};


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
        
        <div className="dashboard-content">
          <div className="trade-container">
            {/* Sección del gráfico */}
            <div className="chart-section">
              <div className="stock-header">
                <div className="stock-info">
                  <h1 className="stock-symbol">{symbol}/USD</h1>
                  <div className="stock-price">
                    <span className="price-value">${currentPrice.toLocaleString()}</span>
                    <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                      ▲ ${Math.abs(priceChange).toFixed(2)} (+{priceChangePercent}%)
                    </span>
                  </div>
                </div>
                <div className="chart-controls-top">
                  <button className="chart-type-btn active">📈 Line chart</button>
                  <div className="time-filters">
                    <button className="time-btn">D</button>
                    <button className="time-btn">W</button>
                    <button className="time-btn">M</button>
                    <button className="time-btn active">Y</button>
                  </div>
                </div>
              </div>

              <div className="chart-area-trade">
                {loadingPrice ? (
                  <div className="chart-loading">Cargando...</div>
                ) : (
                  <svg className="price-chart" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    
                    {chartData.length > 0 && (() => {
                      const maxPrice = Math.max(...chartData.map(d => d.price));
                      const minPrice = Math.min(...chartData.map(d => d.price));
                      const priceRange = maxPrice - minPrice || 1;
                      
                      const points = chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 760 + 20;
                        const y = 280 - ((d.price - minPrice) / priceRange * 240) - 20;
                        return `${x},${y}`;
                      }).join(' ');
                      
                      return (
                        <>
                          <path d={`M ${points} L 780,280 L 20,280 Z`} fill="url(#chartGradient)" />
                          <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" />
                          {chartData.map((d, i) => {
                            if (i === Math.floor(chartData.length / 2)) {
                              const x = (i / (chartData.length - 1)) * 760 + 20;
                              const y = 280 - ((d.price - minPrice) / priceRange * 240) - 20;
                              return (
                                <g key={i}>
                                  <circle cx={x} cy={y} r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2"/>
                                  <rect x={x - 50} y={y - 50} width="100" height="40" rx="8" fill="#1e293b"/>
                                  <text x={x} y={y - 35} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
                                    ${d.price.toFixed(2)}
                                  </text>
                                  <text x={x} y={y - 20} textAnchor="middle" fill="#10b981" fontSize="10">
                                    +$40.2
                                  </text>
                                </g>
                              );
                            }
                            return null;
                          })}
                        </>
                      );
                    })()}
                  </svg>
                )}
                
                <div className="chart-timeline">
                  <span>10 AM</span>
                  <span>1 PM</span>
                  <span>4 PM</span>
                  <span>7 PM</span>
                  <span>10 PM</span>
                  <span>1 AM</span>
                  <span>4 AM</span>
                  <span>7 AM</span>
                  <span>10 AM</span>
                </div>
              </div>
            </div>

            {/* Sección de trading */}
            <div className="trade-section">
              <div className="balance-card">
                <h3>Total balance</h3>
                <div className="balance-amount">
                  ${balance.toLocaleString()}
                  <span className="balance-change positive">▲ $931.12</span>
                </div>
              </div>

              <div className="exchange-card">
                <h3>Exchange</h3>
                <p className="exchange-rate">1 {symbol} = ${exchangeRate.toLocaleString()}</p>

                <div className="exchange-form">
                  <div className="input-group">
                    <label>You sell</label>
                    <div className="input-with-select">
                      <input
                        type="number"
                        value={youSell}
                        onChange={(e) => setYouSell(e.target.value)}
                        className="amount-input"
                      />
                      <div className="currency-select">
                        <span className="currency-icon">🪙</span>
                        <span className="currency-code">{symbol}</span>
                      </div>
                    </div>
                  </div>

                  <div className="exchange-icon">⇅</div>

                  <div className="input-group">
                    <label>You get</label>
                    <div className="input-with-select">
                      <input
                        type="text"
                        value={youGet}
                        readOnly
                        className="amount-input"
                      />
                      <div className="currency-select">
                        <span className="currency-icon">💵</span>
                        <span className="currency-code">USDT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="exchange-btn" onClick={handleExchange}>
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}