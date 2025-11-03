const express = require("express");
const router = express.Router();
const { PaymentService } = require("./domain");
const { MySQLPaymentRepository } = require("./mysql_infrastructure");

const service = new PaymentService(new MySQLPaymentRepository());

// === Test ===
router.get("/test", (_req, res) => {
  res.json({ message: "Payment service operativo." });
});

// === Simular pago con Stripe ===
router.post("/simulate", async (req, res) => {
  try {
    const { investorId, amount, currency, type } = req.body;
    const result = await service.simulatePayment(investorId, amount, currency, type);
    res.json({ success: true, message: "Pago simulado con éxito", data: result });
  } catch (err) {
    console.error("Error en /simulate:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// === Consultar pagos por inversionista ===
router.get("/payments/:investorId", async (req, res) => {
  try {
    const data = await service.getPaymentsByInvestor(req.params.investorId);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error en /payments/:investorId:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;