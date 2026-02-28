// routes/selectCase.js
const express = require("express");
const router = express.Router();

// ✅ Get ONLY unscheduled cases
router.get("/", async (req, res) => {
     const db = req.db;

     const query = `
    SELECT 
      cd.case_id AS "caseNumber",
      cd.case_type AS "caseType",
      cd.case_title AS "caseTitle",
      cd.case_party1 AS "party1",
      cd.case_party2 AS "party2",
      cd.case_status AS "status",
      cd.case_level AS "caseLevel",
      cd.case_code AS "caseCode"
    FROM case_details cd
    LEFT JOIN hearing_details hd
      ON cd.case_id = hd.case_id
    WHERE hd.case_id IS NULL
      AND LOWER(cd.case_status) != 'scheduled'
      AND LOWER(cd.case_level) != 'high court'
    ORDER BY cd.case_id DESC
  `;

     try {
          const result = await db.query(query);
          res.json(result.rows);
     } catch (err) {
          console.error("❌ DB error:", err);
          res.status(500).json({
               message: "Database error",
               error: err.message,
          });
     }
});

module.exports = router;
