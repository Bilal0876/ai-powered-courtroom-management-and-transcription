// routes/caseTypes.js
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = req.db; // get db from middleware
    const result = await db.query(
      "SELECT court_id, court_name FROM court_info ORDER BY court_name ASC"
    );

    const courtNames = result.rows.map((row) => ({
      Cid: row.court_id,
      Cname: row.court_name,
    }));

    res.json(courtNames);
  } catch (err) {
    console.error("Error fetching case types:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
