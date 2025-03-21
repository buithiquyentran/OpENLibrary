const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();
router.route("/user-info").get(authController.getUserInfo);
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);

router.route("/delete/:username").delete(authController.delete);

module.exports = router;
