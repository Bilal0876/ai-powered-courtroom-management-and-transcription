const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
    const db = req.db;

    const query = `
        SELECT
            ci.court_id,
            ci.court_name,
            ci.court_level,
            ci.court_city,
            ci.court_address,
            ci.court_status,
            COALESCE(
                STRING_AGG(ct.type_name, ', ' ORDER BY ct.type_name),
                ''
            ) AS case_types
        FROM court_info ci
        LEFT JOIN court_courttype cct ON ci.court_id = cct.court_id
        LEFT JOIN court_type ct ON cct.type_id = ct.type_id
        GROUP BY
            ci.court_id,
            ci.court_name,
            ci.court_level,
            ci.court_city,
            ci.court_address,
            ci.court_status
        ORDER BY ci.court_id asc;
    `;

    try {
        const result = await db.query(query);

        res.json(result.rows);
    } catch (err) {
        console.error("❌ Fetch courts error:", err);
        res.status(500).json({
            success: false,
            message: "Database error while fetching courts",
        });
    }
});

module.exports = router;
