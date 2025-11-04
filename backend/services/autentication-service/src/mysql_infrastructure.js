
const { UserRepository } = require('./repository');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'andina_auth'
});

class MySQLUserRepository extends UserRepository {

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, email, full_name, user_type, status, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT id , email, password_hash AS password FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  async findRole(email) {
    const [rows] = await pool.query('SELECT user_type FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  async register({ email, passwordHash }) {
    if (!email || !passwordHash) {
      throw new Error('Faltan datos obligatorios para el registro');
    }
    const fecha_registro = new Date();
    fecha_registro.setDate(fecha_registro.getDate());


    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?)',
      [email, passwordHash, fecha_registro, fecha_registro]
    );
    return result.insertId;
  }

  async logAttempt(email, fecha, exito) {

    await pool.query(
      'INSERT INTO auth_login_attempt (username_submitted, success, created_at) VALUES (?, ?, ?)',
      [email, exito, fecha]
    );
  }
}

module.exports = { MySQLUserRepository };
