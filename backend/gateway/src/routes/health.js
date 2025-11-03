// src/routes/health.js
const express = require("express");
const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "API Gateway",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;