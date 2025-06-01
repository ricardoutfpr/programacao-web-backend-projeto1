const url = require('url');
const usuarioController = require('../controllers/usuario.controller');
const logger = require('../utils/logger');
const {
  getRequestBody,
  sendJsonResponse,
  sendErrorResponse,
} = require('../utils/http');

module.exports = async function usuarioRoutes(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  if (pathname === '/api/usuarios' && method === 'POST') {
    try {
      const body = await getRequestBody(req);
      if (!body.nome || !body.email) {
        sendErrorResponse(res, 400, 'Campos obrigatórios: nome e email.');
        return true;
      }
      const novo = await usuarioController.criarUsuario(body);
      sendJsonResponse(res, 201, novo);
      return true;
    } catch (err) {
      const status = err.name === 'ValidationError' ? 400 : 500;
      logger.logError(err);
      sendErrorResponse(res, status, err.message || 'Erro ao criar usuário.');
      return true;
    }
  }

  if (pathname === '/api/usuarios' && method === 'GET') {
    try {
      const lista = await usuarioController.listarUsuarios();
      sendJsonResponse(res, 200, lista);
      return true;
    } catch (err) {
      logger.logError(err);
      sendErrorResponse(res, 500, err.message || 'Erro ao listar usuários.');
      return true;
    }
  }

  const idMatch = pathname.match(/^\/api\/usuarios\/([a-fA-F0-9]{24})$/);
  if (idMatch) {
    const id = idMatch[1];

    if (method === 'GET') {
      try {
        const item = await usuarioController.buscarUsuarioPorId(id);
        if (!item) {
          sendErrorResponse(res, 404, 'Usuário não encontrado.');
        } else {
          sendJsonResponse(res, 200, item);
        }
        return true;
      } catch (err) {
        logger.logError(err);
        sendErrorResponse(res, 500, err.message || 'Erro ao buscar usuário.');
        return true;
      }
    }

    if (method === 'PUT') {
      try {
        const body = await getRequestBody(req);
        const atualizado = await usuarioController.atualizarUsuario(id, body);
        if (!atualizado) {
          sendErrorResponse(
            res,
            404,
            'Usuário não encontrado para atualização.'
          );
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
          err.message || 'Erro ao atualizar usuário.'
        );
        return true;
      }
    }

    if (method === 'DELETE') {
      try {
        const deletado = await usuarioController.deletarUsuario(id);
        if (!deletado) {
          sendErrorResponse(res, 404, 'Usuário não encontrado para exclusão.');
        } else {
          sendJsonResponse(res, 200, {
            message: 'Usuário removido com sucesso.',
          });
        }
        return true;
      } catch (err) {
        logger.logError(err);
        sendErrorResponse(res, 500, err.message || 'Erro ao deletar usuário.');
        return true;
      }
    }
  }

  return false;
};
