const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");

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

// ====== Proxy: AUTH SERVICE ======
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: (process.env.AUTH_SERVICE_URL || "http://localhost:3003") + "/auth",
    changeOrigin: true,
    logLevel: "info",
    onProxyReq: (proxyReq, req) => {
      console.log(`[Proxy][AUTH] -> ${req.method} ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req) => {
      console.log(`[Proxy][AUTH] <- ${proxyRes.statusCode} ${req.method} ${req.originalUrl}`);
    },
    onError: (err, req, res) => {
      console.error(`[Proxy][AUTH][ERROR] ${err.message}`);
      if (!res.headersSent) res.status(502).send("Gateway Proxy Error (AUTH)");
    },
  })
);

// ====== Proxy: CONTRACT SERVICE ======
app.use(
  "/api/contracts",
  createProxyMiddleware({
    target: (process.env.CONTRACT_SERVICE_URL || "http://localhost:3005") + "/contract-service",
    changeOrigin: true,
    logLevel: "info",
    onProxyReq: (proxyReq, req) => {
      console.log(`[Proxy][CONTRACT] -> ${req.method} ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req) => {
      console.log(`[Proxy][CONTRACT] <- ${proxyRes.statusCode} ${req.method} ${req.originalUrl}`);
    },
    onError: (err, req, res) => {
      console.error(`[Proxy][CONTRACT][ERROR] ${err.message}`);
      if (!res.headersSent) res.status(502).send("Gateway Proxy Error (CONTRACT)");
    },
  })
);

// ====== Proxy: STOCK SERVICE ======
app.use(
  "/api/stocks",
  createProxyMiddleware({
    target: (process.env.STOCK_SERVICE_URL || "http://localhost:3002") + "/stock-service",
    changeOrigin: true,
    logLevel: "info",
    onProxyReq: (proxyReq, req) => {
      console.log(`[Proxy][STOCK] -> ${req.method} ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req) => {
      console.log(`[Proxy][STOCK] <- ${proxyRes.statusCode} ${req.method} ${req.originalUrl}`);
    },
    onError: (err, req, res) => {
      console.error(`[Proxy][STOCK][ERROR] ${err.message}`);
      if (!res.headersSent) res.status(502).send("Gateway Proxy Error (STOCK)");
    },
  })
);

// ====== Ruta de prueba ======
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "Gateway running" });
});

// ====== Servidor ======
app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
});