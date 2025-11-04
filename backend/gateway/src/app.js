const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const setupProxies = require("./proxy"); // 👈 Importa tu proxy central

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ====== Middlewares globales ======
app.use(cors());
app.use(morgan("dev"));

// ====== Variables de entorno ======
console.log("Gateway starting...");
console.log("AUTH_SERVICE_URL:", process.env.AUTH_SERVICE_URL);
console.log("CONTRACT_SERVICE_URL:", process.env.CONTRACT_SERVICE_URL);
console.log("STOCK_SERVICE_URL:", process.env.STOCK_SERVICE_URL);
console.log("BROKER_SERVICE_URL:", process.env.BROKER_SERVICE_URL);
console.log("PORTFOLIO_SERVICE_URL:", process.env.PORTFOLIO_SERVICE_URL);
console.log("PAYMENT_SERVICE_URL:", process.env.PAYMENT_SERVICE_URL);
console.log("REPORT_SERVICE_URL:", process.env.REPORT_SERVICE_URL);

// ====== Cargar los proxies ======
setupProxies(app); // 👈 Aquí se cargan todas las rutas de proxy

// ====== Ruta de prueba ======
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "Gateway running" });
});

// ====== Servidor ======
app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
});