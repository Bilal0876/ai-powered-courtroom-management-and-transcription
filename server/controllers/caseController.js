const Case = require('../models/caseModel');
const pdfHelper = require('../utils/pdfHelper');

exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.findAll();
    res.json(cases);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

exports.addCase = async (req, res) => {
  const role = req.user.role;
  const userCode = req.user.code;
  const { caseType, caseTitle, caseLevel, party1, party2 } = req.body;

  try {
    const { caseId, caseCode } = await Case.create({ caseType, caseLevel, caseTitle, party1, party2, role, userCode });
    res.json({ success: true, message: "Case created successfully", caseId, caseCode });
  } catch (err) {
    console.error("❌ Error creating case:", err);
    res.status(500).json({ success: false, message: "Database error", error: err.message });
  }
};

exports.updateCase = async (req, res) => {
    const { case_code, ...fields } = req.body;
    try {
        const rowCount = await Case.update(case_code, fields);
        if (rowCount === 0) return res.status(404).json({ success: false, error: "Case not found" });
        res.json({ success: true, message: "Case updated successfully" });
    } catch (err) {
        console.error("❌ Update case error:", err);
        res.status(500).json({ success: false, error: "Update failed", details: err.message });
    }
};

exports.deleteCase = async (req, res) => {
    const { case_code } = req.body;
    try {
        const rowCount = await Case.delete(case_code);
        if (rowCount === 0) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }
        res.json({ success: true, message: "Case deleted successfully" });
    } catch (err) {
        console.error("❌ Delete case error:", err);
        res.status(500).json({ success: false, message: "Delete failed", error: err.message });
    }
};

exports.downloadCasesReport = async (req, res) => {
  try {
    const cases = await Case.getDetailedReportData();
    const groupedByCourt = {};
    cases.forEach(c => {
        const courtName = c.court || "Unassigned Court";
        if (!groupedByCourt[courtName]) groupedByCourt[courtName] = [];
        groupedByCourt[courtName].push(c);
    });

    pdfHelper.generateCaseReport(res, groupedByCourt);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};

exports.getChiefJudgeCases = async (req, res) => {
    try {
        const cases = await Case.findAllForChiefJudge();
        res.json(cases);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

exports.saveHearingRecording = async (req, res) => {
    const { case_id, audio_url } = req.body;
    try {
        await Case.saveAudioUrl(case_id, audio_url);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

exports.getCompletedCasesForChiefJudge = async (req, res) => {
    try {
        const cases = await Case.findAllCompleted();
        res.json({ success: true, data: cases });
    } catch (err) {
        console.error("❌ Error fetching completed cases:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};
