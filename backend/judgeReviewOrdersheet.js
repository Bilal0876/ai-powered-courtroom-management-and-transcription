const express = require("express");
const router = express.Router();

router.get("/:caseId", async (req, res) => {
     const db = req.db;
     const { caseId } = req.params;

     try {
          const result = await req.db.query(
               `SELECT * FROM ordersheets os 
               JOIN case_details cd 
               ON cd.case_id = os.case_id 
               JOIN ordersheets_approval oa
               ON oa.case_id = cd.case_id
               WHERE os.case_id = $1
               AND oa.status != 'approved';`,
               [caseId]
          );

          if (!result.rows.length) {
               return res.status(404).json({ success: false });
          }

          res.json({ success: true, ordersheet: result.rows[0] });
     } catch (err) {
          console.error(err);
          res.status(500).json({ success: false });
     }
});

module.exports = router;
