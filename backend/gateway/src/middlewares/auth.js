const jwt = require("jsonwebtoken");

// Middleware para verificar JWT antes de pasar al microservicio
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ success: false, message: "Formato de token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta");
    req.user = decoded; // Guardamos el usuario decodificado para el servicio
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Token inválido o expirado" });
  }
}

module.exports = verifyToken;