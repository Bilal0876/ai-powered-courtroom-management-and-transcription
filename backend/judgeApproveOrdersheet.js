const express = require("express");
const multer = require("multer");
const supabase = require("./supabaseClient");

const router = express.Router();
const upload = multer(); // memory storage

router.post("/", upload.single("pdf"), async (req, res) => {
     const { id, content, judgeName, status } = req.body;

     if (!id || !content || !judgeName || !status) {
          return res.status(400).json({ success: false, message: "Missing data" });
     }

     const db = req.db;

     try {
          await db.query("BEGIN");

          let pdfUrl = null;

          // 1️⃣ Upload PDF only if approved
          if (status === "approved" && req.file) {
               const filePath = `ordersheets/Ordersheet_${id}.pdf`;

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
          }

          // 2️⃣ Update ordersheets
          const ordersheetResult = await db.query(
               `
      UPDATE ordersheets
      SET 
        content_html = $1,
        ordersheet_url = COALESCE($2, ordersheet_url)
      WHERE case_id = $3
      RETURNING id
      `,
               [content, pdfUrl, id]
          );

          if (ordersheetResult.rowCount === 0) {
               throw new Error("No submitted ordersheet found");
          }

          const ordersheetId = ordersheetResult.rows[0].ordersheet_id;

          // 3️⃣ Update ordersheets_approval
          await db.query(
               `
      UPDATE ordersheets_approval
      SET 
        status = $1,
        reviewed_by = $2,
        reviewed_at = NOW()
      WHERE case_id = $3
        AND ordersheet_id = $4
      `,
               [status, judgeName, id, ordersheetId]
          );

          // 4️⃣ Update case_details ONLY if approved
          if (status === "approved") {
               await db.query(
                    `
        UPDATE case_details
        SET 
          ordersheet = 'YES',
          case_status = 'Completed'
        WHERE case_id = $1
        `,
                    [id]
               );
          }

          await db.query("COMMIT");

          res.json({
               success: true,
               ordersheetId,
               pdfUrl
          });

     } catch (err) {
          await db.query("ROLLBACK");
          console.error("❌ Ordersheet approval failed:", err);

          res.status(500).json({
               success: false,
               message: err.message
          });
     }
});

module.exports = router;
