class ContractService {
  constructor(repository) {
    this.repository = repository;
  }

  async getContracts(investorId) {
    console.log(`[ContractService] Listando contratos para ${investorId}`);
    return await this.repository.getContracts(investorId);
  }

  async createContract(investorId, brokerId, status, effectiveFrom, effectiveTo) {
    console.log(`[ContractService] Creando contrato ${investorId} ↔ ${brokerId}`);
    return await this.repository.createContract(
      investorId,
      brokerId,
      status,
      effectiveFrom,
      effectiveTo
    );
  }

  async updateContract(id, data) {
    console.log(`[ContractService] Actualizando contrato ${id}`);
    return await this.repository.updateContract(id, data);
  }

  async deleteContract(id) {
    console.log(`[ContractService] Eliminando contrato ${id}`);
    return await this.repository.deleteContract(id);
  }

  async validateContract(investor, broker) {
    console.log(`[ContractService] Validando contrato entre ${investor} ↔ ${broker}`);
    return await this.repository.validateContract(investor, broker);
  }
}

module.exports = { ContractService };