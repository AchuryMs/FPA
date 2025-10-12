
const { UserRepository } = require('./repository');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345678',
  database: 'andina_auth'
});

class MySQLUserRepository extends UserRepository {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT email, password_hash FROM users WHERE email = ?', [email]);
    return rows[0];
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
      'INSERT INTO attempt (email, fecha, exito) VALUES (?, ?, ?)',
      [email, fecha, exito]
    );
  }
}

module.exports = { MySQLUserRepository };
