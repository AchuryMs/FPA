class BrokerRepository {
  async getAllBrokers() {
    throw new Error("Método no implementado");
  }

  async getBrokerById(id) {
    throw new Error("Método no implementado");
  }

  async addBroker(broker) {
    throw new Error("Método no implementado");
  }

  async updateBroker(id, fields) {
    throw new Error("Método no implementado");
  }

  async deleteBroker(id) {
    throw new Error("Método no implementado");
  }

  async getOrdersByBroker(brokerId) {
    throw new Error("Método no implementado");
  }

  async addBrokerOrder(order) {
    throw new Error("Método no implementado");
  }
}

module.exports = { BrokerRepository };