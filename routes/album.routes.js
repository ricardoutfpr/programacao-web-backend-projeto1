const express = require('express');
const router = express.Router();
const controller = require('../controllers/album.controller');

router.post('/', controller.criarAlbum);
router.get('/', controller.listarAlbuns);

module.exports = router;
