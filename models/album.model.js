const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: [true, 'O campo nome do álbum é obrigatório.'] 
  },
  descricao: String,
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Album', AlbumSchema);
