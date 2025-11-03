const express = require("express");
const router = express.Router();
const { PortfolioService } = require("./domain");
const { MySQLPortfolioRepository } = require("./mysql_infrastructure");

const service = new PortfolioService(new MySQLPortfolioRepository());

router.get("/test", (_req, res) => {
  res.json({ message: "Portfolio service operativo." });
});

// Crear orden
router.post("/orders", async (req, res) => {
  try {
    const id = await service.createOrder(req.body);
    res.json({ success: true, message: "Orden creada correctamente", id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Aprobación
router.put("/orders/:id/approve", async (req, res) => {
  try {
    await service.approveOrder(req.params.id, req.body.brokerId);
    res.json({ success: true, message: "Orden aprobada." });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Ejecución
router.put("/orders/:id/execute", async (req, res) => {
  try {
    const { price, eventBy } = req.body;
    await service.executeOrder(req.params.id, price, eventBy);
    res.json({ success: true, message: "Orden ejecutada." });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Listar órdenes
router.get("/orders/:investorId", async (req, res) => {
  try {
    const data = await service.getOrdersByInvestor(req.params.investorId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Portafolio
router.get("/portfolio/:investorId", async (req, res) => {
  try {
    const data = await service.getPositionsByInvestor(req.params.investorId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// === Flujo completo: aprobar y ejecutar ===
router.post("/orders/:id/process", async (req, res) => {
  try {
    const { brokerId, price } = req.body;

    // 1. Aprueba la orden
    await service.approveOrder(req.params.id, brokerId);

    // 2. Ejecuta la orden
    await service.executeOrder(req.params.id, price, brokerId);

    res.json({ success: true, message: "Orden aprobada y ejecutada con éxito." });
  } catch (err) {
    console.error("Error en /orders/:id/process:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;