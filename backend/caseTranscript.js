const express = require("express");
const router = express.Router();

/**
 * Returns FULL transcript for ordersheet generation.
 * If an edited segment exists, latest edited text is used.
 * Output is a SINGLE formatted string:
 * "SPEAKER: text"
 */
router.get("/:caseId", async (req, res) => {
    const db = req.db;
    const { caseId } = req.params;

    try {
        const query = `
      SELECT
        ot.speaker,
        COALESCE(et.edited_text, ot.message) AS final_text
      FROM original_transcript ot
      LEFT JOIN LATERAL (
        SELECT edited_text
        FROM edited_transcripts
        WHERE original_transcript_id = ot.id
        ORDER BY updated_at DESC
        LIMIT 1
      ) et ON true
      WHERE ot.case_id = $1
      ORDER BY ot.start_time ASC
    `;

        const { rows } = await db.query(query, [caseId]);

        // Format exactly how frontend wants
        const transcript = rows
            .map(r => `${r.speaker}: ${r.final_text}`)
            .join("\n");

        res.json({
            success: true,
            transcript
        });

    } catch (err) {
        console.error("❌ Fetch transcript for ordersheet failed:", err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
