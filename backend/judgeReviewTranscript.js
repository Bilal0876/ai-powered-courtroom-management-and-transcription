// routes/judgeReviewTranscript.js
const express = require("express");
const router = express.Router();

router.get("/:caseId", async (req, res) => {
     const db = req.db;
     const { caseId } = req.params;

     try {
          // 1️⃣ Fetch approval status (if exists)
          const approvalRes = await db.query(
               `
      SELECT status
      FROM transcript_approval
      WHERE case_id = $1
      `,
               [caseId]
          );

          const status = approvalRes.rows[0]?.status || "draft";

          // 2️⃣ Fetch transcript with latest edit per segment
          const transcriptRes = await db.query(
               `
      SELECT
        ot.id AS original_id,
        ot.speaker,
        ot.start_time,
        ot.end_time,

        ot.message AS original_text,
        ot.original_language AS original_language,

        -- latest edited text (stenographer OR judge)
        COALESCE(et.edited_text, ot.message) AS current_text,
        et.edited_by,
        et.role

      FROM original_transcript ot

      LEFT JOIN LATERAL (
        SELECT
          edited_text,
          edited_by,
          role
        FROM edited_transcripts
        WHERE original_transcript_id = ot.id
        ORDER BY updated_at DESC
        LIMIT 1
      ) et ON true

      WHERE ot.case_id = $1
      ORDER BY ot.start_time ASC
      `,
               [caseId]
          );

          res.json({
               success: true,
               status,                 // 'draft' | 'submitted' | 'approved'
               approved: status === "approved",
               segments: transcriptRes.rows
          });

     } catch (err) {
          console.error("❌ Fetch transcript failed:", err);
          res.status(500).json({ success: false });
     }
});

module.exports = router;
