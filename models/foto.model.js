const mongoose = require('mongoose');

const FotoSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: [true, 'O campo título é obrigatório.'] 
  },
  caminho: { 
    type: String, 
    required: [true, 'O campo caminho é obrigatório.'] 
  },
  album: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Album', 
    required: [true, 'O campo álbum é obrigatório.'] 
  },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Foto', FotoSchema);
