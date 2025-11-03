const { Repository } = require("./repository");
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "andina_contracts",
});

class MySQLContractsRepository extends Repository {
  async getAllContracts() {
    const [rows] = await pool.query("SELECT * FROM contracts");
    return rows;
  }

  async getContractsByInvestor(investorId) {
    const [rows] = await pool.query(
      "SELECT * FROM contracts WHERE investor_id = ?",
      [investorId]
    );
    return rows;
  }

  async addContract(contract) {
    const {
      investorId,
      brokerId,
      status,
      signedAt,
      effectiveFrom,
      effectiveTo,
    } = contract;

    const [result] = await pool.query(
      `INSERT INTO contracts (investor_id, broker_id, status, signed_at, effective_from, effective_to)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [investorId, brokerId, status, signedAt, effectiveFrom, effectiveTo]
    );

    return result.insertId;
  }

  async validateContract(investorId) {
    const [rows] = await pool.query(
      'SELECT * FROM contracts WHERE investor_id = ? AND status = "active"',
      [investorId]
    );
    return rows.length > 0;
  }

  async updateContract(id, fields) {
    const allowed = ["status", "effective_to", "terminated_at"];
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
      `UPDATE contracts SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async deleteContract(id) {
    const [result] = await pool.query("DELETE FROM contracts WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = { MySQLContractsRepository };
