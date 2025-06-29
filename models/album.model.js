const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O campo nome do álbum é obrigatório.']
  },
  descricao: String,
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Album', AlbumSchema);
