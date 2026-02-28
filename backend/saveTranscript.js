// saveTranscript.js
const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');
const { saveTranscriptValidation } = require('./middleware/validation');

// Save a transcription
router.post("/", authenticateToken, requireRole(['stenographer']), saveTranscriptValidation, async (req, res) => {
     const { case_id, speaker, start_time, end_time, message, original_language } =
          req.body;

     try {
          const query = `
            INSERT INTO original_transcript
(case_id, speaker, start_time, end_time, message, original_language)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *`;

          const values = [
               case_id,
               speaker,
               Number(start_time),
               Number(end_time),
               message,
               original_language,
          ];

          const result = await req.db.query(query, values); // Use req.db
          res.json({ success: true, transcript: result.rows[0] });
     } catch (err) {
          console.error("DB ERROR:", err.message);

     }
});

module.exports = router;
