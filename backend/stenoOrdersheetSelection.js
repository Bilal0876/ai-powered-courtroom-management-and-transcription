// routes/caseRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');

// ✅ Get all cases with hearing info (PostgreSQL)
router.get("/", authenticateToken, requireRole(['stenographer']), async (req, res) => {
  const db = req.db;
  const stenoCode = req.user.code;

  const query = `
    SELECT 
  cd.case_id AS "caseNumber",
  cd.case_type AS "caseType",
  cd.case_title AS "caseTitle",
  cd.case_party1 AS "party1",
  cd.case_party2 AS "party2",
  cd.case_code AS "caseCode",
  ji.judge_name AS "judge",
  TO_CHAR(hd.hearing_date, 'YYYY-MM-DD') AS "hearingDate",
  TO_CHAR(hd.hearing_time, 'HH24:MI') AS "hearingTime"
FROM case_details cd
JOIN hearing_details hd 
  ON cd.case_id = hd.case_id
JOIN judge_info ji 
  ON cd.judge_code = ji.judge_code
JOIN stenographer_info si 
  ON cd.steno_code = si.steno_code
WHERE cd.steno_code = $1
  AND cd.court = si.steno_court
  AND cd.transcript = 'YES'
  AND NOT EXISTS (
      SELECT 1
      FROM ordersheets_approval oa
      WHERE oa.case_id = cd.case_id
        AND LOWER(oa.status) = 'submitted'
  );
      `;
  // JOIN ordersheets os
  //   ON cd.case_id = os.case_id
  // AND os.status != 'submitted'

  try {
    const result = await db.query(query, [stenoCode]);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ DB error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

module.exports = router;
