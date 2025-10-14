const express = require('express');
const router = express.Router();
const { YahooFinanceAdapter } = require('./yahoo_infrastructure');
const { StockDomain } = require('./domain');

const yahoo = new YahooFinanceAdapter();
const domain = new StockDomain(yahoo);

// Endpoint de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Stock service funcionando (controller).' });
});

// Endpoint: datos para la gráfica del MenuPage
// Query: symbol (ej: AAPL), days (opcional)
router.get('/menu/graph', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'APPL';
    const days = parseInt(req.query.days, 10) || 30;
    const result = await domain.getMenuGraphData(symbol, days);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Endpoint: compañías más rentables en LATAM
// Optional: countries=BR,MX
router.get('/latam/top-companies', async (req, res) => {
  try {
    const countriesQuery = req.query.countries;
    const countries = countriesQuery ? countriesQuery.split(',') : undefined;
    const topN = parseInt(req.query.topN, 10) || 5;
    const result = await domain.getTopCompaniesLatam(countries, topN);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
