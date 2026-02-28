// routes/profileRoutes.js
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, role } = req.body;
  const db = req.db;

  let table = "";
  let idField = "";
  let nameField = "";
  let emailField = "";
  let courtField = "";
  let codeField = "";

  const roleLower = role.toLowerCase();

  switch (roleLower) {
    case "judge":
      table = "judge_info";
      idField = "id";
      nameField = "judge_name";
      emailField = "judge_email";
      courtField = "judge_court";
      codeField = "judge_code";
      break;
    case "chief-judge":
      table = "chief_judge_info";
      idField = "id";
      nameField = "chief_judge_name";
      emailField = "chief_judge_email";
      courtField = "chief_judge_court";
      codeField = "chief_judge_code";
      break;
    case "stenographer":
      table = "stenographer_info";
      idField = "id";
      nameField = "steno_name";
      emailField = "steno_email";
      courtField = "steno_court";
      codeField = "steno_code";
      break;
    case "admin":
      table = "admin_info";
      idField = "id";
      nameField = "admin_name";
      emailField = "admin_email";
      courtField = "admin_court";
      codeField = "admin_code";
      break;
    default:
      return res.status(400).json({ success: false, message: "Invalid role" });
  }

  try {
    const query = `
      SELECT 
        t.${idField} AS "dbId", 
        t.${codeField} AS code, 
        t.${nameField} AS name, 
        t.${emailField} AS email, 
        c.Court_Name AS court 
      FROM ${table} t 
      JOIN court_info c 
      ON c.court_id = t.${courtField} 
      WHERE t.${emailField} = $1
    `;

    const result = await db.query(query, [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        success: true,
        user: {
          id: user.code,
          dbId: user.dbId,
          name: user.name,
          email: user.email,
          court: user.court,
          role,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("profileRoutes DB error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
});

module.exports = router;
