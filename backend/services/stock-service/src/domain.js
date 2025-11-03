class StockDomain {
  constructor(yahooAdapter, repository) {
    this.yahoo = yahooAdapter;
    this.repository = repository;
  }

  // Caso de uso: datos para la gráfica del MenuPage
  // Recibe: symbol, days
  async getMenuGraphData(symbol, days = 30) {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    const historical = await this.yahoo.getHistorical(symbol, from, to, "1d");
    const labels = historical.map((h) => h.date.toISOString().slice(0, 10));
    const data = historical.map((h) => h.close);
    return { symbol, labels, data };
  }

  // Caso de uso: obtener las compañías más rentables en LATAM

  async getTopCompaniesLatam(countries = ["BR", "MX", "CL", "AR", "CO"], topN = 5) {
    const sampleSymbols = {
      BR: ["VALE", "PETR4.SA", "ITUB4.SA", "BBDC4.SA"],
      MX: ["GFNORTEO.MX", "BIMBOA.MX", "AMXL.MX", "AMX"],
      CL: ["SQMBCO.CL", "FALABELLA.SN", "BSANTANDER.SN"],
      AR: ["GGAL.BA", "MELI", "BMA", "ALUA.BA"],
      CO: ["EC", "NUTRESA", "AVAL", "PFBCOLOM"],
    };

    const results = [];
    for (const country of countries) {
      const symbols = sampleSymbols[country] || [];
      if (symbols.length === 0) {
        results.push({ country, companies: [] });
        continue;
      }

      const settled = await Promise.allSettled(
        symbols.map((sym) => this.yahoo.getQuote(sym))
      );

      const metrics = settled
        .map((r, idx) =>
          r.status === "fulfilled"
            ? {
              symbol: symbols[idx],
              name:
                r.value?.price?.shortName ||
                r.value?.price?.longName ||
                symbols[idx],
              price: r.value?.price?.regularMarketPrice ?? null,
              change: r.value?.price?.regularMarketChangePercent ?? null,
            }
            : null
        )
        .filter(Boolean)
        .sort((a, b) => (b.change ?? -Infinity) - (a.change ?? -Infinity));

      results.push({
        country,
        companies: topN ? metrics.slice(0, topN) : metrics,
      });
    }

    return results;
  }

  async placeOrder(investor, broker, ticker, side, qty, type) {
    if (!investor || !broker || !ticker || !side || !qty) {
      throw new Error("Datos incompletos para crear la orden.");
    }
    return this.repository.addOrder(
      investor,
      broker,
      ticker,
      side,
      qty,
      type,
      new Date()
    );
  }

  async getOrdersByInvestor(investorId) {
    if (!investorId) throw new Error("Se requiere el ID del inversionista.");
    return this.repository.getOrdersByInvestor(investorId);
  }

  async getAllOrders() {
    return this.repository.getAllOrders();
  }

  async updateOrder(id, fields) {
    if (!id) throw new Error("Debe especificar el ID de la orden.");
    return this.repository.updateOrder(id, fields);
  }

  async deleteOrder(id) {
    if (!id) throw new Error("Debe especificar el ID de la orden.");
    return this.repository.deleteOrder(id);
  }
}

module.exports = { StockDomain };