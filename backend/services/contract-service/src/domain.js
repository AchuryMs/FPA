

class ContractService {

    constructor(repository) {
        this.repository = repository;
    }

    async getContracts(email, password) {
        return await this.repository.getContracts(id);
    }

    async validateContract(investor) {
        return await this.repository.validateContract(investor);
    }

}

module.exports = { ContractService };
