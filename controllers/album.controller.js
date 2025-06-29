const Album = require("../models/album.model");
const logger = require("../utils/logger");

exports.createAlbum = async (req, res, next) => {
  try {
    const { nome, descricao } = req.body;
    const album = await new Album({
      nome,
      descricao,
      usuario: req.session.userId,
    }).save();
    res.status(201).json(album);
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.listAlbums = async (req, res, next) => {
  try {
    const albuns = await Album.find({ usuario: req.session.userId });
    res.json(albuns);
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.getAlbum = async (req, res, next) => {
  try {
    const album = await Album.findOne({
      _id: req.params.id,
      usuario: req.session.userId,
    });
    if (!album) throw { status: 404, message: "Álbum não encontrado." };
    res.json(album);
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.updateAlbum = async (req, res, next) => {
  try {
    const updated = await Album.findOneAndUpdate(
      { _id: req.params.id, usuario: req.session.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) throw { status: 404, message: "Álbum não encontrado." };
    res.json(updated);
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.deleteAlbum = async (req, res, next) => {
  try {
    const removed = await Album.findOneAndDelete({
      _id: req.params.id,
      usuario: req.session.userId,
    });
    if (!removed) throw { status: 404, message: "Álbum não encontrado." };
    res.json({ message: "Álbum removido." });
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};
