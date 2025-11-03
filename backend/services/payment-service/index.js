const express = require("express");
const cors = require("cors");
const controller = require("./src/controller");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", controller);
app.use("/payment-service", controller);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Payment service listening on port ${PORT}`);
});