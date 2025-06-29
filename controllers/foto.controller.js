const Foto = require("../models/foto.model");
const logger = require("../utils/logger");

exports.uploadFoto = async (req, res, next) => {
  try {
    const { titulo, album } = req.body;
    if (!req.file) throw { status: 400, message: "Arquivo não enviado." };
    const caminho = req.file.path;
    const foto = await new Foto({ titulo, caminho, album }).save();
    res.status(201).json(foto);
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.listFotos = async (req, res, next) => {
  try {
    const fotos = await Foto.find({ album: req.query.album }).populate("album");
    res.json(fotos);
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.getFoto = async (req, res, next) => {
  try {
    const foto = await Foto.findById(req.params.id).populate("album");
    if (!foto) throw { status: 404, message: "Foto não encontrada." };
    res.json(foto);
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.updateFoto = async (req, res, next) => {
  try {
    const updated = await Foto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw { status: 404, message: "Foto não encontrada." };
    res.json(updated);
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.deleteFoto = async (req, res, next) => {
  try {
    const foto = await Foto.findById(req.params.id);
    if (!foto) throw { status: 404, message: "Foto não encontrada." };
    await foto.remove();
    res.json({ message: "Foto removida." });
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};
