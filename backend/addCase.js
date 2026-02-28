const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');
const { addCaseValidation } = require('./middleware/validation');

router.post("/", authenticateToken, requireRole(['admin', 'chief-judge']), addCaseValidation, async (req, res) => {
  const db = req.db;

  /* 🔐 AUTH - Now from verified JWT token */
  const role = req.user.role;
  const userCode = req.user.code;

  /* 📦 BODY */
  const {
    caseType,
    caseTitle,
    caseLevel,
    party1,
    party2,
  } = req.body;

  try {
    await db.query("BEGIN");

    /* 1️⃣ GET COURT TYPE CODE */
    const typeResult = await db.query(
      `SELECT court_type_code FROM court_type WHERE type_name = $1`,
      [caseType]
    );

    if (typeResult.rowCount === 0) {
      throw new Error("Invalid case type");
    }

    const typeCode = typeResult.rows[0].court_type_code;
    const year = new Date().getFullYear();

    /* 2️⃣ INSERT CASE */
    const insertResult = await db.query(
      `
      INSERT INTO case_details
      (
        case_type,
        case_level,
        case_title,
        case_party1,
        case_party2,
        created_by_role,
        created_by_code,
        case_status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING case_id
      `,
      [
        caseType,
        caseLevel,
        caseTitle,
        party1,
        party2,
        role,
        userCode,
        "In-Progress",
      ]
    );

    const caseId = insertResult.rows[0].case_id;

    /* 3️⃣ BUILD CASE CODE */
    const caseCode = `${typeCode}-${year}-${caseId}`;

    /* 4️⃣ UPDATE CASE CODE */
    await db.query(
      `UPDATE case_details SET case_code = $1 WHERE case_id = $2`,
      [caseCode, caseId]
    );

    await db.query("COMMIT");

    res.json({
      success: true,
      message: "Case created successfully",
      caseId,
      caseCode,
    });

  } catch (err) {
    await db.query("ROLLBACK");

    console.error("❌ Error creating case:", err);

    res.status(500).json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  }
});

module.exports = router;
