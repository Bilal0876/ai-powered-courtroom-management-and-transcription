const express = require("express");
const router = express.Router();

// ✅ Login route (PostgreSQL)
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const db = req.db; // pg Pool or Client

  try {
    const query = `
      SELECT *
      FROM judge_info
      WHERE judge_email = $1
        AND password = $2
    `;

    const result = await db.query(query, [email, password]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        success: true,
        message: "Login successful",
        user
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password"
      });
    }

  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
