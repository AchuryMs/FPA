const express = require('express');
const router = express.Router();

const { YahooFinanceAdapter } = require('./yahoo_infrastructure');
const { StockDomain } = require('./domain');
const { MySQLOrdersRepository } = require('./mysql_infrastructure');

const yahoo = new YahooFinanceAdapter();
const ordersRepository = new MySQLOrdersRepository();
const domain = new StockDomain(yahoo, ordersRepository);


// ----- Pruebas del servicio -----
router.get('/test', (req, res) => {
  res.json({ message: 'Stock service funcionando (controller).' });
});


router.get("/menu/graph", async (req, res) => {
  try {
    const symbol = req.query.symbol || "AAPL";
    const days = parseInt(req.query.days, 10) || 30;
    const data = await domain.getMenuGraphData(symbol, days);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get("/latam/top-companies", async (req, res) => {
  try {
    const countries = req.query.countries
      ? req.query.countries.split(",").map((c) => c.trim().toUpperCase())
      : ["CO"];
    const result = await domain.getTopCompaniesLatam(countries);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.post('/graph', (req, res) => {
  const { symbol, days } = req.body;
    domain.getMenuGraphData(symbol, days);
  res.json({ success: true, message: 'Gráfico creado exitosamente.', data: { symbol, days } });
});


// ----- CRUD de órdenes -----
router.post("/order", async (req, res) => {
  try {
    const { investor, broker, ticker, side, qty, type } = req.body;
    const id = await domain.placeOrder(investor, broker, ticker, side, qty, type);
    res.json({ success: true, message: "Orden registrada.", id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get("/orders", async (_req, res) => {
  try {
    const data = await domain.getAllOrders();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/orders/:investorId", async (req, res) => {
  try {
    const { investorId } = req.params;
    const data = await domain.getOrdersByInvestor(investorId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ACTUALIZAR
router.put("/orders/:id", async (req, res) => {
  try {
    const ok = await domain.updateOrder(req.params.id, req.body);
    if (!ok) return res.status(404).json({ success: false, message: "No encontrada." });
    res.json({ success: true, message: "Orden actualizada." });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ELIMINAR
router.delete("/orders/:id", async (req, res) => {
  try {
    const ok = await domain.deleteOrder(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: "No encontrada." });
    res.json({ success: true, message: "Orden eliminada." });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;