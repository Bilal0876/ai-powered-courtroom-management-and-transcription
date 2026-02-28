const express = require("express");
const multer = require("multer");
const supabase = require("./supabaseClient");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("recording"), async (req, res) => {
     const { case_id } = req.body;

     if (!case_id || !req.file) {
          return res.status(400).json({ success: false, message: "Missing data" });
     }

     try {
          const filePath = `recordings/hearing_${case_id}.webm`;

          // 1️⃣ Upload to Supabase
          const { error } = await supabase.storage
               .from("Transcription_Files")
               .upload(filePath, req.file.buffer, {
                    contentType: "audio/webm",
                    upsert: true
               });

          if (error) throw error;

          // 2️⃣ Get public URL
          const { data } = supabase.storage
               .from("Transcription_Files")
               .getPublicUrl(filePath);

          const recordingUrl = data.publicUrl;

          // 4️⃣ INSERT / UPDATE in case_recording ✅
          await req.db.query(
               `
            INSERT INTO case_recording (case_id, recording_url)
            VALUES ($1, $2)
            ON CONFLICT (case_id)
            DO UPDATE SET recording_url = EXCLUDED.recording_url
            `,
               [case_id, recordingUrl]
          );

          res.json({
               success: true,
               recording_url: recordingUrl
          });

     } catch (err) {
          console.error("❌ Recording upload failed:", err);
          res.status(500).json({ success: false, error: err.message });
     }
});

module.exports = router;
