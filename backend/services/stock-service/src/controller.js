const express = require('express');
const router = express.Router();

const { YahooFinanceAdapter } = require('./yahoo_infrastructure');
const { StockDomain } = require('./domain');
const { MySQLOrdersRepository } = require('./mysql_infrastructure');

const yahoo = new YahooFinanceAdapter();
const ordersRepository = new MySQLOrdersRepository();

const domain = new StockDomain(yahoo, ordersRepository);

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

    if (!countriesQuery) {
      return res.status(400).json({
        success: false,
        message: "Debe especificar uno o más países en el parámetro 'countries' separados por coma"
      });
    }

    const countries = countriesQuery.split(',').map(c => c.trim());
    const topN = null; 
    const result = await domain.getTopCompaniesLatam(countries, topN);

    res.json({ success: true, data: result });

  } catch (err) {
    console.error("Error en /latam/top-companies:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


router.post('/graph', (req, res) => {
  const { symbol, days } = req.body;
    domain.getMenuGraphData(symbol, days);
  res.json({ success: true, message: 'Gráfico creado exitosamente.', data: { symbol, days } });
});


router.post('/order', async (req, res) => {
  try {
    const { investor, broker, ticker, side, qty, type } = req.body;
    await domain.placeOrder(investor, broker, ticker, side, qty, type);
    res.json({ success: true, message: 'Orden colocada exitosamente.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/orders/:investorId', async (req, res) => {
  try {
    const { investorId } = req.params;
    const orders = await domain.getOrdersByInvestor(investorId);
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("Error en /orders/:investorId:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});



module.exports = router;
