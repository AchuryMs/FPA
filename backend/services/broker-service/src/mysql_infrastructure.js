const mysql = require("mysql2/promise");
const { BrokerRepository } = require("./repository");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "andina_brokers",
});

class MySQLBrokerRepository extends BrokerRepository {
  async getAllBrokers() {
    const [rows] = await pool.query("SELECT * FROM brokers");
    return rows;
  }

  async getBrokerById(id) {
    const [rows] = await pool.query("SELECT * FROM brokers WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async addBroker(broker) {
    const { userId, name, licenseNumber, email, phone, status } = broker;
    const [result] = await pool.query(
      `INSERT INTO brokers (user_id, name, license_number, email, phone, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name, licenseNumber, email, phone, status || "active"]
    );
    return result.insertId;
  }

  async updateBroker(id, fields) {
    const allowed = ["name", "email", "phone", "status"];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
      if (allowed.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) throw new Error("No hay campos válidos para actualizar.");

    values.push(id);
    const [result] = await pool.query(
      `UPDATE brokers SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async deleteBroker(id) {
    const [result] = await pool.query("DELETE FROM brokers WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  async getOrdersByBroker(brokerId) {
    const [rows] = await pool.query(
      "SELECT * FROM broker_orders WHERE broker_id = ? ORDER BY executed_at DESC",
      [brokerId]
    );
    return rows;
  }

  async addBrokerOrder(order) {
    const { brokerId, investorId, stockTicker, side, qty, executedPrice, executedAt } =
      order;
    const [result] = await pool.query(
      `INSERT INTO broker_orders (broker_id, investor_id, stock_ticker, side, qty, executed_price, executed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [brokerId, investorId, stockTicker, side, qty, executedPrice, executedAt]
    );
    return result.insertId;
  }
}

module.exports = { MySQLBrokerRepository };