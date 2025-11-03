const { createProxyMiddleware } = require("http-proxy-middleware");

function setupProxies(app) {
  // ✅ AUTH SERVICE
  app.use(
    "/api/auth",
    createProxyMiddleware({
      target: process.env.AUTH_SERVICE_URL, // http://localhost:3003
      changeOrigin: true,
      pathRewrite: (path, req) => path.replace(/^\/api\/auth/, "/auth"),
    })
  );

  // ✅ CONTRACT SERVICE
  app.use(
    "/api/contracts",
    createProxyMiddleware({
      target: process.env.CONTRACT_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path, req) => path.replace(/^\/api\/contracts/, "/contract-service"),
    })
  );

  // ✅ STOCK SERVICE
  app.use(
    "/api/stocks",
    createProxyMiddleware({
      target: process.env.STOCK_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: (path, req) => path.replace(/^\/api\/stocks/, "/stock-service"),
    })
  );
}

module.exports = setupProxies;