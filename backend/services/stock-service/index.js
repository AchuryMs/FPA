const express = require('express');

const app = express();
const PORT = process.env.PORT || 3002;


app.get('/api/stock/test', (req, res) => {
    res.json({ message: 'Servicio de stock funcionando correctamente.' });
});

app.listen(PORT, () => {
    console.log(`Stock service listening on port ${PORT}`);
});