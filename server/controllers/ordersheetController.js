const Ordersheet = require('../models/ordersheetModel');

exports.saveOrdersheet = async (req, res) => {
  const { caseNumber, content, submittedBy } = req.body;
  if (!caseNumber || !content) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }
  try {
    const ordersheetID = await Ordersheet.create(caseNumber, content, submittedBy);
    res.json({ success: true, ordersheetID });
  } catch (err) {
    console.error("❌ Error creating ordersheet:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.approveOrdersheet = async (req, res) => {
  const { case_id, judge_name, judge_notes } = req.body;
  try {
    await Ordersheet.approve(case_id, judge_name, judge_notes);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPendingOrdersheets = async (req, res) => {
    const judgeCode = req.user.code;
    try {
        const data = await Ordersheet.findPending(judgeCode);
        res.json({ success: true, data });
    } catch (err) {
        console.error("❌ DB error (pending ordersheets):", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.getReviewOrdersheet = async (req, res) => {
    const { caseId } = req.params;
    try {
        const ordersheet = await Ordersheet.getReviewData(caseId);
        if (!ordersheet) return res.status(404).json({ success: false });
        res.json({ success: true, ordersheet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};
