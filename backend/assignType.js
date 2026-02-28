const express = require("express");
const router = express.Router();

router.get("/courts", async (req, res) => {
  const db = req.db;

  try {
    const result = await db.query(`
      SELECT court_id, court_name
      FROM court_info
      WHERE court_status = 'Active'
      ORDER BY court_name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch courts error:", err);
    res.status(500).json({ success: false });
  }
});

router.get("/types", async (req, res) => {
  const db = req.db;

  try {
    const result = await db.query(`
      SELECT type_id, type_name
      FROM court_type
      ORDER BY type_name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch types error:", err);
    res.status(500).json({ success: false });
  }
});

router.post("/", async (req, res) => {
  const db = req.db;
  const { courtId, typeIds } = req.body;

  if (!courtId || !Array.isArray(typeIds)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
    });
  }

  try {
    await db.query("BEGIN");

    // Remove previous assignments
    await db.query(
      `DELETE FROM court_courttype WHERE court_id = $1`,
      [courtId]
    );

    // Insert new assignments
    for (const typeId of typeIds) {
      await db.query(
        `INSERT INTO court_courttype (court_id, type_id)
         VALUES ($1, $2)`,
        [courtId, typeId]
      );
    }

    await db.query("COMMIT");

    res.json({
      success: true,
      message: "Case types assigned successfully",
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("❌ Assign types error:", err);
    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

module.exports = router;
