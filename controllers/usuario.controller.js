const Usuario = require('../models/usuario.model');
const logger = require('../utils/logger');

exports.criarUsuario = async (body) => {
  try {
    const usuario = new Usuario(body);
    return await usuario.save();
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.listarUsuarios = async () => {
  try {
    return await Usuario.find();
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.buscarUsuarioPorId = async (id) => {
  try {
    return await Usuario.findById(id);
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.atualizarUsuario = async (id, body) => {
  try {
    return await Usuario.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.deletarUsuario = async (id) => {
  try {
    return await Usuario.findByIdAndDelete(id);
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};
