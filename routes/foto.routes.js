const url = require('url');
const path = require('path');
const fs = require('fs');
const Foto = require('../models/foto.model');
const fotoController = require('../controllers/foto.controller');
const logger = require('../utils/logger');
const formidable = require('formidable');
const {
  getRequestBody,
  sendJsonResponse,
  sendErrorResponse,
} = require('../utils/http');

module.exports = async function fotoRoutes(req, res) {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  if (pathname === '/api/fotos' && method === 'POST') {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        logger.logError(err);
        return sendErrorResponse(
          res,
          400,
          'Erro no processamento dos dados'
        );
      }

      const titulo = fields.titulo;
      const album = fields.album;
      if (!titulo || !album) {
        if (files.file) {
          const tempPath = files.file.filepath || files.file.path;
          if (tempPath) {
            fs.unlink(tempPath, () => {});
          }
        }
        return sendErrorResponse(
          res,
          400,
          'Os campos Título e Album são obrigatórios.'
        );
      }

      if (!files.file) {
        return sendErrorResponse(
          res,
          400,
          'A foto é obrigatória.'
        );
      }

      const fileObj = files.file;
      const tempFilePath = fileObj.filepath || fileObj.path || null;
      if (!tempFilePath) {
        return sendErrorResponse(
          res,
          500,
          'Não foi possível obter o arquivo temporário.'
        );
      }

      const originalName =
        fileObj.originalFilename || path.basename(tempFilePath);
      const newFilePath = path.join(uploadDir, originalName);

      try {
        fs.renameSync(tempFilePath, newFilePath);
      } catch (renameErr) {
        logger.logError(renameErr);
        if (tempFilePath) {
          fs.unlink(tempFilePath, () => {});
        }
        return sendErrorResponse(
          res,
          500,
          'Erro ao salvar arquivo no servidor.'
        );
      }

      const caminhoImagem = `/uploads/${originalName}`;

      try {
        const novaFoto = await fotoController.criarFoto({
          titulo,
          caminho: caminhoImagem,
          album,
        });
        return sendJsonResponse(res, 201, novaFoto);
      } catch (dbErr) {
        logger.logError(dbErr);
        fs.unlink(newFilePath, () => {});
        return sendErrorResponse(res, 500, 'Erro ao salvar dados da foto.');
      }
    });

    return true;
  }

  if (pathname === '/api/fotos' && method === 'GET') {
    try {
      const lista = await fotoController.listarFotos();
      return sendJsonResponse(res, 200, lista);
    } catch (err) {
      logger.logError(err);
      return sendErrorResponse(res, 500, 'Erro ao listar fotos.');
    }
  }

  const idMatch = pathname.match(/^\/api\/fotos\/([a-fA-F0-9]{24})$/);
  if (idMatch) {
    const id = idMatch[1];

    if (method === 'GET') {
      try {
        const foto = await fotoController.buscarFotoPorId(id);
        if (!foto) {
          return sendErrorResponse(res, 404, 'Foto não encontrada.');
        }
        return sendJsonResponse(res, 200, foto);
      } catch (err) {
        logger.logError(err);
        return sendErrorResponse(res, 500, 'Erro ao buscar foto.');
      }
    }

    if (method === 'PUT') {
      try {
        const body = await getRequestBody(req);
        const atualizado = await fotoController.atualizarFoto(id, body);
        if (!atualizado) {
          return sendErrorResponse(
            res,
            404,
            'Foto não encontrada para atualização.'
          );
        }
        return sendJsonResponse(res, 200, atualizado);
      } catch (err) {
        logger.logError(err);
        return sendErrorResponse(res, 500, 'Erro ao atualizar foto.');
      }
    }

    if (method === 'DELETE') {
      try {
        const fotoParaDeletar = await Foto.findById(id);
        if (!fotoParaDeletar) {
          return sendErrorResponse(
            res,
            404,
            'Foto não encontrada para exclusão.'
          );
        }

        await fotoController.deletarFoto(id);

        const fullPath = path.join(__dirname, '..', fotoParaDeletar.caminho);
        fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr) {
            logger.logError(unlinkErr);
          }
        });

        return sendJsonResponse(res, 200, {
          message: 'Foto removida com sucesso.',
        });
      } catch (err) {
        logger.logError(err);
        return sendErrorResponse(res, 500, 'Erro ao deletar foto.');
      }
    }
  }

  return false;
};
