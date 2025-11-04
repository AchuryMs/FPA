class StockDomain {
  constructor(yahooAdapter, repository) {
    this.yahoo = yahooAdapter;
    this.repository = repository;
  }

  // === Caso de uso: datos históricos para gráfica ===
  async getMenuGraphData(symbol, days = 30) {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    const historical = await this.yahoo.getHistorical(symbol, from, to, "1d");
    const labels = historical.map((h) => h.date.toISOString().slice(0, 10));
    const data = historical.map((h) => h.close);
    return { symbol, labels, data };
  }

  // === Caso de uso: obtener las compañías LATAM y principales mercados ===
  async getTopCompaniesLatam(
    countries = ["CO", "PE", "EC", "VE", "MX", "BR", "AR", "CL", "US", "EU", "ASIA"],
    topN = 5
  ) {
    const results = [];

    for (const country of countries) {
      const symbols = this.yahoo.getSymbolsByCountry(country);
      console.log(`[STOCK DOMAIN] Procesando país: ${country} (${symbols.length} símbolos)`);
      if (symbols.length === 0) {
        results.push({ country, companies: [] });
        continue;
      }

      // Consultamos los símbolos de cada país/mercado
      const settled = await Promise.allSettled(
        symbols.map((s) => this.yahoo.getQuote(s))
      );

      const companies = settled
        .map((r) => r.value)
        .filter((c) => c !== null)
        .sort((a, b) => (b.change ?? -Infinity) - (a.change ?? -Infinity))
        .slice(0, topN);

      // Agregamos país y metadatos
      const formatted = companies.map((c) => ({
        ...c,
        country,
        market: c.market || "LATAM",
        currency: c.currency || "USD",
      }));

      results.push({ country, companies: formatted });
    }

    return results;
  }

  // === CRUD de órdenes ===
  async placeOrder(investor, broker, ticker, side, qty, type) {
    if (!investor || !broker || !ticker || !side || !qty)
      throw new Error("Datos incompletos para crear la orden.");

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