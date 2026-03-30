const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const { authenticateToken, requireRole } = require('../middleware/auth');
const { addCaseValidation } = require('../middleware/validation');

router.get("/", authenticateToken, caseController.getAllCases);
router.post("/add", authenticateToken, requireRole(['admin', 'chief-judge']), addCaseValidation, caseController.addCase);
router.get("/download", authenticateToken, caseController.downloadCasesReport);
router.get("/cj-cases", authenticateToken, requireRole(['chief-judge']), caseController.getChiefJudgeCases);
router.post("/save-recording", authenticateToken, caseController.saveHearingRecording);

router.get("/completed-all", authenticateToken, requireRole(['chief-judge']), caseController.getCompletedCasesForChiefJudge);
router.post("/update", authenticateToken, requireRole(['admin', 'chief-judge']), caseController.updateCase);
router.post("/delete", authenticateToken, requireRole(['admin', 'chief-judge']), caseController.deleteCase);

module.exports = router;
