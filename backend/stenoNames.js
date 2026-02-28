const express = require("express");
const router = express.Router();

router.get("/:courtId", async (req, res) => {
  try {
    const db = req.db;
    const { courtId } = req.params;

    const result = await db.query(
      `
      SELECT 
        steno_code,
        steno_name
      FROM stenographer_info
      WHERE steno_court = $1
      ORDER BY steno_name ASC
      `,
      [courtId]
    );

    const stenographers = result.rows.map((row) => ({
      steno_code: row.steno_code,
      steno_name: row.steno_name,
    }));

    res.json(stenographers);
  } catch (err) {
    console.error("Error fetching stenographers by court:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
