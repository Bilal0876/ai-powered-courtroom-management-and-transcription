const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const db = req.db;

  const {
    courtName,
    courtLevel,
    courtCity,
    courtAddress,
    courtPhone,
    courtStatus,
  } = req.body;

  // 🔴 Validation (mandatory fields)
  if (!courtName || !courtLevel || !courtCity) {
    return res.status(400).json({
      success: false,
      message: "Court name, level, and city are required",
    });
  }

  try {
    const insertQuery = `
      INSERT INTO court_info
      (court_name, court_level, court_city, court_address, court_phone_number, court_status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING court_id
    `;

    const result = await db.query(insertQuery, [
      courtName,
      courtLevel,
      courtCity,
      courtAddress || null,
      courtPhone || null,
      courtStatus || "Active",
    ]);

    res.json({
      success: true,
      message: "Court added successfully",
      court_id: result.rows[0].court_id,
    });
  } catch (err) {
    console.error("❌ Add court error:", err);
    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

module.exports = router;
