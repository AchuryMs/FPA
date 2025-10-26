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

    const historical = await this.yahoo.getHistorical(symbol, from, to, '1d');
    // Transformar para el frontend: arrays de labels y datasets
    const labels = historical.map(h => h.date.toISOString().slice(0, 10));
    const data = historical.map(h => h.close);
    return { symbol, labels, data };
  }

  // Caso de uso: obtener las compañías más rentables en LATAM
// Dentro de tu clase de dominio
async getTopCompaniesLatam(countries = ['BR', 'MX', 'CL', 'AR', 'CO'], topN = 5) {
  // Mapea países → símbolos. Puedes moverlo fuera si lo reutilizas.
  const sampleSymbols = {
    BR: ['VALE', 'PETR4.SA', 'ITUB4.SA', 'BBDC4.SA'],
    MX: [ 'GFNORTEO.MX', 'BIMBOA.MX','ITUBN.MX', 'AMX' ],
    CL: ['SQMBCO.CL', 'SAN.MC','FALABELLA.SN','G4RA.BE'],
    AR: [ 'GGAL.BA','MELI', 'BMA','ALUA.BA'],
    CO: ['NU', 'AVAL', 'EC', 'NUTRESACL.SN' ]
  };

  // Normaliza países, evita duplicados y entradas vacías
  const countryList = (countries || [])
    .map(c => String(c).trim().toUpperCase())
    .filter(Boolean);

  const results = [];

  for (const country of countryList) {
    const symbols = sampleSymbols[country] || [];
    if (symbols.length === 0) {
      results.push({ country, companies: [], count: 0 });
      continue;
    }

    // Lanza todas las consultas en paralelo y tolera fallos individuales
    const settled = await Promise.allSettled(
      symbols.map(sym => this.yahoo.getQuote(sym))
    );

    // Transforma resultados exitosos → métricas
    const metrics = settled
      .map((r, idx) => (r.status === 'fulfilled' ? { sym: symbols[idx], quote: r.value } : null))
      .filter(Boolean)
      .map(({ sym, quote }) => {
        const price  = quote?.price?.regularMarketPrice ?? null;
        const change = quote?.price?.regularMarketChangePercent ?? null;
        const name   = quote?.price?.shortName ?? quote?.price?.longName ?? sym;
        return { symbol: sym, name, price, change };
      });

    // Ordena por % de cambio (desc), nulos al final
    const sorted = metrics.sort((a, b) => {
      const ac = (a.change ?? -Infinity);
      const bc = (b.change ?? -Infinity);
      return bc - ac;
    });

    // Si topN es null/undefined → trae todas
    const sliceAll = (topN === null || topN === undefined);
    const companies = sliceAll ? sorted : sorted.slice(0, Math.max(0, topN));

    results.push({
      country,
      companies,
      count: companies.length
    });
  }

  return results;
}

async placeOrder(investor, broker,ticker, side, qty, type) {
    return this.repository.addOrder(investor, broker,ticker, side, qty, type, new Date());
  }
}

module.exports = { StockDomain };
