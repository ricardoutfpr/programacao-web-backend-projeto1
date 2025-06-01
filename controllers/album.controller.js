const Album = require('../models/album.model');
const logger = require('../utils/logger');

exports.criarAlbum = async (body) => {
  try {
    const album = new Album(body);
    return await album.save();
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.listarAlbuns = async () => {
  try {
    return await Album.find();
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.buscarAlbumPorId = async (id) => {
  try {
    return await Album.findById(id);
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.atualizarAlbum = async (id, body) => {
  try {
    return await Album.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};

exports.deletarAlbum = async (id) => {
  try {
    return await Album.findByIdAndDelete(id);
  } catch (err) {
    logger.logError(err);
    throw err;
  }
};
