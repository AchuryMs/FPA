
const { Repository  } = require('./repository');

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345678',
  database: 'andina_contracts'
});

class MySQLContractsRepository extends Repository {

    async getContracts(id) {
        const [rows] = await pool.query('SELECT * FROM contracts WHERE id = ?', [id]);
        return rows || [];
    }

    async validateContract (investor) {
        const [rows] = await pool.query('SELECT * FROM contracts WHERE investor_id = ? AND status = "active"', [investor]);
        if (rows.length > 0) {
            return true;
        }
        return false;
    }

}

module.exports = { MySQLContractsRepository };
