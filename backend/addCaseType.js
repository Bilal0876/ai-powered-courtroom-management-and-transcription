const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const db = req.db;

    let { typeName, typeCode } = req.body;

    if (!typeName || !typeCode) {
        return res.status(400).json({
            success: false,
            message: "Case type and code required",
        });
    }

    typeCode = typeCode.toUpperCase().trim();

    typeName =
        typeName
            .toLowerCase()
            .trim()
            .replace(/^\w/, (c) => c.toUpperCase());

    try {
        const insertQuery = `
      INSERT INTO court_type
      (type_name, court_type_code)
      VALUES ($1, $2)
      RETURNING type_id
    `;

        const result = await db.query(insertQuery, [
            typeName,
            typeCode,
        ]);

        res.json({
            success: true,
            message: "Type added successfully",
            court_id: result.rows[0].court_id,
        });
    } catch (err) {
        console.error("❌ Add type error:", err);
        res.status(500).json({
            success: false,
            message: "Database error",
        });
    }
});

module.exports = router;
