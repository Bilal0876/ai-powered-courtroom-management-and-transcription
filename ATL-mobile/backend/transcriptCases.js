// routes/caseRoutes.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const db = req.db;
  const query = `
    SELECT cd.Case_id AS caseNumber, 
           cd.Case_Type AS caseType, 
           cd.Case_Title AS caseTitle, 
           cd.Case_Status AS status, 
           cd.Case_Party1 AS party1, 
           cd.Case_Party2 AS party2,
           t.Transcript AS transcript
    FROM case_details cd
    INNER JOIN transcript t ON cd.Case_id = t.Case_id;
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result);
  });
});

module.exports = router;
