exports.loginValidation = (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: "Email, password, and role are required" });
  }
  next();
};

exports.registerUserValidation = (req, res, next) => {
  const { fullName, email, role, password, court } = req.body;
  if (!fullName || !email || !role || !password || !court) {
    return res.status(400).json({ success: false, message: "Full name, email, role, password, and court are required" });
  }
  next();
};

exports.addCaseValidation = (req, res, next) => {
  const { caseType, caseTitle, party1, party2 } = req.body;
  if (!caseType || !caseTitle || !party1 || !party2) {
    return res.status(400).json({ success: false, message: "Missing required case fields (caseType, caseTitle, party1, party2)" });
  }
  next();
};

exports.scheduleHearingValidation = (req, res, next) => {
    const { caseNumber, court, judge, stenographer, hearingDate, hearingTime } = req.body;
    if (!caseNumber || !court || !judge || !stenographer || !hearingDate || !hearingTime) {
        return res.status(400).json({ success: false, message: "All hearing scheduling fields are required" });
    }
    next();
};

exports.courtValidation = (req, res, next) => {
    const { courtName, courtLevel, courtCity } = req.body;
    if (!courtName || !courtLevel || !courtCity) {
        return res.status(400).json({ success: false, message: "Court name, level, and city are required" });
    }
    next();
};
