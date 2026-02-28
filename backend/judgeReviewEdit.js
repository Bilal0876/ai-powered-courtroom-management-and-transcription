// routes/judgeSaveEdit.js
const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');
const { editTranscriptValidation } = require('./middleware/validation');

router.post("/", authenticateToken, requireRole(['judge']), editTranscriptValidation, async (req, res) => {
     const db = req.db;

     const {
          original_transcript_id,
          case_id,
          edited_text,
          speaker,
          start_time,
          end_time,
          judge_name
     } = req.body;

     try {
          await db.query("BEGIN");

          // Get previous text (original OR last edit)
          const prevRes = await db.query(
               `
      SELECT
        COALESCE(et.edited_text, ot.message) AS previous_text
      FROM original_transcript ot
      LEFT JOIN edited_transcripts et
        ON et.original_transcript_id = ot.id
      WHERE ot.id = $1
      `,
               [original_transcript_id]
          );

          const previous_text = prevRes.rows[0].previous_text;

          // Upsert edited transcript
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
                    judge_name, // use passed judge name
                    'judge'
               ]
          );

          // Insert history ONLY if changed
          if (previous_text !== edited_text) {
               await db.query(
                    `
        INSERT INTO transcript_edit_history
          (original_transcript_id, previous_text, new_text, edited_by, role)
        VALUES ($1,$2,$3,$4,'judge')
        `,
                    [original_transcript_id, previous_text, edited_text, judge_name]
               );
          }

          await db.query("COMMIT");
          res.json({ success: true });
     } catch (err) {
          await db.query("ROLLBACK");
          console.error("❌ Judge save error:", err);
          res.status(500).json({ success: false });
     }
});

module.exports = router;
