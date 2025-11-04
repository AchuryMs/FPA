const yahooFinance = require("yahoo-finance2").default;

class YahooFinanceAdapter {
  constructor() {
    // === Configuración de símbolos por país ===
    this.symbolsByCountry = {
      // Región Andina
      CO: ["EC", "AVAL", "PFBCOLOM", "NUTRESA"],
      PE: ["BAP", "CVERDEC1.LM", "FERREYC1.LM", "SIDERC1.LM"],
      EC: ["PETROEC.OL", "ECOPETRO.OL"], // placeholders
      VE: ["EDCVE.OL", "BNCVE.OL"], // placeholders

      // === Ampliación LATAM ===
      MX: ["GFNORTEO.MX", "BIMBOA.MX", "WALMEX.MX", "AMXL.MX"],
      BR: ["VALE", "PETR4.SA", "ITUB4.SA", "BBDC4.SA"],
      AR: ["GGAL.BA", "MELI", "BMA", "ALUA.BA"],
      CL: ["FALABELLA.SN", "SQMBCO.CL", "BSANTANDER.SN"],

      // === Mercados internacionales ===
      US: ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META"],
      EU: ["AIR.PA", "DTE.DE", "SAN.PA", "NESN.SW"],
      ASIA: ["7203.T", "005930.KS", "9984.T", "BABA"],
    };
  }

  // === Series históricas ===
  async getHistorical(symbol, from, to, interval = "1d") {
    try {
      const query = { period1: from, period2: to, interval };
      const result = await yahooFinance.historical(symbol, query);
      return (result || []).map((r) => ({
        date: r.date,
        open: r.open,
        high: r.high,
        low: r.low,
        close: r.close,
        volume: r.volume,
      }));
    } catch (err) {
      console.error(`[YahooFinance] Error getHistorical(${symbol}): ${err.message}`);
      return [];
    }
  }

  // === Datos actuales del símbolo ===
  async getQuote(symbol) {
    try {
      const quote = await yahooFinance.quoteSummary(symbol, {
        modules: ["price", "summaryDetail"],
      });

      if (!quote?.price?.regularMarketPrice) {
        console.warn(`[YahooFinance] Sin datos válidos para ${symbol}`);
        return null;
      }

      return {
        symbol,
        name:
          quote.price.shortName ||
          quote.price.longName ||
          symbol,
        price: quote.price.regularMarketPrice ?? null,
        change: quote.price.regularMarketChangePercent ?? null,
        currency: quote.price.currency || "USD",
        market: quote.price.exchangeName || "Global",
      };
    } catch (err) {
      console.error(`[YahooFinance] Error getQuote(${symbol}): ${err.message}`);
      return null;
    }
  }

  getSymbolsByCountry(country) {
    return this.symbolsByCountry[country] || [];
  }
}

module.exports = { YahooFinanceAdapter };