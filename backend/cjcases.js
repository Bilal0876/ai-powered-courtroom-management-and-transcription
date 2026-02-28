// routes/caseRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');

// ✅ Get all cases with hearing info (PostgreSQL)
router.get("/", authenticateToken, requireRole(['chief-judge', 'admin']), async (req, res) => {
     const db = req.db;

     const query = `
    SELECT 
      cd.Case_id AS "caseNumber",
      cd.Case_Type AS "caseType",
      cd.Case_Title AS "caseTitle",
      cd.Case_Status AS "status",
      cd.Case_Party1 AS "party1",
      cd.Case_Party2 AS "party2",
      cd.case_code AS "caseCode",
      st.Steno_Name AS "stenographer",
      ji.judge_name AS "judge",
      ci.court_name AS "court",
      TO_CHAR(hd.Hearing_Date, 'YYYY-MM-DD') AS "hearingDate",
      TO_CHAR(hd.Hearing_Time, 'HH24:MI') AS "hearingTime"
    FROM case_details cd
    LEFT JOIN hearing_details hd ON cd.Case_id = hd.Case_id
    LEFT JOIN stenographer_info st ON cd.Steno_Code = st.Steno_Code
    LEFT JOIN judge_info ji ON cd.Judge_Code = ji.judge_Code
     LEFT JOIN court_info ci ON cd.court = ci.court_id
    ORDER BY cd.Case_id ASC;
  `;

     try {
          const result = await db.query(query);
          res.json(result.rows);
     } catch (err) {
          console.error("DB error:", err);
          res.status(500).json({ message: "Database error", error: err });
     }
});

module.exports = router;
