const express = require("express");
const router = express.Router();

/**
 * GET completed cases for a judge
 * Requires: x-judge-code header
 */
router.get("/", async (req, res) => {
     const stenoId = req.headers["x-steno-code"];

     if (!stenoId) {
          return res.status(401).json({
               success: false,
               message: "Stenographer authentication missing"
          });
     }

     try {
          const result = await req.db.query(`
            SELECT
                cd.case_id,
                cd.case_title,
                cd.case_type,
                cd.case_party1,
                cd.case_party2,
                cd.steno_code,
                cd.case_code,
                ji.judge_name,

                os.ordersheet_url,
                ta.transcript_url

            FROM case_details cd
            JOIN judge_info ji
                ON cd.judge_code = ji.judge_code

            LEFT JOIN ordersheets os
                ON os.case_id = cd.case_id
                AND os.status = 'approved'

            LEFT JOIN transcript_approval ta
                ON ta.case_id = cd.case_id
                AND ta.status = 'approved'

            WHERE cd.steno_code = $1
              AND os.ordersheet_url IS NOT NULL
              AND ta.transcript_url IS NOT NULL

            ORDER BY cd.case_id DESC
        `, [stenoId]);

          res.json({
               success: true,
               data: result.rows
          });

     } catch (err) {
          console.error("❌ Error fetching completed cases:", err);
          res.status(500).json({
               success: false,
               message: "Server error"
          });
     }
});

module.exports = router;
