const express = require("express");
const cors = require("cors");
const controller = require("./src/controller");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", controller);
app.use("/contract-service", controller);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Contract service listening on port ${PORT}`);
});