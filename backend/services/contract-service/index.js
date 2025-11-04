require("dotenv").config();
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

const express = require("express");
const cors = require("cors");
const contractController = require("./src/controller");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", contractController);

const PORT = process.env.PORT || 3005;
console.log(">>> Inicializando servidor Express...");
app.listen(PORT, () => {
  console.log(`✅ Contract Service corriendo en http://localhost:${PORT}`);
});

console.log(">>> app.listen() ejecutado correctamente");
