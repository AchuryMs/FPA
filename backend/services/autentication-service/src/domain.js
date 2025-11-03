
const bcrypt = require('bcryptjs');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async findById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
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

    await this.userRepository.logAttempt(email, fecha, true);
    return { id: user.id };
  }

  async findRole(id) {
    const roleData = await this.userRepository.findRole(id);
    if (!roleData) {
      throw new Error('Usuario no encontrado');
    }
    return roleData.user_type;
  }
}

module.exports = { AuthService };
