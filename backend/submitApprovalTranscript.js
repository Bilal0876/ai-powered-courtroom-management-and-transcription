const express = require("express");
const router = express.Router();

router.post('/', async (req, res) => {
     const { case_id, submitted_by } = req.body;

     try {
          await req.db.query(
               `INSERT INTO transcript_approval (case_id, status, submitted_by, submitted_at)
             VALUES ($1, 'submitted', $2, NOW())
             ON CONFLICT (case_id) DO UPDATE
             SET status='submitted', submitted_by=$2, submitted_at=NOW()`,
               [case_id, submitted_by]
          );

          // 2️⃣ Update case_details table
          await req.db.query(
               `UPDATE case_details
             SET transcript = 'YES'
             WHERE case_id = $1`,
               [case_id]
          );

          res.json({ success: true });
     } catch (err) {
          console.error(err);
          res.status(500).json({ success: false });
     }
});

module.exports = router;
