import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [topCompanies, setTopCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Verificar autenticación
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (!savedToken) {
      setError("No tienes sesión activa. Inicia sesión primero.");
      return;
    }
    setToken(savedToken);
    try {
      const payload = JSON.parse(atob(savedToken.split(".")[1]));
      setUser(payload);
    } catch {
      setError("Token inválido");
    }
  }, []);

  // Fetch empresas LATAM
  useEffect(() => {
    if (!token) return;

    async function fetchCompanies() {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:3002/latam/top-companies?countries=CO,BR,MX,AR"
        );
        const json = await res.json();
        if (json.success) {
          setTopCompanies(json.data);
        } else {
          setTopCompanies([]);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, [token]);

  // Función para mostrar notificación temporal
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Función para enviar compra
  const handleBuy = async (ticker, qty, type) => {
    try {
      const res = await fetch("http://localhost:3002/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          investor: user?.id || "INV001",
          broker: "BROKER01",
          ticker,
          side: "buy",
          qty: parseInt(qty, 10),
          type,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`✅ Compra de ${qty} ${ticker} realizada con éxito`);
      } else {
        showNotification(`❌ Error: ${data.message}`, "error");
      }
    } catch (err) {
      console.error("Error al enviar orden:", err);
      showNotification("⚠️ Error al conectar con el servidor", "error");
    }
  };

  if (error) {
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
          <div className="section-header">
            <h2 className="section-title">Mercado LATAM</h2>
            <p className="section-subtitle">
              Acciones más rentables por país — fuente: Yahoo Finance
            </p>
          </div>

          {loading && <div className="spinner">Cargando...</div>}

          {/* Notificación flotante */}
          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}

          {!loading && (
            <div className="country-section">
              {topCompanies.map((country) => (
                <div key={country.country} className="country-block">
                  <h3 className="country-title">
                    🇨🇴 País: {country.country}
                  </h3>
                  <div className="company-grid">
                    {country.companies.map((company) => (
                      <CompanyCard
                        key={company.symbol}
                        company={company}
                        onBuy={handleBuy}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="orders-section">
            <h3>Tus órdenes recientes</h3>
            <OrdersTable investorId={user?.id || "INV001"} />
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Componente de tarjeta ---
function CompanyCard({ company, onBuy }) {
  const [showForm, setShowForm] = useState(false);
  const [qty, setQty] = useState(1);
  const [type, setType] = useState("market");

  const toggleForm = () => setShowForm(!showForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onBuy(company.symbol, qty, type);
    setShowForm(false);
  };

  return (
    <div className="company-card">
      <div className="card-header" onClick={toggleForm}>
        <h4>{company.name}</h4>
        <p className="symbol">{company.symbol}</p>
        <p className="price">${company.price?.toFixed(2) || "—"}</p>
        <p className={`change ${company.change >= 0 ? "positive" : "negative"}`}>
          {company.change >= 0 ? "▲" : "▼"} {company.change?.toFixed(2)}%
        </p>
      </div>

      {showForm && (
        <form className="buy-form" onSubmit={handleSubmit}>
          <label>
            Cantidad:
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </label>

          <label>
            Tipo de orden:
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="market">Market</option>
              <option value="limit">Limit</option>
            </select>
          </label>

          <button type="submit" className="buy-button">
            Comprar
          </button>
        </form>
      )}
    </div>
  );
}


function OrdersTable({ investorId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`http://localhost:3002/orders/${investorId}`);
        const json = await res.json();
        if (json.success) setOrders(json.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [investorId]);

  if (loading) return <p>Cargando órdenes...</p>;
  if (orders.length === 0) return <p>No tienes órdenes registradas.</p>;

  return (
    <table className="orders-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Ticker</th>
          <th>Cantidad</th>
          <th>Tipo</th>
          <th>Operación</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>{new Date(o.order_date).toLocaleString()}</td>
            <td>{o.ticker}</td>
            <td>{o.qty}</td>
            <td>{o.type}</td>
            <td className={o.side === "buy" ? "positive" : "negative"}>
              {o.side.toUpperCase()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
