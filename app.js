require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const albumRoutes = require('./routes/album.routes');
const fotoRoutes = require('./routes/foto.routes');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rotas
app.use('/api/albuns', albumRoutes);
app.use('/api/fotos', fotoRoutes);

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error('Erro de conexão:', err));
