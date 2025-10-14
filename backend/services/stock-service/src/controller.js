const express = require('express');
const router = express.Router();
const { YahooFinanceAdapter } = require('./yahoo_infrastructure');
const { StockDomain } = require('./domain');

const yahoo = new YahooFinanceAdapter();
const domain = new StockDomain(yahoo);

router.get('/test', (req, res) => {
  res.json({ message: 'Stock service funcionando (controller).' });
});


router.get('/menu/graph', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'AAPL';
    const days = parseInt(req.query.days, 10) || 30;
    const result = await domain.getMenuGraphData(symbol, days);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


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

router.post('/graph', (req, res) => {
  const { symbol, days } = req.body;
    domain.getMenuGraphData(symbol, days);
  res.json({ success: true, message: 'Gráfico creado exitosamente.', data: { symbol, days } });
});

module.exports = router;
