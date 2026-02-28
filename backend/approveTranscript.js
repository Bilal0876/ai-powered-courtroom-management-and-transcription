// routes/approveTranscript.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const supabase = require("./supabaseClient");
const { authenticateToken, requireRole } = require('./middleware/auth');

const upload = multer(); // memory storage

router.post("/", authenticateToken, requireRole(['judge']), upload.single("pdf"), async (req, res) => {
     const db = req.db;
     const { case_id, judge_name, judge_notes } = req.body;

     try {
          let pdfUrl = null;

          if (req.file) {
               const filePath = `transcripts/Transcript_${case_id}.pdf`;

               const { error } = await supabase.storage
                    .from("Transcription_Files")
                    .upload(filePath, req.file.buffer, {
                         contentType: "application/pdf",
                         upsert: true
                    });

               if (error) throw error;

               pdfUrl = supabase.storage
                    .from("Transcription_Files")
                    .getPublicUrl(filePath).data.publicUrl;
               console.log(pdfUrl);
          }

          await db.query(`
            INSERT INTO transcript_approval
                (case_id, status, reviewed_by, reviewed_at, judge_notes, transcript_url)
            VALUES
                ($1, 'approved', $2, NOW(), $3, $4)
            ON CONFLICT (case_id)
            DO UPDATE SET
                status = 'approved',
                reviewed_by = $2,
                reviewed_at = NOW(),
                judge_notes = $3,
                transcript_url = $4
        `, [case_id, judge_name, judge_notes || null, pdfUrl]);

          res.json({ success: true, pdfUrl });

     } catch (err) {
          console.error("❌ Approve transcript failed:", err);
          res.status(500).json({ success: false, error: err.message });
     }
});


module.exports = router;
