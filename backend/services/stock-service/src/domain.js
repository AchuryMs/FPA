class StockDomain {
  constructor(yahooAdapter) {
    this.yahoo = yahooAdapter;
  }

  // Caso de uso: datos para la gráfica del MenuPage
  // Recibe: symbol, days
  async getMenuGraphData(symbol, days = 30) {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    const historical = await this.yahoo.getHistorical(symbol, from, to, '1d');
    // Transformar para el frontend: arrays de labels y datasets
    const labels = historical.map(h => h.date.toISOString().slice(0, 10));
    const data = historical.map(h => h.close);
    return { symbol, labels, data };
  }

  // Caso de uso: obtener las compañías más rentables en LATAM
  async getTopCompaniesLatam(countries = ['BR', 'MX', 'CL', 'AR', 'CO'], topN = 5) {
    const sampleSymbols = {
      BR: ['VALE', 'PETR4.SA', 'ITUB4.SA', 'BBDC4.SA'],
      MX: ['AMXL.MX', 'GFNORTEO.MX', 'BIMBOA.MX'],
      CL: ['SQM.BS', 'COPEC.SN'],
      AR: ['YPF.BA', 'GGAL.BA'],
      CO: ['ECOPETROL.MC', 'PFBCOLOM.MC']
    };

    const results = [];

    for (const country of countries) {
      const symbols = sampleSymbols[country] || [];
      const metrics = [];
      for (const s of symbols) {
        try {
          const quote = await this.yahoo.getQuote(s);
          const price = quote?.price?.regularMarketPrice || null;
          const change = quote?.price?.regularMarketChangePercent || null;
          metrics.push({ symbol: s, price, change });
        } catch (err) {
          // ignorar errores individuales para que otras compañías sigan
        }
      }
      // ordenar por cambio descendente y tomar topN
      metrics.sort((a, b) => (b.change || 0) - (a.change || 0));
      results.push({ country, top: metrics.slice(0, topN) });
    }

    return results;
  }
}

module.exports = { StockDomain };
