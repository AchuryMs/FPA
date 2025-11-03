const express = require("express");
const router = express.Router();
const { BrokerService } = require("./domain");
const { MySQLBrokerRepository } = require("./mysql_infrastructure");

const service = new BrokerService(new MySQLBrokerRepository());

// ----- Prueba -----
router.get("/test", (_req, res) => {
  res.json({ message: "Broker service operativo." });
});

// ----- CRUD Brokers -----
router.get("/brokers", async (_req, res) => {
  try {
    const data = await service.getAllBrokers();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/brokers", async (req, res) => {
  try {
    const id = await service.createBroker(req.body);
    res.json({ success: true, message: "Broker registrado correctamente", id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/brokers/:id", async (req, res) => {
  try {
    const ok = await service.updateBroker(req.params.id, req.body);
    if (!ok) return res.status(404).json({ success: false, message: "No encontrado" });
    res.json({ success: true, message: "Broker actualizado." });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/brokers/:id", async (req, res) => {
  try {
    const ok = await service.deleteBroker(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: "No encontrado" });
    res.json({ success: true, message: "Broker eliminado." });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ----- Órdenes del broker -----
router.get("/brokers/:id/orders", async (req, res) => {
  try {
    const data = await service.getOrdersByBroker(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/brokers/:id/orders", async (req, res) => {
  try {
    const order = { ...req.body, brokerId: req.params.id };
    const id = await service.addBrokerOrder(order);
    res.json({ success: true, message: "Orden registrada.", id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;