const express = require("express");
const router = express.Router();

router.post('/', async (req, res) => {
     const {
          original_transcript_id,
          case_id,
          speaker,
          edited_text,
          start_time,
          end_time,
          edited_by,
          role
     } = req.body;

     try {
          await req.db.query(
               `INSERT INTO edited_transcripts
            (original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
               [
                    original_transcript_id,
                    case_id,
                    speaker,
                    edited_text,
                    start_time,
                    end_time,
                    edited_by,
                    role
               ]
          );

          await req.db.query(
               `INSERT INTO transcript_edit_history
            (original_transcript_id, previous_text, new_text, edited_by, role)
            SELECT id, message, $2, $3, $4
            FROM original_transcript WHERE id=$1`,
               [original_transcript_id, edited_text, edited_by, role]
          );

          res.json({ success: true });
     } catch (err) {
          console.error(err);
          res.status(500).json({ success: false });
     }
});

module.exports = router;
