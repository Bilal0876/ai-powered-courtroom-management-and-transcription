const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');
const { updateCaseValidation } = require('./middleware/validation');

router.post("/", authenticateToken, requireRole(['admin', 'chief-judge']), updateCaseValidation, async (req, res) => {
     const db = req.db;

     const {
          case_code,
          case_type,
          case_title,
          case_status,
          case_party1,
          case_party2,
          steno_code,
          judge_code,
          court,
          case_level
     } = req.body;

     try {
          // Build dynamic UPDATE query - only update fields that are provided
          const updateFields = [];
          const updateValues = [];
          let paramIndex = 1;

          // Required fields
          updateFields.push(`case_type = $${paramIndex++}`);
          updateValues.push(case_type);

          updateFields.push(`case_title = $${paramIndex++}`);
          updateValues.push(case_title);

          updateFields.push(`case_status = $${paramIndex++}`);
          updateValues.push(case_status);

          updateFields.push(`case_party1 = $${paramIndex++}`);
          updateValues.push(case_party1);

          updateFields.push(`case_party2 = $${paramIndex++}`);
          updateValues.push(case_party2);

          // Optional fields - only update if provided (not empty string)
          if (steno_code !== undefined && steno_code !== null && steno_code !== "") {
               updateFields.push(`steno_code = $${paramIndex++}`);
               updateValues.push(steno_code);
          }

          if (judge_code !== undefined && judge_code !== null && judge_code !== "") {
               updateFields.push(`judge_code = $${paramIndex++}`);
               updateValues.push(judge_code);
          }

          if (court !== undefined && court !== null && court !== "") {
               updateFields.push(`court = $${paramIndex++}`);
               updateValues.push(court);
          }

          if (case_level !== undefined && case_level !== null && case_level !== "") {
               updateFields.push(`case_level = $${paramIndex++}`);
               updateValues.push(case_level);
          }

          // Add WHERE clause separately
          const whereClause = `WHERE case_code = $${paramIndex}`;
          updateValues.push(case_code);

          const updateQuery = `UPDATE case_details SET ${updateFields.join(', ')} ${whereClause}`;

          console.log("🔍 Update Query:", updateQuery);
          console.log("🔍 Update Values:", updateValues);

          const result = await db.query(updateQuery, updateValues);

          if (result.rowCount === 0) {
               return res.status(404).json({ success: false, error: "Case not found" });
          }

          res.json({ success: true, message: "Case updated successfully" });
     } catch (err) {
          console.error("❌ Update case error:", err);
          res.status(500).json({ success: false, error: "Update failed", details: err.message });
     }
});

module.exports = router;