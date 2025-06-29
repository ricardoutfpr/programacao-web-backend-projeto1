const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/album.controller");
const auth = require("../middlewares/auth");

router.use(auth);
router.route("/").post(ctrl.createAlbum).get(ctrl.listAlbums);

router
  .route("/:id")
  .get(ctrl.getAlbum)
  .put(ctrl.updateAlbum)
  .delete(ctrl.deleteAlbum);

module.exports = router;
