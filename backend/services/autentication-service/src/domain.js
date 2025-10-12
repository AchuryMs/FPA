// Dominio: Entidad y lógica de usuario
class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || user.password !== password) {
      // Registrar intento fallido
      const fecha = new Date();
      await this.userRepository.logAttempt(email, fecha, false);
      throw new Error('Credenciales inválidas');
    }
    // Registrar intento exitoso
    const fecha = new Date();
    await this.userRepository.logAttempt(email, fecha, true);
    return { email: user.email };
  }
}

module.exports = { User, AuthService };
