const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post("/add", authenticateToken, requireRole(['chief-judge']), courtController.addCourt);
router.post("/add-type", authenticateToken, requireRole(['chief-judge']), courtController.addCaseType);
router.get("/", authenticateToken, courtController.getAllCourts);
router.get("/names", authenticateToken, courtController.getCourtNames);
router.get("/types", authenticateToken, courtController.getAllCaseTypes);
router.post("/assign-type", authenticateToken, requireRole(['chief-judge']), courtController.assignTypeToCourt);

module.exports = router;
