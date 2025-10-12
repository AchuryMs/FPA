// Adaptador: Entrada HTTP (Express)
const express = require('express');
const router = express.Router();
const { AuthService } = require('./domain');
const { MySQLUserRepository } = require('./mysql_infrastructure');

const authService = new AuthService(new MySQLUserRepository());

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    // Generar token JWT
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'clave_secreta', { expiresIn: '2h' });
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, confirm } = req.body;
  try {
    if (password !== confirm) {
      throw new Error('Las contraseñas no coinciden');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const repo = new MySQLUserRepository();

    await repo.register({ email, passwordHash });
    res.json({ success: true, message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Error al registrar' });
  }
});

module.exports = router;
