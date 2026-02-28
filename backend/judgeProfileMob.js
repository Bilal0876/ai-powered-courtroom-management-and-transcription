// routes/profileRoutes.js
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  role = "judge"
  const db = req.db; // pg Pool

  // Judge profile fields
  const table = "judge_info";
  const idField = "id";
  const nameField = "judge_name";
  const emailField = "judge_email";
  const courtField = "judge_court";
  const codeField = "judge_code";

  const query = `
    SELECT 
      t.${idField} AS "dbId",
      t.${codeField} AS "code",
      t.${nameField} AS "name",
      t.${emailField} AS "email",
      c.court_name AS "court"
    FROM ${table} t
    JOIN court_info c 
      ON c.court_id = t.${courtField}
    WHERE t.${emailField} = $1
  `;

  try {
    const result = await db.query(query, [email]);

    if (result.rows.length > 0) {
      const row = result.rows[0];

      res.json({
        success: true,
        user: {
          id: row.code,       // frontend compatibility
          dbId: row.dbId,
          name: row.name,
          email: row.email,
          court: row.court,
          role
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
  } catch (err) {
    console.error("profileRoutes DB error:", err);
    res.status(500).json({
      success: false,
      message: "Database error"
    });
  }
});

module.exports = router;
