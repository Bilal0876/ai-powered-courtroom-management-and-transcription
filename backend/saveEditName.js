const express = require("express");
const router = express.Router();

router.post('/', async (req, res) => {
     const {
          original_transcript_id,
          case_id,
          new_speaker,
          edited_text = null, // optional, in case text is also edited
          start_time = null,
          end_time = null,
          edited_by,
          role
     } = req.body;

     try {
          // 1️⃣ Insert into edited_transcripts
          await req.db.query(
               `INSERT INTO edited_transcripts
            (original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
               [
                    original_transcript_id,
                    case_id,
                    new_speaker,
                    edited_text,
                    start_time,
                    end_time,
                    edited_by,
                    role
               ]
          );

          // 2️⃣ Optionally insert into transcript_edit_history if text changed
          if (edited_text) {
               await req.db.query(
                    `INSERT INTO transcript_edit_history
                 (original_transcript_id, previous_text, new_text, edited_by, role)
                 SELECT id, message, $2, $3, $4
                 FROM original_transcript WHERE id=$1`,
                    [original_transcript_id, edited_text, edited_by, role]
               );
          }

          res.json({ success: true });
     } catch (err) {
          console.error(err);
          res.status(500).json({ success: false, message: err.message });
     }
});

module.exports = router;
