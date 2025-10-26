
const { OrdersRepository  } = require('./repository');

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345678',
  database: 'andina_orders'
});

class MySQLOrdersRepository extends OrdersRepository {

  async addOrder(investor, broker, ticker, side, qty, type, date) {
    const [rows] = await pool.query('INSERT INTO orders (investor_id, broker_id, ticker, side, qty, type, order_date) VALUES (?, ?, ?, ?, ?, ?, ?)', [investor, broker, ticker, side, qty, type, date]);
    return rows[0] || null;
  }

  async findRole(email) {
    const [rows] = await pool.query('SELECT user_type FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }
}

module.exports = { MySQLOrdersRepository };
