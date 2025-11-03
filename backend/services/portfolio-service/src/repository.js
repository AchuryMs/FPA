class PortfolioRepository {
  async createOrder(order) { throw new Error("Método no implementado"); }
  async updateOrderStatus(id, status, brokerId) { throw new Error("Método no implementado"); }
  async getOrdersByInvestor(investorId) { throw new Error("Método no implementado"); }

  async upsertPosition(investorId, ticker, qty, price, side) { throw new Error("Método no implementado"); }
  async getPositionsByInvestor(investorId) { throw new Error("Método no implementado"); }

  async logAudit(orderId, event, eventBy, notes) { throw new Error("Método no implementado"); }
}
module.exports = { PortfolioRepository };