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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'clave_secreta', { expiresIn: '2h' });
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

// Obtener datos del usuario a partir del token
router.get('/me', async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Formato de token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta");
    const user = await authService.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
    res.json({ success: true, user });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Token inválido o expirado" });
  }
});

router.get('/role', async (req, res) => {
  const id = req.query.id;
  try {
    const role = await authService.findRole(id);
    res.json({ success: true, role });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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
