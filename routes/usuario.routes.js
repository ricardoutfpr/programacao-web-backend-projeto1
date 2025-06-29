const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/usuario.controller");
const auth = require("../middlewares/auth");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/logout", auth, ctrl.logout);

router
  .route("/profile")
  .get(auth, ctrl.getProfile)
  .put(auth, ctrl.updateProfile)
  .delete(auth, ctrl.deleteAccount);

module.exports = router;
