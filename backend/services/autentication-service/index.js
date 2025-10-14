const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authController = require('./src/controller');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authController);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
