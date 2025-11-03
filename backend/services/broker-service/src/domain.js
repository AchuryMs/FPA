class BrokerService {
  constructor(repository) {
    this.repository = repository;
  }

  // === CRUD Brokers ===
  async getAllBrokers() {
    return this.repository.getAllBrokers();
  }

  async getBrokerById(id) {
    return this.repository.getBrokerById(id);
  }

  async createBroker(data) {
    const { userId, name, licenseNumber, email } = data;
    if (!userId || !name || !licenseNumber || !email) {
      throw new Error("Faltan campos obligatorios para crear el broker.");
    }
    return this.repository.addBroker(data);
  }

  async updateBroker(id, fields) {
    return this.repository.updateBroker(id, fields);
  }

  async deleteBroker(id) {
    return this.repository.deleteBroker(id);
  }

  // === Gestión de órdenes ejecutadas ===
  async getOrdersByBroker(brokerId) {
    return this.repository.getOrdersByBroker(brokerId);
  }

  async addBrokerOrder(orderData) {
    const { brokerId, investorId, stockTicker, side, qty, executedPrice } = orderData;
    if (!brokerId || !investorId || !stockTicker || !side || !qty) {
      throw new Error("Datos incompletos para registrar la orden.");
    }
    const executedAt = new Date();
    return this.repository.addBrokerOrder({
      brokerId,
      investorId,
      stockTicker,
      side,
      qty,
      executedPrice,
      executedAt,
    });
  }
}

module.exports = { BrokerService };