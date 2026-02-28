const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
     const { original_transcript_id, previous_text, new_text, edited_by, role } = req.body;

     try {
          await req.db.query(
               `INSERT INTO transcript_edit_history
             (original_transcript_id, previous_text, new_text, edited_by, role, edited_at)
             VALUES ($1, $2, $3, $4, $5, NOW())`,
               [original_transcript_id, previous_text, new_text, edited_by, role]
          );

          res.json({ success: true });
     } catch (err) {
          console.error("DB ERROR:", err.message);

     }
});

module.exports = router;
