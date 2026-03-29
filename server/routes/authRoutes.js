const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginValidation } = require("../middleware/validation");

router.post("/login", loginValidation, authController.login);

module.exports = router;
