const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/google", authController.googleLogin);
router.get("/me", authController.getMe);
router.post("/logout", authController.logout);

module.exports = router;
