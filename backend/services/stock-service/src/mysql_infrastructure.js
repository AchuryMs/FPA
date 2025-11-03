
const { OrdersRepository } = require('./repository');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'andina_orders',
});

class MySQLOrdersRepository extends OrdersRepository {

  async addOrder(investor, broker, ticker, side, qty, type, date) {
    const [result] = await pool.query(
      `INSERT INTO orders (investor_id, broker_id, ticker, side, qty, type, order_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [investor, broker, ticker, side, qty, type, date]
    );
    return result.insertId;
  }

  async getOrdersByInvestor(investorId) {
    const [rows] = await pool.query(
      `SELECT * FROM orders WHERE investor_id = ? ORDER BY order_date DESC`,
      [investorId]
    );
    return rows;
  }

    async getAllOrders() {
    const [rows] = await pool.query(
      `SELECT * FROM orders ORDER BY order_date DESC`
    );
    return rows;
  }

  async updateOrder(id, fields) {
    const allowed = ["qty", "type", "side", "ticker"];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
      if (allowed.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error("No hay campos válidos para actualizar.");
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE orders SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async deleteOrder(id) {
    const [result] = await pool.query(`DELETE FROM orders WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }

  async findRole(email) {
    const [rows] = await pool.query('SELECT user_type FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  async validateContract(email, password) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    return rows[0] || null;
  }


}

module.exports = { MySQLOrdersRepository };
