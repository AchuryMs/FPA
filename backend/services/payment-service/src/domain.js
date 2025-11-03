require("dotenv").config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  constructor(repository) {
    this.repository = repository;
  }

  // === Simular un pago con Stripe ===
  async simulatePayment(investorId, amount, currency = "usd", type = "deposit") {
    if (!investorId || !amount || amount <= 0) {
      throw new Error("Datos inválidos para la simulación de pago.");
    }

    try {
      // Crear PaymentIntent simulado (no se cobra realmente)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe usa centavos
        currency,
        payment_method_types: ["card"],
        description: `Simulación de ${type} para investor ${investorId}`,
        metadata: { investorId, type },
      });

      // Guardar registro local
      const id = await this.repository.savePayment({
        investorId,
        amount,
        currency,
        type,
        stripeId: paymentIntent.id,
        status: "approved",
      });

      return {
        paymentId: id,
        stripeId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: "approved",
      };
    } catch (err) {
      console.error("[PaymentService] simulatePayment:", err.message);
      throw new Error("Error simulando el pago con Stripe.");
    }
  }

  // === Listar pagos por inversionista ===
  async getPaymentsByInvestor(investorId) {
    return this.repository.getPaymentsByInvestor(investorId);
  }
}

module.exports = { PaymentService };