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

    const id = await this.repository.createOrder(order);
    await this.repository.logAudit(id, "created", investorId, "Orden registrada");
    return id;
  }

  // === Validar contrato (llama a Contract Service) ===
  async validateContract(investorId) {
    try {
      const response = await axios.get(
        `${process.env.CONTRACT_SERVICE_URL}/validate?investor=${investorId}`
      );
      return response.data?.contract ? true : false;
    } catch (err) {
      console.error("[Portfolio] Error validando contrato:", err.message);
      return false;
    }
  }

  // === Aprobación por broker (llama a Broker Service) ===
  async approveOrder(id, brokerId) {
    try {
      // Traer orden completa
      const [order] = await this.repository.getOrderById(id);
      if (!order) throw new Error("Orden no encontrada.");

      // Validar contrato del inversionista
      const contractOk = await this.validateContract(order.investor_id);
      if (!contractOk) {
        throw new Error("El inversionista no tiene contrato activo con el broker.");
      }

      // Notificar al Broker Service
      await axios.post(`${process.env.BROKER_SERVICE_URL}/broker/approve`, {
        orderId: id,
        brokerId,
      });

      // Actualizar estado
      await this.repository.updateOrderStatus(id, "approved", brokerId);
      await this.repository.logAudit(id, "approved", brokerId, "Orden aprobada por broker");
      return true;
    } catch (err) {
      console.error("[Portfolio] Error en approveOrder:", err.message);
      throw err;
    }
  }

  // === Ejecución (llama al Stock Service y actualiza posiciones) ===
  async executeOrder(id, price, eventBy) {
    const [order] = await this.repository.getOrderById(id);
    if (!order) throw new Error("Orden no encontrada.");
    if (order.status !== "approved") throw new Error("La orden no está aprobada.");

    // Enviar orden al Stock Service
    try {
      await axios.post(`${process.env.STOCK_SERVICE_URL}/order`, {
        investor: order.investor_id,
        broker: order.broker_id,
        ticker: order.ticker,
        side: order.side,
        qty: order.qty,
        type: order.type,
      });
    } catch (err) {
      console.error("[Portfolio] Error enviando al Stock Service:", err.message);
      throw new Error("No se pudo ejecutar la orden en el mercado.");
    }

    // Actualizar posición local
    await this.repository.upsertPosition(
      order.investor_id,
      order.ticker,
      order.qty,
      price,
      order.side
    );

    await this.repository.updateOrderStatus(id, "executed", order.broker_id);
    await this.repository.logAudit(id, "executed", eventBy, "Orden ejecutada vía Stock Service");
    return true;
  }

  // === Obtener órdenes por inversionista ===
  async getOrdersByInvestor(investorId) {
    return this.repository.getOrdersByInvestor(investorId);
  }

  // === Obtener posiciones por inversionista ===
  async getPositionsByInvestor(investorId) {
    return this.repository.getPositionsByInvestor(investorId);
  }
}

module.exports = { PortfolioService };