const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');

/**
 * ✅ Get transcripts submitted for judge approval
 * Judge-specific
 */
router.get("/", authenticateToken, requireRole(['judge']), async (req, res) => {
     const db = req.db;
     const judgeCode = req.user.code;

     const query = `
    SELECT DISTINCT
      cd.Case_id              AS case_id,
      cd.Case_code              AS case_code,
      cd.Case_Type            AS case_type,
      cd.Case_Title           AS case_title,
      cd.Case_Party1          AS party1,
      cd.Case_Party2          AS party2,
      si.Steno_Name           AS submitted_by,
      ta.submitted_at         AS submitted_at
    FROM case_details cd
    JOIN judge_info ji
      ON cd.judge_code = ji.Judge_Code
    JOIN stenographer_info si
      ON cd.steno_code = si.Steno_Code
    JOIN transcript_approval ta
      ON cd.Case_id = ta.case_id
    WHERE
      cd.judge_code = $1
      AND ta.status = 'submitted'
    ORDER BY ta.submitted_at DESC;
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
