// saveAudioUrl.js
const express = require("express");
const router = express.Router();

// Save audio URL to case_recording table
router.post("/", async (req, res) => {
     const { case_id, audio_url } = req.body;

     if (!case_id || !audio_url) {
          return res.status(400).json({
               success: false,
               message: "Missing case_id or audio_url",
          });
     }

     try {
          // First, check if a record exists for this case_id
          const checkQuery = `SELECT id FROM case_recording WHERE case_id = $1`;
          const checkResult = await req.db.query(checkQuery, [case_id]);

          let result;
          if (checkResult.rows.length > 0) {
               // Update existing record
               const updateQuery = `
                UPDATE case_recording 
                SET recording_url = $1 
                WHERE case_id = $2
                RETURNING *
            `;
               result = await req.db.query(updateQuery, [audio_url, case_id]);
          } else {
               // Insert new record
               const insertQuery = `
                INSERT INTO case_recording (case_id, recording_url)
                VALUES ($1, $2)
                RETURNING *
            `;
               result = await req.db.query(insertQuery, [case_id, audio_url]);
          }

          res.json({
               success: true,
               recording_url: audio_url,
               message: "Audio URL saved successfully",
          });
     } catch (err) {
          console.error("❌ Error saving audio URL:", err);
          res.status(500).json({
               success: false,
               message: err.message,
          });
     }
});

module.exports = router;
