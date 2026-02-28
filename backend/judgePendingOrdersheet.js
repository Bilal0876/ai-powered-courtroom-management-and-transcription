const express = require("express");
const router = express.Router();

/**
 * ✅ Get transcripts submitted for judge approval
 * Judge-specific
 */
router.get("/", async (req, res) => {
     const db = req.db;
     const judgeCode = req.headers["x-judge-code"];

     if (!judgeCode) {
          return res.status(400).json({ message: "Judge code missing" });
     }

     const query = `
    SELECT DISTINCT
      cd.Case_id              AS case_id,
      cd.Case_code              AS case_code,
      cd.Case_Type            AS case_type,
      cd.Case_Title           AS case_title,
      cd.Case_Party1          AS party1,
      cd.Case_Party2          AS party2,
      si.Steno_Name           AS submitted_by,
      os.created_at         AS submitted_at
    FROM case_details cd
    JOIN judge_info ji
      ON cd.judge_code = ji.Judge_Code
    JOIN stenographer_info si
      ON cd.steno_code = si.Steno_Code
    JOIN ordersheets_approval oa
      ON cd.Case_id = oa.case_id
    JOIN ordersheets os
      ON cd.Case_id = os.case_id  
    WHERE
      cd.judge_code = $1
      AND oa.status = 'submitted'
    ORDER BY os.created_at DESC;
  `;

     try {
          const result = await db.query(query, [judgeCode]);
          res.json({
               success: true,
               data: result.rows
          });
     } catch (err) {
          console.error("❌ DB error (pending transcripts):", err);
          res.status(500).json({
               success: false,
               message: "Database error"
          });
     }
});

module.exports = router;
