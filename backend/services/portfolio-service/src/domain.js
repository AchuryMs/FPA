const axios = require("axios");

class PortfolioService {
  constructor(repository) {
    this.repository = repository;
  }

  // === Crear orden (pendiente) ===
  async createOrder(data) {
    const { investorId, ticker, qty, type, side, requestedPrice } = data;
    if (!investorId || !ticker || !qty || !side) {
      throw new Error("Faltan datos obligatorios para la orden.");
    }

    const order = {
      investorId,
      ticker,
      qty,
      type: type || "market",
      side,
      requestedPrice: requestedPrice || null,
      status: "pending",
    };

    // 🔹 Crear orden con UUID generado por el repositorio
    const id = await this.repository.createOrder(order);
    await this.repository.logAudit(id, "created", investorId, "Orden registrada");

    // 🔹 Verificar si el inversionista tiene contrato activo
    const hasContract = await this.validateContract(investorId);

    if (!hasContract) {
      console.log(`[PORTFOLIO] Inversionista ${investorId} sin contrato, ejecutando automáticamente...`);

      // 1. Actualizamos estado
      await this.repository.updateOrderStatus(id, "executed", null);

      // 2. Actualizamos posición
      await this.repository.upsertPosition(
        investorId,
        ticker,
        qty,
        requestedPrice || 0,
        side
      );

      // 3. Registramos auditoría
      await this.repository.logAudit(
        id,
        "executed",
        investorId,
        "Orden ejecutada automáticamente (sin contrato)"
      );
    }

    return id;
  }

  // === Validar contrato (consulta Contract Service) ===
  async validateContract(investorId) {
    try {
      const response = await axios.get(
        `${process.env.CONTRACT_SERVICE_URL || "http://localhost:3004/api/contracts"}/validate?investor=${investorId}`
      );
      return response.data?.contract ? true : false;
    } catch (err) {
      console.warn("[Portfolio] No se pudo validar contrato, se asume que no existe:", err.message);
      return false;
    }
  }

  // === Aprobación manual por broker ===
  async approveOrder(id, brokerId) {
    const [order] = await this.repository.getOrderById(id);
    if (!order) throw new Error("Orden no encontrada.");

    const contractOk = await this.validateContract(order.investor_id);
    if (!contractOk) throw new Error("El inversionista no tiene contrato activo con el broker.");

    await this.repository.updateOrderStatus(id, "approved", brokerId);
    await this.repository.logAudit(id, "approved", brokerId, "Orden aprobada por broker");
    return true;
  }

  // === Ejecución (por broker o automáticamente) ===
  async executeOrder(id, price, eventBy) {
    const [order] = await this.repository.getOrderById(id);
    if (!order) throw new Error("Orden no encontrada.");
    if (order.status !== "approved" && order.status !== "pending")
      throw new Error("La orden no puede ejecutarse en su estado actual.");

    // Actualizar posiciones
    await this.repository.upsertPosition(
      order.investor_id,
      order.ticker,
      order.qty,
      price || order.requested_price || 0,
      order.side
    );

    await this.repository.updateOrderStatus(id, "executed", order.broker_id);
    await this.repository.logAudit(id, "executed", eventBy, "Orden ejecutada vía sistema");
    return true;
  }

  // === Consultas ===
  async getOrdersByInvestor(investorId) {
    return this.repository.getOrdersByInvestor(investorId);
  }

  async getPositionsByInvestor(investorId) {
    return this.repository.getPositionsByInvestor(investorId);
  }
}

module.exports = { PortfolioService };