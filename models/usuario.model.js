const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O campo nome do usuário é obrigatório.'],
  },
  email: {
    type: String,
    required: [true, 'O campo email é obrigatório.'],
    unique: true,
  },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
