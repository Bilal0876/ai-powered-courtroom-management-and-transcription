const Hearing = require('../models/hearingModel');

exports.getUnscheduledCases = async (req, res) => {
  try {
    const cases = await Hearing.findUnscheduled();
    res.json(cases);
  } catch (err) {
    console.error("❌ DB error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

exports.scheduleHearing = async (req, res) => {
  const { caseNumber, court, judge, stenographer, hearingDate, hearingTime } = req.body;
  try {
    await Hearing.schedule({ caseNumber, court, judge, stenographer, hearingDate, hearingTime });
    res.json({ success: true, message: "Hearing scheduled successfully" });
  } catch (err) {
    console.error("Error scheduling hearing:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getStenoHearings = async (req, res) => {
  const stenoCode = req.user.code;
  try {
    const hearings = await Hearing.findForSteno(stenoCode);
    res.json(hearings);
  } catch (err) {
    console.error("❌ DB error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

exports.getJudgeHearings = async (req, res) => {
  const judgeCode = req.user.code;
  try {
    const hearings = await Hearing.findForJudge(judgeCode);
    res.json(hearings);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
