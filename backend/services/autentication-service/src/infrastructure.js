const { UserRepository } = require('./repository');

class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this.users = [
      { email: 'demo@inver.com', password: '123456' }
    ];
  }

  async findByEmail(email) {
    return this.users.find(u => u.email === email);
  }
}

module.exports = { InMemoryUserRepository };
