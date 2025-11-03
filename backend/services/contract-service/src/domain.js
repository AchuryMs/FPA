class ContractService {
  constructor(repository) {
    this.repository = repository;
  }

  // === 1. Obtener contratos ===
  async getContracts(investorId = null) {
    if (investorId) {
      return this.repository.getContractsByInvestor(investorId);
    }
    return this.repository.getAllContracts();
  }

  // === 2. Crear contrato ===
  async createContract(investorId, brokerId, status, effectiveFrom, effectiveTo) {
    if (!investorId || !brokerId) {
      throw new Error("Los campos investorId y brokerId son obligatorios.");
    }

    const signedAt = new Date();
    const contract = {
      investorId,
      brokerId,
      status: status || "active",
      signedAt,
      effectiveFrom,
      effectiveTo,
    };

    return this.repository.addContract(contract);
  }

  // === 3. Validar contrato activo ===
  async validateContract(investorId) {
    if (!investorId) throw new Error("Falta el ID del inversionista.");
    return this.repository.validateContract(investorId);
  }

  // === 4. Actualizar contrato ===
  async updateContract(id, fields) {
    if (!id) throw new Error("Debe especificar el ID del contrato.");
    return this.repository.updateContract(id, fields);
  }

  // === 5. Eliminar contrato ===
  async deleteContract(id) {
    if (!id) throw new Error("Debe especificar el ID del contrato.");
    return this.repository.deleteContract(id);
  }
}

module.exports = { ContractService };
