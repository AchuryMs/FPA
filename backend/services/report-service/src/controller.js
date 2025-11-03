const express = require("express");
const router = express.Router();
const { ReportService } = require("./domain");
const { MySQLReportRepository } = require("./mysql_infrastructure");

const service = new ReportService(new MySQLReportRepository());

// === Test ===
router.get("/test", (_req, res) => {
  res.json({ message: "Report service operativo." });
});

// === Reporte general de contratos ===
router.get("/contracts", async (_req, res) => {
  try {
    const data = await service.getContractsReport();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error en /contracts:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// === Reporte del portafolio de un inversionista ===
router.get("/portfolio/:investorId", async (req, res) => {
  try {
    const data = await service.getInvestorPortfolioReport(req.params.investorId);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error en /portfolio/:investorId:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// === Reporte de rendimiento general ===
router.get("/performance/:investorId", async (req, res) => {
  try {
    const data = await service.getPerformance(req.params.investorId);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error en /performance/:investorId:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// === Consolidado global del inversionista ===
router.get("/summary/:investorId", async (req, res) => {
  try {
    const data = await service.getInvestorSummary(req.params.investorId);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error en /summary/:investorId:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;