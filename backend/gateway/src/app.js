import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas básicas
app.get("/", (req, res) => {
  res.send("API Gateway Andina Trading funcionando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Gateway corriendo en puerto ${PORT}`));