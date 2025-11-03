const mysql = require("mysql2/promise");
const { PaymentRepository } = require("./repository");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "andina_payment",
});

class MySQLPaymentRepository extends PaymentRepository {
  async savePayment(payment) {
    const [res] = await pool.query(
      `INSERT INTO payments (investor_id, amount, currency, type, stripe_id, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        payment.investorId,
        payment.amount,
        payment.currency,
        payment.type,
        payment.stripeId,
        payment.status,
      ]
    );
    return res.insertId;
  }

  async getPaymentsByInvestor(investorId) {
    const [rows] = await pool.query(
      `SELECT * FROM payments WHERE investor_id = ? ORDER BY created_at DESC`,
      [investorId]
    );
    return rows;
  }
}

module.exports = { MySQLPaymentRepository };