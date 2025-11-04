import React, { useEffect, useState } from "react";
import styles from "./PortfolioPage.module.css";
import { HeaderDash } from "../dashboard/components/HeaderDash";
import { Sidebar } from "../dashboard/components/Sidebar";
import { portfolioService } from "../../services/portfolioService";
import { authService } from "../../services/authService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import TradeModal from "../dashboard/components/TradeModal/TradeModal.jsx";

const COLORS = ["#22c55e", "#3b82f6", "#facc15", "#ef4444", "#8b5cf6"];

export default function PortfolioPage() {
    const [user, setUser] = useState(null);
    const [portfolio, setPortfolio] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPosition, setSelectedPosition] = useState(null);
    // 🔹 Mover loadPortfolio fuera del useEffect
    const loadPortfolio = async () => {
        try {
            const { ok: okUser, data: userData } = await authService.getMe();
            if (okUser && userData.success) {
                setUser(userData.user);

                // Cargar portafolio
                const portRes = await portfolioService.getPortfolio(userData.user.id);
                if (portRes.ok && portRes.data.success) {
                    setPortfolio(portRes.data.data);
                }

                // Cargar órdenes
                const ordRes = await portfolioService.getOrders(userData.user.id);
                if (ordRes.ok && ordRes.data.success) {
                    setOrders(ordRes.data.data);
                }
            }
        } catch (err) {
            console.error("Error al cargar portafolio:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 useEffect solo la llama una vez al inicio
    useEffect(() => {
        loadPortfolio();
    }, []);


    const handleSell = async (pos) => {
        if (!user) return;

        const confirmSell = window.confirm(
            `¿Deseas vender ${pos.qty} acciones de ${pos.ticker}?`
        );
        if (!confirmSell) return;

        const sellOrder = {
            investor: user.id,
            broker: 1, // ajustar según tu sistema
            ticker: pos.ticker,
            side: "sell",
            qty: pos.qty,
            type: "market",
        };

        try {
            // Crear la orden
            const res = await portfolioService.createOrder(sellOrder);
            if (res.ok && res.data.success) {
                const orderId = res.data.id;

                // Procesar (aprobar + ejecutar)
                const exec = await portfolioService.processOrder(orderId, {
                    brokerId: 1,
                    price: pos.avg_price,
                });

                if (exec.ok && exec.data.success) {
                    alert("Orden de venta ejecutada con éxito ✅");
                    // refrescar portafolio
                    const updated = await portfolioService.getPortfolio(user.id);
                    if (updated.ok && updated.data.success) setPortfolio(updated.data.data);
                } else {
                    alert("Error al ejecutar la orden");
                }
            } else {
                alert("Error al crear la orden");
            }
        } catch (err) {
            console.error("Error al vender:", err);
        }
    };

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Cargando tu portafolio...</p>
            </div>
        );
    }

    return (
        <div className={styles.portfolioContainer}>
            <Sidebar />
            <div className={styles.mainContent}>
                <HeaderDash user={user} />

                <h2 className={styles.sectionTitle}>Mi Portafolio</h2>

                <div className={styles.summaryCards}>
                    <div className={styles.card}>
                        <h4>Activos Totales</h4>
                        <p>{portfolio.length}</p>
                    </div>
                    <div className={styles.card}>
                        <h4>Órdenes Ejecutadas</h4>
                        <p>{orders.length}</p>
                    </div>
                </div>

                {/* === Distribución de activos === */}
                <div className={styles.chartSection}>
                    <h3>Distribución de Inversiones</h3>
                    {portfolio.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={portfolio.map((p) => ({
                                        name: p.ticker,
                                        value: p.qty || p.amount || 1,
                                    }))}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={100}
                                    label
                                >
                                    {portfolio.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={styles.noData}>No tienes posiciones registradas aún.</p>
                    )}
                </div>

                {/* === Posiciones actuales === */}
                <div className={styles.positionsSection}>
                    <h3>Mis Posiciones</h3>
                    {portfolio.length > 0 ? (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Ticker</th>
                                    <th>Cantidad</th>
                                    <th>Precio Promedio</th>
                                    <th>Valor Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.map((pos, i) => (
                                    <tr key={i}
                                        onClick={() => setSelectedPosition(pos)}
                                        className={styles.positionRow}>
                                        <td>{pos.ticker}</td>
                                        <td>{pos.qty}</td>
                                        <td>
                                            ${Number(pos.avg_price || 0).toFixed(2)}
                                        </td>
                                        <td>
                                            ${Number(pos.qty || 0 * pos.avg_price || 0).toFixed(2)}
                                        </td>
                                    </tr>


                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className={styles.noData}>No tienes posiciones abiertas.</p>
                    )}
                </div>


                {/* === Órdenes recientes === */}
                <div className={styles.ordersSection}>
                    <h3>Órdenes Recientes</h3>
                    {orders.length > 0 ? (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Ticker</th>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o, i) => (
                                    <tr key={i}>
                                        <td>{o.ticker}</td>
                                        <td>{o.side?.toUpperCase()}</td>
                                        <td>{o.qty}</td>
                                        <td>
                                            {o.price || o.requested_price
                                                ? `$${Number(o.price || o.requested_price).toFixed(2)}`
                                                : "—"}
                                        </td>
                                        <td>
                                            <span
                                                className={`${styles.badge} ${o.status === "executed_auto"
                                                    ? styles.badgeAuto
                                                    : o.status === "executed"
                                                        ? styles.badgeExecuted
                                                        : o.status === "approved"
                                                            ? styles.badgeApproved
                                                            : o.status === "pending"
                                                                ? styles.badgePending
                                                                : styles.badgeDefault
                                                    }`}
                                            >
                                                {o.status === "executed_auto"
                                                    ? "Ejecutada Automáticamente"
                                                    : o.status === "executed"
                                                        ? "Ejecutada"
                                                        : o.status === "approved"
                                                            ? "Aprobada"
                                                            : o.status === "pending"
                                                                ? "Pendiente"
                                                                : o.status || "Desconocido"}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(o.date || o.created_at || Date.now()).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className={styles.noData}>No hay órdenes registradas.</p>
                    )}
                </div>
                {selectedPosition && (
                    <TradeModal
                        company={{
                            symbol: selectedPosition.ticker,
                            name: selectedPosition.ticker,
                            currentPrice: selectedPosition.avg_price,
                        }}
                        user={user}
                        onClose={() => setSelectedPosition(null)}
                        onRefresh={loadPortfolio}   // ✅ nueva prop
                        mode="sell"
                    />
                )}

            </div>
        </div>
    );
}