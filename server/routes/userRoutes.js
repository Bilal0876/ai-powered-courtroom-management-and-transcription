const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, requireRole } = require('../middleware/auth');
const { registerUserValidation } = require('../middleware/validation');

router.post("/register", authenticateToken, requireRole(['admin']), registerUserValidation, userController.registerUser);
router.get("/", authenticateToken, requireRole(['admin', 'chief-judge']), userController.getAllUsers);
router.post("/update", authenticateToken, requireRole(['admin', 'chief-judge']), userController.updateUser);
router.post("/delete", authenticateToken, requireRole(['admin', 'chief-judge']), userController.deleteUser);
router.post("/profile", authenticateToken, userController.getProfile);
router.get("/judges/:court", authenticateToken, userController.getJudgeNames);
router.get("/stenos/:court", authenticateToken, userController.getStenoNames);

module.exports = router;
