const express = require('express');
const cors = require('cors');
const ContractController = require('./src/controller');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', ContractController);
app.use('/contract-service', ContractController);


const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Contract service listening on port ${PORT}`);
});