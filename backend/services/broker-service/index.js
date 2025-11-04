require("dotenv").config();

const express = require("express");
const cors = require("cors");
const controller = require("./src/controller");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", controller);
app.use("/broker-service", controller);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Broker service listening on port ${PORT}`);
});