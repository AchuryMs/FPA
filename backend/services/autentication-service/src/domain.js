// Dominio: Entidad y lógica de usuario
class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}

const bcrypt = require('bcryptjs');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    const fecha = new Date();
    if (!user) {
      await this.userRepository.logAttempt(email, fecha, false);
      throw new Error('Credenciales inválidas');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await this.userRepository.logAttempt(email, fecha, false);
      throw new Error('Credenciales inválidas');
    }

    // Registrar intento exitoso
    await this.userRepository.logAttempt(email, fecha, true);
    return { email: user.email };
  }

  async findRole(email) {
    const roleData = await this.userRepository.findRole(email);
    if (!roleData) {
      throw new Error('Usuario no encontrado');
    }
    return roleData.user_type;
  }
}

module.exports = { User, AuthService };
