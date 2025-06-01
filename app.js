require('dotenv').config();
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { sendErrorResponse } = require('./utils/http');

const albumRoutes = require('./routes/album.routes');
const fotoRoutes = require('./routes/foto.routes');
const usuarioRoutes = require('./routes/usuario.routes');

const PORT = process.env.PORT || 3000;

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => {
    console.error('Erro de conexão:', err);
    process.exit(1);
  });

function serveStatic(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, pathname);
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404);
        return res.end('Arquivo não encontrado.');
      }
      const stream = fs.createReadStream(filePath);
      res.writeHead(200);
      stream.pipe(res);
    });
    return true;
  }
  return false;
}

// Criação do servidor HTTP
const server = http.createServer(async (req, res) => {
  if (serveStatic(req, res)) {
    return;
  }

  try {
    if (await albumRoutes(req, res)) return;
    if (await fotoRoutes(req, res)) return;
    if (await usuarioRoutes(req, res)) return;
  } catch (err) {
    return sendErrorResponse(res, 500, 'Erro no roteamento.');
  }

  return sendErrorResponse(res, 404, 'Rota não encontrada.');
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
