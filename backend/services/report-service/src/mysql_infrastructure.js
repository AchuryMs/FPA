const mysql = require("mysql2/promise");
const { ReportRepository } = require("./repository");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "andina_report",
});

class MySQLReportRepository extends ReportRepository {
  // === Registrar evento de generación ===
  async logReportEvent(investorId, reportType, status = "success", message = null, generatedBy = "system") {
    await pool.query(
      `INSERT INTO report_logs (investor_id, report_type, status, message, generated_by)
       VALUES (?, ?, ?, ?, ?)`,
      [investorId, reportType, status, message, generatedBy]
    );
  }

  // === Registrar métricas ===
  async saveMetric(reportType, totalTimeMs, endpoint) {
    await pool.query(
      `INSERT INTO report_metrics (report_type, total_time_ms, endpoint)
       VALUES (?, ?, ?)`,
      [reportType, totalTimeMs, endpoint]
    );
  }

  // === Consultar métricas o logs ===
  async getLogs(limit = 20) {
    const [rows] = await pool.query(
      `SELECT * FROM report_logs ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
    return rows;
  }

  async getMetrics(limit = 20) {
    const [rows] = await pool.query(
      `SELECT * FROM report_metrics ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
    return rows;
  }
}

module.exports = { MySQLReportRepository };