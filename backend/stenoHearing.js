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
      cd.Case_id AS "caseNumber",
      cd.Case_Type AS "caseType",
      cd.Case_Title AS "caseTitle",
      cd.Case_Party1 AS "party1",
      cd.Case_Party2 AS "party2",
      cd.case_code AS "caseCode",
      ji.Judge_Name AS "judge",
      TO_CHAR(hd.Hearing_Date, 'YYYY-MM-DD') AS "hearingDate",
      TO_CHAR(hd.Hearing_Time, 'HH24:MI') AS "hearingTime"
    FROM case_details cd
    JOIN hearing_details hd 
      ON cd.Case_id = hd.case_id
    JOIN judge_info ji 
      ON cd.judge_code = ji.Judge_Code
    JOIN stenographer_info si 
      ON cd.steno_code = si.Steno_Code
    WHERE 
      cd.Steno_Code = $1
      AND cd.court = si.steno_court
      AND cd.transcript = 'NO'
  `;

  try {
    const result = await db.query(query, [stenoCode]);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ DB error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

module.exports = router;
