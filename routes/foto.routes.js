const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const controller = require('../controllers/foto.controller');

router.post('/', upload.single('foto'), controller.uploadFoto);
router.get('/', controller.listarFotos);

module.exports = router;
