const express = require("express");
const router = express.Router();

/**
 * GET completed cases for a judge
 * Requires: x-judge-code header
 */
router.get("/", async (req, res) => {
     try {
          const result = await req.db.query(`
                        SELECT
    cd.case_id,
    cd.case_title,
    cd.case_type,
    cd.case_party1,
    cd.case_party2,
    cd.judge_code,

    os.ordersheet_url,
    ta.transcript_url,
    cr.recording_url

FROM case_details cd

JOIN ordersheets os
   ON os.case_id = cd.case_id

LEFT JOIN case_recording cr
   ON cr.case_id = cd.case_id

LEFT JOIN transcript_approval ta
   ON ta.case_id = cd.case_id
   AND ta.status = 'approved'

WHERE cd.case_status = 'Completed'

ORDER BY cd.case_id DESC;
        `);

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