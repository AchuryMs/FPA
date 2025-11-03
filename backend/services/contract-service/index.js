const express = require("express");
const cors = require("cors");
const contractController = require("./src/controller");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", contractController);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`✅ Contract Service corriendo en http://localhost:${PORT}`);
});