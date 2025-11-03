class ReportRepository {
  async logReportEvent(investorId, reportType, status, message, generatedBy) {
    throw new Error("Método no implementado");
  }

  async saveMetric(reportType, totalTimeMs, endpoint) {
    throw new Error("Método no implementado");
  }

  async getLogs(limit) {
    throw new Error("Método no implementado");
  }

  async getMetrics(limit) {
    throw new Error("Método no implementado");
  }
}

module.exports = { ReportRepository };