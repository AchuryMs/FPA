
class UserRepository {
  async findByEmail(email) {
    throw new Error('Método no implementado');
  }

  async register(email, passwordHash) {
    throw new Error('Método no implementado');
  }

  async logAttempt(email, fecha, exito) {
    throw new Error('Método no implementado');
  }
}

module.exports = { UserRepository };
