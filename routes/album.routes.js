const url = require('url');
const albumController = require('../controllers/album.controller');
const logger = require('../utils/logger');
const {
  getRequestBody,
  sendJsonResponse,
  sendErrorResponse,
} = require('../utils/http');

module.exports = async function albumRoutes(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  if (pathname === '/api/albuns' && method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const novo = await albumController.criarAlbum(body);
      sendJsonResponse(res, 201, novo);
      return true;
    } catch (err) {
      const status = err.name === 'ValidationError' ? 400 : 500;
      logger.logError(err);
      sendErrorResponse(res, status, err.message || 'Erro ao criar álbum.');
      return true;
    }
  }

  if (pathname === '/api/albuns' && method === 'GET') {
    try {
      const lista = await albumController.listarAlbuns();
      sendJsonResponse(res, 200, lista);
      return true;
    } catch (err) {
      logger.logError(err);
      sendErrorResponse(res, 500, err.message || 'Erro ao listar álbuns.');
      return true;
    }
  }

  const idMatch = pathname.match(/^\/api\/albuns\/([a-fA-F0-9]{24})$/);
  if (idMatch) {
    const id = idMatch[1];

    if (method === 'GET') {
      try {
        const item = await albumController.buscarAlbumPorId(id);
        if (!item) {
          sendErrorResponse(res, 404, 'Álbum não encontrado.');
        } else {
          sendJsonResponse(res, 200, item);
        }
        return true;
      } catch (err) {
        logger.logError(err);
        sendErrorResponse(res, 500, err.message || 'Erro ao buscar álbum.');
        return true;
      }
    }

    if (method === 'PUT') {
      try {
        const body = await getRequestBody(req);
        const atualizado = await albumController.atualizarAlbum(id, body);
        if (!atualizado) {
          sendErrorResponse(res, 404, 'Álbum não encontrado para atualização.');
        } else {
          sendJsonResponse(res, 200, atualizado);
        }
        return true;
      } catch (err) {
        const status = err.name === 'ValidationError' ? 400 : 500;
        logger.logError(err);
        sendErrorResponse(
          res,
          status,
          err.message || 'Erro ao atualizar álbum.'
        );
        return true;
      }
    }

    if (method === 'DELETE') {
      try {
        const deletado = await albumController.deletarAlbum(id);
        if (!deletado) {
          sendErrorResponse(res, 404, 'Álbum não encontrado para exclusão.');
        } else {
          sendJsonResponse(res, 200, {
            message: 'Álbum removido com sucesso.',
          });
        }
        return true;
      } catch (err) {
        logger.logError(err);
        sendErrorResponse(res, 500, err.message || 'Erro ao deletar álbum.');
        return true;
      }
    }
  }

  return false;
};
