const { createProxyMiddleware } = require("http-proxy-middleware");


function setupProxies(app) {
// AUTH SERVICE
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:3003",
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const rewritten = path.replace(/^\/api\/auth/, "/auth");
      console.log(`[Gateway][AUTH][DEBUG] rewrite ${path} → ${rewritten}`);
      return rewritten;
    },
    logLevel: "debug",
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway][AUTH][REQ] ${req.method} ${req.originalUrl}`);
      console.log(`[Gateway][AUTH][TARGET] ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[Gateway][AUTH][RES] ${proxyRes.statusCode} ${req.method} ${req.originalUrl}`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway][AUTH][ERROR] ${err.message}`);
      if (!res.headersSent)
        res.status(502).send("Gateway Proxy Error (AUTH)");
    },
  })
);

  // CONTRACT SERVICE
  app.use(
    "/api/contracts",
    createProxyMiddleware({
      target: process.env.CONTRACT_SERVICE_URL || "http://localhost:3005",
      changeOrigin: true,
      pathRewrite: (path, req) => {
        const rewritten = path.replace(/^\/api\/contracts/, "");
        console.log(`[Gateway DEBUG] Reescribiendo ${path} → ${rewritten}`);
        return rewritten;
      },
      logLevel: "debug",
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

  // STOCK SERVICE
  app.use(
    "/api/stocks",
    createProxyMiddleware({
      target: process.env.STOCK_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path, req) => path.replace(/^\/api\/stocks/, "/stock-service"),
    })
  );

  // BROKER SERVICE
  app.use(
    "/api/brokers",
    createProxyMiddleware({
      target: process.env.BROKER_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api\/brokers/, "/broker-service"),
    })
  );

  // PORTFOLIO SERVICE
  app.use(
    "/api/portfolio",
    createProxyMiddleware({
      target: process.env.PORTFOLIO_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api\/portfolio/, "/portfolio-service"),
    })
  );

  // PAYMENT SERVICE
  app.use(
    "/api/payments",
    createProxyMiddleware({
      target: process.env.PAYMENT_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api\/payments/, "/payment-service"),
    })
  );

  // REPORT SERVICE
  app.use(
    "/api/reports",
    createProxyMiddleware({
      target: process.env.REPORT_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api\/reports/, "/report-service"),
    })
  );
}

module.exports = setupProxies;