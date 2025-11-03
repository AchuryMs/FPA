class Repository {
  async getContracts(investorId) {
    throw new Error("Método no implementado");
  }

  async createContract(investorId, brokerId, status, effectiveFrom, effectiveTo) {
    throw new Error("Método no implementado");
  }

  async updateContract(id, data) {
    throw new Error("Método no implementado");
  }

  async deleteContract(id) {
    throw new Error("Método no implementado");
  }

  async validateContract(investor, broker) {
    throw new Error("Método no implementado");
  }
}

module.exports = { Repository };