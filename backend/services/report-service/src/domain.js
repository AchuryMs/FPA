const axios = require("axios");

class ReportService {
  constructor(repository) {
    this.repository = repository;
  }

  // === Contratos activos (Contract Service) ===
  async getContractsReport() {
    try {
      const res = await axios.get(`${process.env.CONTRACT_SERVICE_URL}/contracts`);
      return res.data?.data || [];
    } catch (err) {
      console.error("[ReportService] getContractsReport:", err.message);
      throw new Error("No se pudieron obtener los contratos.");
    }
  }

  // === Reporte de portafolio (Portfolio Service) ===
  async getInvestorPortfolioReport(investorId) {
    try {
      const res = await axios.get(`${process.env.PORTFOLIO_SERVICE_URL}/portfolio/${investorId}`);
      return res.data?.data || [];
    } catch (err) {
      console.error("[ReportService] getInvestorPortfolioReport:", err.message);
      throw new Error("No se pudo obtener el portafolio del inversionista.");
    }
  }

  // === Reporte de rendimiento (Portfolio + Stock) ===
  async getPerformance(investorId) {
    try {
      const [positionsRes, stocksRes] = await Promise.all([
        axios.get(`${process.env.PORTFOLIO_SERVICE_URL}/portfolio/${investorId}`),
        axios.get(`${process.env.STOCK_SERVICE_URL}/stocks`),
      ]);

      const positions = positionsRes.data?.data || [];
      const stocks = stocksRes.data?.data || [];

      // Calcular valor total
      let totalValue = 0;
      let details = [];

      for (const p of positions) {
        const stock = stocks.find((s) => s.ticker === p.ticker);
        const currentPrice = stock?.price || 0;
        const marketValue = p.qty * currentPrice;
        totalValue += marketValue;

        details.push({
          ticker: p.ticker,
          qty: p.qty,
          avgPrice: p.avg_price,
          currentPrice,
          marketValue,
          pnl: (currentPrice - p.avg_price) * p.qty,
        });
      }

      return { totalValue, details };
    } catch (err) {
      console.error("[ReportService] getPerformance:", err.message);
      throw new Error("Error generando reporte de rendimiento.");
    }
  }

  // === Consolidado general del inversionista ===
  async getInvestorSummary(investorId) {
    const start = Date.now();
    try {
      const [portfolio, contracts, payments] = await Promise.all([
        this.getInvestorPortfolioReport(investorId),
        this.getContractsReport(),
        axios.get(`${process.env.PAYMENT_SERVICE_URL}/payments/${investorId}`)
      ]);

      await this.repository.logReportEvent(investorId, "summary", "success", "Reporte generado correctamente");
      const totalTime = Date.now() - start;
      await this.repository.saveMetric("summary", totalTime, "/summary/:investorId");

      return {
        investorId,
        positions: portfolio.length,
        activeContracts: contracts.length,
        totalPayments: payments.data?.data?.length || 0
      };
    } catch (err) {
      await this.repository.logReportEvent(investorId, "summary", "error", err.message);
      throw new Error("No se pudo generar el resumen del inversionista.");
    }
  }

}

module.exports = { ReportService };