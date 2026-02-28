// routes/caseTypes.js
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = req.db; // get db from middleware
    const result = await db.query(
      "SELECT type_id, type_name FROM court_type ORDER BY type_name ASC"
    );

    const caseTypes = result.rows.map((row) => ({
      id: row.type_id,
      name: row.type_name,
    }));

    res.json(caseTypes);
  } catch (err) {
    console.error("Error fetching case types:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
