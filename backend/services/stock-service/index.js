const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Montar rutas del servicio de stock (hexagonal: controlador como adaptador de entrada)
try {
    const stockController = require('./src/controller');
    app.use('/api/stock', stockController);
} catch (err) {
    console.error('No se pudo cargar el controller de stock:', err.message);
}

app.listen(PORT, () => {
    console.log(`Stock service listening on port ${PORT}`);
});
