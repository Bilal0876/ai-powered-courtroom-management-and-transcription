const Transcript = require('../models/transcriptModel');
const supabase = require('../config/supabaseClient');

exports.saveTranscript = async (req, res) => {
  try {
    const transcript = await Transcript.create(req.body);
    res.json({ success: true, transcript });
  } catch (err) {
    console.error("DB ERROR:", err.message);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.approveTranscript = async (req, res) => {
  const { case_id, judge_name, judge_notes } = req.body;
  try {
    let pdfUrl = null;
    if (req.file) {
      const filePath = `transcripts/Transcript_${case_id}.pdf`;
      const { error } = await supabase.storage
        .from("Transcription_Files")
        .upload(filePath, req.file.buffer, { contentType: "application/pdf", upsert: true });
      if (error) throw error;
      pdfUrl = supabase.storage.from("Transcription_Files").getPublicUrl(filePath).data.publicUrl;
    }
    await Transcript.approve(case_id, judge_name, judge_notes, pdfUrl);
    res.json({ success: true, pdfUrl });
  } catch (err) {
    console.error("❌ Approve transcript failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTranscriptByCase = async (req, res) => {
  const { caseId } = req.params;
  try {
    const transcripts = await Transcript.findByCase(caseId);
    res.json(transcripts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.getPendingTranscripts = async (req, res) => {
    const judgeCode = req.user.code;
    try {
        const transcripts = await Transcript.findPending(judgeCode);
        res.json({ success: true, data: transcripts });
    } catch (err) {
        console.error("❌ DB error (pending transcripts):", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.getReviewTranscript = async (req, res) => {
    const { caseId } = req.params;
    try {
        const { status, rows } = await Transcript.getReviewData(caseId);
        res.json({ success: true, status, approved: status === "approved", segments: rows });
    } catch (err) {
        console.error("❌ Fetch review transcript failed:", err);
        res.status(500).json({ success: false });
    }
};

exports.submitTranscriptForApproval = async (req, res) => {
    const { case_id, submitted_by } = req.body;
    try {
        await Transcript.submitForApproval(case_id, submitted_by);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

exports.editTranscriptSegment = async (req, res) => {
    try {
        await Transcript.editSegment(req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};
