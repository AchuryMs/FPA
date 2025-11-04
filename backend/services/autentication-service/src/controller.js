const express = require('express');
const router = express.Router();
const { AuthService } = require('./domain');
const { MySQLUserRepository } = require('./mysql_infrastructure');
const authService = new AuthService(new MySQLUserRepository());
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// TEST / HEALTHCHECK
router.get('/test', (_req, res) => {
  res.json({ ok: true, message: "Auth service operativo ✅" });
});

// === LOGIN ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'clave_secreta', { expiresIn: '2h' });
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

// === DATOS DEL USUARIO ===
router.get('/me', async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ success: false, message: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Formato de token inválido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta");
    const user = await authService.findById(decoded.id);
    if (!user)
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, user });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Token inválido o expirado" });
  }
});

// === ROLE ===
router.get('/role', async (req, res) => {
  const id = req.query.id;
  try {
    const role = await authService.findRole(id);
    res.json({ success: true, role });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// === REGISTER ===
router.post('/register', async (req, res) => {
  const { email, password, confirm } = req.body;
  try {
    if (password !== confirm) throw new Error('Las contraseñas no coinciden');
    const passwordHash = await bcrypt.hash(password, 10);
    const repo = new MySQLUserRepository();
    await repo.register({ email, passwordHash });
    res.json({ success: true, message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Error al registrar' });
  }
});

module.exports = router;