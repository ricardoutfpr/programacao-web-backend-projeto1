const Foto = require('../models/foto.model');
const logger = require('../utils/logger');

exports.criarFoto = async ({ titulo, caminho, album }) => {
  try {
    const foto = new Foto({ titulo, caminho, album });
    return await foto.save();
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.listarFotos = async () => {
  try {
    return await Foto.find().populate('album');
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.buscarFotoPorId = async (id) => {
  try {
    return await Foto.findById(id).populate('album');
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.atualizarFoto = async (id, body) => {
  try {
    return await Foto.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.deletarFoto = async (id) => {
  try {
    return await Foto.findByIdAndDelete(id);
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};
