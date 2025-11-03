const mysql = require("mysql2/promise");
const { PortfolioRepository } = require("./repository");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "andina_portfolio",
});

class MySQLPortfolioRepository extends PortfolioRepository {
  async createOrder(order) {
    const [result] = await pool.query(
      `INSERT INTO portfolio_orders (investor_id, ticker, qty, type, side, requested_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [order.investorId, order.ticker, order.qty, order.type, order.side, order.requestedPrice, order.status]
    );
    return result.insertId;
  }

  async updateOrderStatus(id, status, brokerId = null) {
    await pool.query(
      `UPDATE portfolio_orders SET status = ?, broker_id = ?, updated_at = NOW() WHERE id = ?`,
      [status, brokerId, id]
    );
  }

  async getOrderById(id) {
    const [rows] = await pool.query(`SELECT * FROM portfolio_orders WHERE id = ?`, [id]);
    return rows;
  }

  async getOrdersByInvestor(investorId) {
    const [rows] = await pool.query(
      `SELECT * FROM portfolio_orders WHERE investor_id = ? ORDER BY created_at DESC`,
      [investorId]
    );
    return rows;
  }

  // === Posiciones ===
  async upsertPosition(investorId, ticker, qty, price, side) {
    const [rows] = await pool.query(
      `SELECT * FROM positions WHERE investor_id = ? AND ticker = ?`,
      [investorId, ticker]
    );

    if (side === "buy") {
      if (rows.length > 0) {
        const existing = rows[0];
        const newQty = existing.qty + qty;
        const newAvg = (existing.avg_price * existing.qty + price * qty) / newQty;
        await pool.query(
          `UPDATE positions SET qty = ?, avg_price = ?, last_updated = NOW()
           WHERE investor_id = ? AND ticker = ?`,
          [newQty, newAvg, investorId, ticker]
        );
      } else {
        await pool.query(
          `INSERT INTO positions (investor_id, ticker, qty, avg_price)
           VALUES (?, ?, ?, ?)`,
          [investorId, ticker, qty, price]
        );
      }
    } else if (side === "sell") {
      if (rows.length === 0) throw new Error("No hay posición para vender.");
      const existing = rows[0];
      const newQty = existing.qty - qty;
      if (newQty <= 0) {
        await pool.query(
          `DELETE FROM positions WHERE investor_id = ? AND ticker = ?`,
          [investorId, ticker]
        );
      } else {
        await pool.query(
          `UPDATE positions SET qty = ?, last_updated = NOW()
           WHERE investor_id = ? AND ticker = ?`,
          [newQty, investorId, ticker]
        );
      }
    }
  }

  async getPositionsByInvestor(investorId) {
    const [rows] = await pool.query(
      `SELECT * FROM positions WHERE investor_id = ? ORDER BY ticker ASC`,
      [investorId]
    );
    return rows;
  }

  async logAudit(orderId, event, eventBy, notes) {
    await pool.query(
      `INSERT INTO order_audit (order_id, event, event_by, notes) VALUES (?, ?, ?, ?)`,
      [orderId, event, eventBy, notes]
    );
  }
}

module.exports = { MySQLPortfolioRepository };