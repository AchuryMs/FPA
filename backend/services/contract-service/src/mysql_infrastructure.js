const mysql = require("mysql2/promise");
const { Repository } = require("./repository");

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "andina_contracts",
});

class MySQLContractsRepository extends Repository {
  async getContracts(investorId) {
    const [rows] = await pool.query(
      "SELECT * FROM contracts WHERE investor_id = ?",
      [investorId]
    );
    return rows || [];
  }

  async createContract(investorId, brokerId, status, effectiveFrom, effectiveTo) {
    const [result] = await pool.query(
      `INSERT INTO contracts 
       (investor_id, broker_id, status, signed_at, effective_from, effective_to) 
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [investorId, brokerId, status || "active", effectiveFrom, effectiveTo]
    );
    return result.insertId;
  }

  async updateContract(id, data) {
    const fields = Object.keys(data)
      .map((k) => `${k} = ?`)
      .join(", ");
    const values = Object.values(data);
    const [result] = await pool.query(
      `UPDATE contracts SET ${fields} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  async deleteContract(id) {
    const [result] = await pool.query("DELETE FROM contracts WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  async validateContract(investor, broker) {
    const [rows] = await pool.query(
      `SELECT * FROM contracts 
       WHERE investor_id = ? AND broker_id = ? 
       AND status = 'active'`,
      [investor, broker]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = { MySQLContractsRepository, pool };