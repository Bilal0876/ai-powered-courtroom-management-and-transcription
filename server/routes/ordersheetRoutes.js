const express = require('express');
const router = express.Router();
const ordersheetController = require('../controllers/ordersheetController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post("/save", authenticateToken, requireRole(['stenographer']), ordersheetController.saveOrdersheet);
router.post("/approve", authenticateToken, requireRole(['judge']), ordersheetController.approveOrdersheet);
router.get("/pending", authenticateToken, requireRole(['judge']), ordersheetController.getPendingOrdersheets);
router.get("/review/:caseId", authenticateToken, requireRole(['judge']), ordersheetController.getReviewOrdersheet);

module.exports = router;
