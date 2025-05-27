const Album = require('../models/album.model');

exports.criarAlbum = async (req, res) => {
  try {
    const album = new Album(req.body);
    await album.save();
    res.status(201).json(album);
  } catch (err) {
    require('../utils/logger').logError(err);
    res.status(500).json({ error: err.message | 'Erro ao criar álbum.' });
  }
};

exports.listarAlbuns = async (req, res) => {
  try {
    const albuns = await Album.find();
    res.json(albuns);
  } catch (err) {
    require('../utils/logger').logError(err);
    res.status(500).json({ error: err.message | 'Erro ao buscar álbuns.' });
  }
};
