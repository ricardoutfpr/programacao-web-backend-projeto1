require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

const usuarioRoutes = require("./routes/usuario.routes");
const albumRoutes = require("./routes/album.routes");
const fotoRoutes = require("./routes/foto.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => {
    console.error("Erro ao conectar no MongoDB:", err);
    process.exit(1);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/albuns", albumRoutes);
app.use("/api/fotos", fotoRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Erro interno na aplicação." });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}/api`);
});
