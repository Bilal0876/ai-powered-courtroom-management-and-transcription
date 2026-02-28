// routes/caseRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');

// ✅ Get all cases with hearing info (PostgreSQL)
router.get("/", authenticateToken, requireRole(['judge']), async (req, res) => {
  const db = req.db;
  const judgeCode = req.user.code;

  const query = `
    SELECT 
      cd.Case_id AS "caseNumber",
      cd.Case_Type AS "caseType",
      cd.Case_Title AS "caseTitle",
      cd.Case_Status AS "status",
      cd.Case_Party1 AS "party1",
      cd.Case_Party2 AS "party2",
      st.Steno_Name AS "stenographer",
      TO_CHAR(hd.Hearing_Date, 'YYYY-MM-DD') AS "hearingDate",
      TO_CHAR(hd.Hearing_Time, 'HH24:MI') AS "hearingTime"
    FROM case_details cd
    LEFT JOIN hearing_details hd ON cd.Case_id = hd.Case_id
    LEFT JOIN stenographer_info st ON cd.Steno_Code = st.Steno_Code
    WHERE cd.judge_code = $1
    ORDER BY cd.Case_id ASC;
  `;

  try {
    const result = await db.query(query, [judgeCode]);
    res.json(result.rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

module.exports = router;
