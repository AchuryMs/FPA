const express = require("express");
const router = express.Router();
const { ContractService } = require("./domain");
const { MySQLContractsRepository } = require("./mysql_infrastructure");

const service = new ContractService(new MySQLContractsRepository());

// ----- Prueba -----
router.get("/test", (_req, res) => {
  res.json({ message: "Contract service operativo." });
});

// ----- Listar contratos -----
router.get("/contracts", async (req, res) => {
  try {
    const investorId = req.query.investor || null;
    const data = await service.getContracts(investorId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----- Crear contrato -----
router.post("/contracts", async (req, res) => {
  try {
    const { investorId, brokerId, status, effectiveFrom, effectiveTo } = req.body;
    const id = await service.createContract(
      investorId,
      brokerId,
      status,
      effectiveFrom,
      effectiveTo
    );
    res.json({ success: true, message: "Contrato creado correctamente", id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ----- Validar contrato activo -----
router.get("/validate", async (req, res) => {
  try {
    const { investor, broker } = req.query;
    if (!investor || !broker) {
      return res
        .status(400)
        .json({ success: false, message: "Faltan parámetros investor o broker" });
    }

    const contract = await service.validateContract(investor, broker);

    if (!contract) {
      console.log("[ContractService] ❌ No se encontró contrato activo");
      return res.json({ contract: null });
    }

    console.log("[ContractService] ✅ Contrato activo encontrado");
    res.json({ contract });
  } catch (err) {
    console.error("Error validando contrato:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----- Actualizar contrato -----
router.put("/contracts/:id", async (req, res) => {
  try {
    const ok = await service.updateContract(req.params.id, req.body);
    if (!ok) return res.status(404).json({ success: false, message: "No encontrado" });
    res.json({ success: true, message: "Contrato actualizado." });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ----- Eliminar contrato -----
router.delete("/contracts/:id", async (req, res) => {
  try {
    const ok = await service.deleteContract(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: "No encontrado" });
    res.json({ success: true, message: "Contrato eliminado." });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;