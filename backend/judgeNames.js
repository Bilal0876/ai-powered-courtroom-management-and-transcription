const express = require("express");
const router = express.Router();

router.get("/:courtId", async (req, res) => {
  try {
    const db = req.db;
    const { courtId } = req.params;

    const result = await db.query(
      `
      SELECT 
        judge_code,
        judge_name
      FROM judge_info
      WHERE judge_court = $1
      ORDER BY judge_name ASC
      `,
      [courtId]
    );

    const judges = result.rows.map((row) => ({
      judge_code: row.judge_code,
      judge_name: row.judge_name,
    }));

    res.json(judges);
  } catch (err) {
    console.error("Error fetching judges by court:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;