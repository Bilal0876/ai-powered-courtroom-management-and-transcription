const express = require('express');
const router = express.Router();
const transcriptController = require('../controllers/transcriptController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post("/save", authenticateToken, requireRole(['stenographer']), transcriptController.saveTranscript);
router.post("/submit-approval", authenticateToken, requireRole(['stenographer']), transcriptController.submitTranscriptForApproval);
router.post("/edit", authenticateToken, requireRole(['stenographer', 'judge']), transcriptController.editTranscriptSegment);
router.post("/approve", authenticateToken, requireRole(['judge']), upload.single('transcriptFile'), transcriptController.approveTranscript);
router.get("/pending", authenticateToken, requireRole(['judge']), transcriptController.getPendingTranscripts);
router.get("/review/:caseId", authenticateToken, requireRole(['judge']), transcriptController.getReviewTranscript);
router.get("/:caseId", authenticateToken, transcriptController.getTranscriptByCase);

module.exports = router;
