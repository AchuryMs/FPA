import React, { useEffect, useState } from "react";
import styles from "./TradeModal.module.css";
import { stockService } from "../../../../services/stockService";
import { portfolioService } from "../../../../services/portfolioService";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TradeModal({
  company,
  onClose,
  user,
  mode = "buy",
  onRefresh,
}) {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false); // 🟢 NUEVO: spinner de proceso
  const navigate = useNavigate();

  // === 1️⃣ Cargar datos del gráfico ===
  useEffect(() => {
    const loadGraph = async () => {
      try {
        const { ok, data } = await stockService.getGraph(company.symbol, 30);
        if (ok && data.success) {
          const labels = data.data.labels || [];
          const prices = data.data.data || [];
          const merged = labels.map((l, i) => ({ date: l, price: prices[i] }));
          setGraphData(merged);
        }
      } catch (err) {
        console.error("Error cargando gráfica:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGraph();
  }, [company]);

  // === 2️⃣ Crear y procesar orden ===
  const handleOrder = async () => {
    try {
      setProcessing(true);
      setMessage("Procesando orden...");

      const side = mode === "sell" ? "sell" : "buy";
      const price = company.currentPrice || company.price || 0;

      const orderData = {
        investorId: user?.id || "anon",
        ticker: company.symbol,
        qty,
        type: "market",
        side,
        requestedPrice: price,
      };

      // 🟩 Crear orden
      const res = await portfolioService.createOrder(orderData);
      if (!res.ok || !res.data.success) throw new Error(res.data.message);
      const orderId = res.data.id;

      // 🟨 Procesar orden
      const exec = await portfolioService.processOrder(orderId, {
        brokerId: 1,
        price,
      });

      if (!exec.ok || !exec.data.success) {
        console.warn("⚠️ Orden no procesada automáticamente.");
      }

      setMessage(
        side === "buy"
          ? "Compra ejecutada con éxito ✅"
          : "Venta ejecutada con éxito ✅"
      );

      // 🟢 Refrescar portafolio si corresponde
      if (onRefresh) {
        setMessage("Actualizando portafolio...");
        await onRefresh();
      }

      // Esperar antes de cerrar para mostrar mensaje visual
      setTimeout(() => {
        setProcessing(false);
        onClose();
        if (!onRefresh) navigate("/portfolio");
      }, 1200);
    } catch (err) {
      console.error("Error en la orden:", err);
      setMessage("❌ " + err.message);
      setProcessing(false);
    }
  };

  // === 3️⃣ Configuración del gráfico ===
  const last = graphData[graphData.length - 1]?.price;
  const first = graphData[0]?.price;
  const trendUp = last >= first;

  // === 4️⃣ Render ===
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2>
            {mode === "sell" ? "Vender" : "Comprar"} — {company.name}
          </h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <p className={styles.symbol}>Símbolo: {company.symbol}</p>

        {/* Gráfico */}
        <div className={styles.chartContainer}>
          {loading ? (
            <p>Cargando gráfico...</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={graphData}>
                <XAxis dataKey="date" hide />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={trendUp ? "#22c55e" : "#ef4444"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Controles */}
        <div className={styles.controls}>
          <input
            type="number"
            min="1"
            max={mode === "sell" ? company.qty || 9999 : undefined}
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 1)}
            className={styles.input}
            disabled={processing}
          />

          <div className={styles.buttons}>
            <button
              onClick={handleOrder}
              disabled={processing}
              className={`${styles.btn} ${
                mode === "sell" ? styles.sell : styles.buy
              }`}
            >
              {processing
                ? "Procesando..."
                : mode === "sell"
                ? "Confirmar Venta ↓"
                : "Confirmar Compra ↑"}
            </button>
          </div>
        </div>

        {/* Spinner de carga mientras procesa */}
        {processing && (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {/* Mensaje final */}
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}