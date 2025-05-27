const Foto = require('../models/foto.model');

exports.uploadFoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi selecionada. Por favor, envie uma foto.' });
    }

    const foto = new Foto({
      titulo: req.body.titulo,
      caminho: req.file.path,
      album: req.body.album
    });
    await foto.save();
    res.status(201).json(foto);
  } catch (err) {
    require('../utils/logger').logError(err);
    res.status(err.status || 500).json({ error: err.message || 'Erro ao salvar foto.' });
  }
};

exports.listarFotos = async (req, res) => {
  try {
    const fotos = await Foto.find().populate('album');
    res.json(fotos);
  } catch (err) {
    require('../utils/logger').logError(err);
    res.status(500).json({ error: err.message || 'Erro ao listar fotos.' });
  }
};
