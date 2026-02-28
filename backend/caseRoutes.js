// routes/caseRoutes.js
const express = require("express");
const router = express.Router();


// ✅ Get all cases with hearing info
router.get("/", async (req, res) => {
  const db = req.db;

  const query = `
    SELECT 
      cd.Case_id AS "caseNumber",
      cd.Case_Type AS "caseType",
      cd.Case_Title AS "caseTitle",
      cd.Case_Status AS "status",
      cd.Case_Party1 AS "party1",
      cd.Case_Party2 AS "party2",
      cd.case_code AS "caseCode",
      ji.judge_name AS "judge",
      si.steno_name AS "steno",
      TO_CHAR(hd.Hearing_Date, 'YYYY-MM-DD') AS "hearingDate",
      TO_CHAR(hd.Hearing_Time, 'HH24:MI') AS "hearingTime"
    FROM case_details cd
    LEFT JOIN judge_info ji ON cd.judge_code = ji.Judge_Code
    LEFT JOIN stenographer_info si ON cd.steno_code = si.steno_Code
    LEFT JOIN hearing_details hd ON cd.Case_id = hd.Case_id
    ORDER BY cd.Case_id ASC;
  `;

  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});


// // ✅ Add a new case with hearing
// router.post("/", async (req, res) => {
//   const db = req.db;
//   const { caseType, caseTitle, status, party1, party2, judge, hearingDate, hearingTime } = req.body;

//   try {
//     // Insert case & get new Case_id
//     const caseResult = await db.query(
//       `
//       INSERT INTO case_details
//       (Case_Type, Case_Title, Case_Status, Case_Party1, Case_Party2, Judge_Code)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING Case_id
//       `,
//       [caseType, caseTitle, status, party1, party2, judge]
//     );

//     const newCaseId = caseResult.rows[0].case_id;

//     // Insert hearing
//     await db.query(
//       `
//       INSERT INTO hearing_details
//       (Case_id, Hearing_Date, Hearing_Time)
//       VALUES ($1, $2, $3)
//       `,
//       [newCaseId, hearingDate, hearingTime]
//     );

//     res.json({ success: true, id: newCaseId });
//   } catch (err) {
//     console.error("Insert failed:", err);
//     res.status(500).json({ message: "Insert failed", error: err });
//   }
// });


// // ✅ Update a case and its hearing
// router.put("/:id", async (req, res) => {
//   const db = req.db;
//   const { caseType, caseTitle, status, party1, party2, judge, hearingDate, hearingTime } = req.body;

//   try {
//     await db.query(
//       `
//       UPDATE case_details
//       SET Case_Type=$1, Case_Title=$2, Case_Status=$3,
//           Case_Party1=$4, Case_Party2=$5, Judge_Code=$6
//       WHERE Case_id=$7
//       `,
//       [caseType, caseTitle, status, party1, party2, judge, req.params.id]
//     );

//     await db.query(
//       `
//       UPDATE hearing_details
//       SET Hearing_Date=$1, Hearing_Time=$2
//       WHERE Case_id=$3
//       `,
//       [hearingDate, hearingTime, req.params.id]
//     );

//     res.json({ success: true });
//   } catch (err) {
//     console.error("Update failed:", err);
//     res.status(500).json({ message: "Update failed", error: err });
//   }
// });


// // ✅ Delete a case and its hearing
// router.delete("/:id", async (req, res) => {
//   const db = req.db;

//   try {
//     await db.query("DELETE FROM hearing_details WHERE Case_id=$1", [req.params.id]);
//     await db.query("DELETE FROM case_details WHERE Case_id=$1", [req.params.id]);

//     res.json({ success: true });
//   } catch (err) {
//     console.error("Delete failed:", err);
//     res.status(500).json({ message: "Delete failed", error: err });
//   }
// });

module.exports = router;
