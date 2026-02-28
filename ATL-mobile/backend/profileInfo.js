// routes/profileRoutes.js
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const { email, role } = req.body;
    const db = req.db;

    let table = "";
    let idField = "";
    let nameField = "";
    let emailField = "";
    let courtField = "";
    let codeField = "";

    table = "judge_info";
    idField = "id";
    nameField = "Judge_Name";
    emailField = "Judge_Email";
    courtField = "Judge_Court";
    codeField = "Judge_Code";

    const query = `SELECT t.${idField} AS dbId, t.${codeField} AS code, t.${nameField} AS name, 
  t.${emailField} AS email, c.Court_Name AS court FROM ${table} t JOIN court_info c ON 
  c.court_id = t.${courtField} WHERE ${emailField} = ?`;

    db.query(query, [email], (err, result) => {
        if (err) {
            console.error("profileRoutes DB error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (result.length > 0) {
            // Return id as the code (so frontend's shape stays same as login)
            console.log("Profile result:", result[0]);
            res.json({
                success: true,
                user: {
                    id: result[0].code,
                    dbId: result[0].dbId,
                    name: result[0].name,
                    email: result[0].email,
                    court: result[0].court,
                    role,
                },
            });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    });
});

module.exports = router;