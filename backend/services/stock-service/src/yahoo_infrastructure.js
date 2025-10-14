const yahooFinance = require('yahoo-finance2').default;

class YahooFinanceAdapter {
  constructor() {}

  // Obtiene series históricas para un símbolo entre fechas
  async getHistorical(symbol, from, to, interval = '1d') {
    try {
      const query = { period1: from, period2: to, interval };
      const result = await yahooFinance.historical(symbol, query);
      // Normalizar datos: [{ date, close, open, high, low, volume }]
      return (result || []).map(r => ({
        date: r.date,
        open: r.open,
        high: r.high,
        low: r.low,
        close: r.close,
        volume: r.volume
      }));
    } catch (err) {
      throw new Error(`YahooFinance getHistorical error: ${err.message}`);
    }
  }

  // Obtener quote y métricas básicas
  async getQuote(symbol) {
    try {
      const quote = await yahooFinance.quoteSummary(symbol, { modules: ['price', 'summaryDetail'] });
      return quote;
    } catch (err) {
      throw new Error(`YahooFinance getQuote error: ${err.message}`);
    }
  }
}


module.exports = { YahooFinanceAdapter };
