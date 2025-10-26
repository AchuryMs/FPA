
class OrdersRepository {

  async addOrder(investor, broker, ticker, side, qty, type, date) {
    throw new Error('Método no implementado');
  }

  async findRole(email) {
    throw new Error('Método no implementado');
  }

}

module.exports = { OrdersRepository };
