require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authController = require('./src/controller');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/', authController);

const PORT = process.env.PORT || 3003;
app.use((req, res, next) => {
  console.log(`[AUTH SERVICE][DEBUG] ${req.method} ${req.url}`);
  next();
});
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});