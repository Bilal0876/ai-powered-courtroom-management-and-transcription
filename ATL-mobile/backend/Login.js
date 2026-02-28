const express = require("express");
const router = express.Router();

// ✅ Login route
router.post("/", (req, res) => {
  const { email, password } = req.body;
  const db = req.db;

  const query = "SELECT * FROM judge_info WHERE Judge_Email = ? AND Password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ success: true, message: "Login successful", user });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  });
});

module.exports = router;