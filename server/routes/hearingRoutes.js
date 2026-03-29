const express = require('express');
const router = express.Router();
const hearingController = require('../controllers/hearingController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { scheduleHearingValidation } = require('../middleware/validation');

router.get('/unscheduled', authenticateToken, requireRole(['admin', 'chief-judge']), hearingController.getUnscheduledCases);
router.post('/schedule', authenticateToken, requireRole(['admin', 'chief-judge']), scheduleHearingValidation, hearingController.scheduleHearing);
router.get('/steno', authenticateToken, requireRole(['stenographer']), hearingController.getStenoHearings);
router.get('/judge', authenticateToken, requireRole(['judge']), hearingController.getJudgeHearings);

module.exports = router;
