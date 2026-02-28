// routes/caseRoutes.js
const express = require("express");
const router = express.Router();

// ✅ Get all cases with hearing info
router.get("/", (req, res) => {
  const db = req.db;
  const query = `
    SELECT cd.Case_id AS caseNumber, 
    cd.Case_Type AS caseType, 
    cd.Case_Title AS caseTitle, 
    cd.Case_Status AS status, 
    cd.Case_Party1 AS party1, 
    cd.Case_Party2 AS party2, 
    st.Steno_Name AS stenographer, 
    DATE_FORMAT(hd.Hearing_Date, '%Y-%m-%d') AS hearingDate, 
    TIME_FORMAT(hd.Hearing_Time, '%H:%i') AS hearingTime 
    FROM case_details cd LEFT JOIN hearing_details hd ON cd.Case_id = hd.Case_id 
    LEFT JOIN stenographer_info st ON cd.Steno_Code = st.Steno_Code;
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(result);
  });
});

module.exports = router;