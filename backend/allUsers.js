const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const db = req.db;

  try {
    // 🔥 STEP 1: Get chief judge (1 query)
    const chiefJudgeQuery = `
      SELECT
        id,
        chief_judge_code AS code,
        chief_judge_name AS name,
        chief_judge_email AS email,
        chief_judge_cnic AS cnic,
        chief_judge_birthday AS birthday
      FROM chief_judge_info
      LIMIT 1
    `;
    const chiefJudgeResult = await db.query(chiefJudgeQuery);
    const chiefJudge = chiefJudgeResult.rows[0] || null;

    // 🔥 STEP 2: Get all courts (1 query)
    const courtsQuery = `
      SELECT court_id, court_name
      FROM court_info
      ORDER BY court_id
    `;
    const courtsResult = await db.query(courtsQuery);

    // 🔥 STEP 3: Get ALL judges at once (1 query instead of N)
    const allJudgesQuery = `
      SELECT
        id,
        judge_code AS code,
        judge_name AS name,
        judge_email AS email,
        judge_cnic AS cnic,
        judge_birthday AS birthday,
        judge_court AS court_id
      FROM judge_info
      ORDER BY judge_name
    `;
    const allJudges = (await db.query(allJudgesQuery)).rows;

    // 🔥 STEP 4: Get ALL stenographers at once (1 query instead of N)
    const allStenosQuery = `
      SELECT
        id,
        steno_code AS code,
        steno_name AS name,
        steno_email AS email,
        steno_cnic AS cnic,
        steno_birthday AS birthday,
        steno_court AS court_id
      FROM stenographer_info
      ORDER BY steno_name
    `;
    const allStenos = (await db.query(allStenosQuery)).rows;

    // 🔥 STEP 5: Get ALL admins at once (1 query instead of N)
    const allAdminsQuery = `
      SELECT
        id,
        admin_code AS code,
        admin_name AS name,
        admin_email AS email,
        admin_court AS court_id
      FROM admin_info
      ORDER BY admin_name
    `;
    const allAdmins = (await db.query(allAdminsQuery)).rows;

    // 🔥 STEP 6: Group users by court in JavaScript (fast, in-memory)
    const courts = courtsResult.rows.map(court => ({
      court_id: court.court_id,
      court_name: court.court_name,
      judges: allJudges.filter(j => j.court_id === court.court_id),
      stenographers: allStenos.filter(s => s.court_id === court.court_id),
      admins: allAdmins.filter(a => a.court_id === court.court_id)
    }));

    res.json({ chiefJudge, courts });

  } catch (err) {
    console.error("❌ users-by-court error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

module.exports = router;
