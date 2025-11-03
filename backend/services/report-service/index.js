const express = require("express");
const cors = require("cors");
const controller = require("./src/controller");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", controller);
app.use("/report-service", controller);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Report service listening on port ${PORT}`);
});