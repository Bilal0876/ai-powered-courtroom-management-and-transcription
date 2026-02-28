const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');
const { scheduleHearingValidation } = require('./middleware/validation');

router.post("/", authenticateToken, requireRole(['admin', 'chief-judge']), scheduleHearingValidation, async (req, res) => {
    try {
        const db = req.db;
        const { caseNumber, court, judge, stenographer, hearingDate, hearingTime } = req.body;

        // 1️⃣ Update case_details table
        await db.query(
            `UPDATE case_details
             SET court = $1,
                 judge_code = $2,
                 steno_code = $3,
                 case_status = 'Scheduled'
             WHERE case_id = $4`,
            [court, judge, stenographer, caseNumber]
        );

        // 2️⃣ Insert into hearing_details table
        await db.query(
            `INSERT INTO hearing_details (case_id, hearing_date, hearing_time)
             VALUES ($1, $2, $3)`,
            [caseNumber, hearingDate, hearingTime]
        );

        res.json({ success: true, message: "Hearing scheduled successfully" });

    } catch (err) {
        console.error("Error scheduling hearing:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
