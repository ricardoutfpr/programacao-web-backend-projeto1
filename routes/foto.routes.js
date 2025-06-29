const express = require("express");
const multer = require("multer");
const router = express.Router();
const ctrl = require("../controllers/foto.controller");
const auth = require("../middlewares/auth");

const upload = multer({ dest: "uploads/" });

router.use(auth);
router
  .route("/")
  .post(upload.single("file"), ctrl.uploadFoto)
  .get(ctrl.listFotos);

router
  .route("/:id")
  .get(ctrl.getFoto)
  .put(ctrl.updateFoto)
  .delete(ctrl.deleteFoto);

module.exports = router;
