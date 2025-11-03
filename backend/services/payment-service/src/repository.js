class PaymentRepository {
  async savePayment(payment) {
    throw new Error("Método no implementado");
  }

  async getPaymentsByInvestor(investorId) {
    throw new Error("Método no implementado");
  }
}

module.exports = { PaymentRepository };