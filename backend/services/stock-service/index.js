const express = require('express');
const cors = require('cors');
const stockController = require('./src/controller');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/stock-service', stockController);


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Stock service listening on port ${PORT}`);
});