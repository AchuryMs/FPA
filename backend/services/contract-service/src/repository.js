class Repository {
  async getAllContracts() {
    throw new Error("Método no implementado");
  }

  async getContractsByInvestor(investorId) {
    throw new Error("Método no implementado");
  }

  async addContract(contract) {
    throw new Error("Método no implementado");
  }

  async validateContract(investorId) {
    throw new Error("Método no implementado");
  }

  async updateContract(id, fields) {
    throw new Error("Método no implementado");
  }

  async deleteContract(id) {
    throw new Error("Método no implementado");
  }
}

module.exports = { Repository };