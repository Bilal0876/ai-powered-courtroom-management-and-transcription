// routes/admin.js
const express = require("express");
const supabaseAdmin = require('./supabaseAdmin');
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');
const { registerUserValidation } = require('./middleware/validation');

router.post("/", authenticateToken, requireRole(['admin']), registerUserValidation, async (req, res) => {
  const db = req.db;
  const { fullName, email, cnic, birthDate, court, role, password } = req.body;

  let table = "";
  let insertQuery = "";
  let codePrefix = "";
  let codeColumn = "";

  if (role === "stenographer") {
    table = "stenographer_info";
    codePrefix = "STN-";
    codeColumn = "steno_code";
    insertQuery = `
      INSERT INTO ${table}
      (steno_name, steno_email, steno_cnic, steno_birthday, steno_court, auth_uid)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
  }
  else if (role === "judge") {
    table = "judge_info";
    codePrefix = "JDG-";
    codeColumn = "judge_code";
    insertQuery = `
      INSERT INTO ${table}
      (judge_name, judge_email, judge_cnic, judge_birthday, judge_court, auth_uid)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
  }
  else if (role === "chief-judge") {
    table = "chief_judge_info";
    codePrefix = "CJD-";
    codeColumn = "chief_judge_code";
    insertQuery = `
      INSERT INTO ${table}
      (chief_judge_name, chief_judge_email, chief_judge_cnic, chief_judge_birthday, chief_judge_court, auth_uid)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
  } else if (role === "admin") {
    table = "admin_info";
    codePrefix = "ADM-";
    codeColumn = "admin_code";
    insertQuery = `
      INSERT INTO ${table}
      (admin_name, admin_email, admin_cnic, admin_birthday, admin_court, auth_uid)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
  }
  else {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  // Declare authData outside try block so it's accessible in catch block
  let authData = null;

  try {
    // ✅ STEP 0: Check if email already exists in our database first
    let emailField = "";
    if (role === "stenographer") emailField = "steno_email";
    else if (role === "judge") emailField = "judge_email";
    else if (role === "chief-judge") emailField = "chief_judge_email";
    else if (role === "admin") emailField = "admin_email";

    const emailCheckQuery = `SELECT ${emailField} FROM ${table} WHERE ${emailField} = $1`;
    const emailCheckResult = await db.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `A user with email ${email} already exists in the system`,
        error: "Email already registered"
      });
    }

    // 🔥 STEP 1: Create user in Supabase Auth
    const authResult = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
        role: role
      }
    });

    authData = authResult.data;
    const authError = authResult.error;

    // Check for errors - if error exists OR data/user is missing, fail
    if (authError || !authData || !authData.user || !authData.user.id) {
      console.error("❌ Supabase Auth error:", authError || "Missing user data");

      // Handle specific Supabase error codes
      let statusCode = 500;
      let errorMessage = "Failed to create user in authentication system";

      if (authError?.code === 'email_exists' || authError?.status === 422) {
        statusCode = 409; // Conflict
        errorMessage = `A user with email ${email} already exists in the authentication system`;
      } else if (authError?.message) {
        errorMessage = authError.message;
      }

      return res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: authError?.message || "Failed to create user in authentication system"
      });
    }

    const authUid = authData.user.id;

    // 🔥 STEP 2: Insert into PostgreSQL with auth_uid
    await db.query("BEGIN");

    const insertResult = await db.query(insertQuery, [
      fullName,
      email,
      cnic,
      birthDate,
      court,
      authUid // Store Supabase UID instead of password
    ]);

    const insertedId = insertResult.rows[0].id;
    const generatedCode = `${codePrefix}${String(insertedId).padStart(2, "0")}`;

    // Step 3: Update generated code
    const updateQuery = `
      UPDATE ${table}
      SET ${codeColumn} = $1
      WHERE id = $2
    `;

    await db.query(updateQuery, [generatedCode, insertedId]);

    await db.query("COMMIT");

    // ✅ Return immediately after sending success response to prevent further execution
    return res.json({
      success: true,
      message: `${role} registered successfully!`,
      code: generatedCode,
      authUid: authUid
    });
  } catch (err) {
    // Only rollback if transaction is still active
    try {
      await db.query("ROLLBACK");
    } catch (rollbackErr) {
      // Ignore rollback errors (transaction might already be committed)
      console.warn("⚠️ Rollback warning:", rollbackErr.message);
    }

    // 🔥 Cleanup: Delete from Supabase if PostgreSQL insert failed
    // Only cleanup if response hasn't been sent yet
    if (!res.headersSent && authData?.user?.id) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupErr) {
        console.error("❌ Cleanup error (Supabase user may already exist):", cleanupErr.message);
      }
    }

    console.error("❌ Register error:", err);

    // Only send error response if response hasn't been sent yet
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Database error", error: err.message });
    } else {
      // Response already sent, just log the error
      console.error("❌ Error occurred after response was sent:", err.message);
    }
  }
});

module.exports = router;