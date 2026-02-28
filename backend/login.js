const express = require("express");
const router = express.Router();
const supabaseAdmin = require('./supabaseAdmin'); // Add this import
const { loginValidation } = require('./middleware/validation');

//  Login API with Role (Supabase Auth + PostgreSQL)
router.post("/", loginValidation, async (req, res) => {
  const { email, password, role } = req.body;
  const db = req.db;

  let table = "";
  let emailField = "";

  switch (role) {
    case "judge":
      table = "judge_info";
      emailField = "judge_email";
      break;
    case "chief-judge":
      table = "chief_judge_info";
      emailField = "chief_judge_email";
      break;
    case "stenographer":
      table = "stenographer_info";
      emailField = "steno_email";
      break;
    case "admin":
      table = "admin_info";
      emailField = "admin_email";
      break;
    default:
      return res.status(400).json({ success: false, message: "Invalid role" });
  }

  try {
    //  STEP 1: Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (authError) {
      console.error(" Supabase Auth error:", authError);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const authUid = authData.user.id;

    //  STEP 2: Verify user exists in the correct role table
    const query = `SELECT * FROM ${table} WHERE ${emailField} = $1 AND auth_uid = $2`;
    const result = await db.query(query, [email, authUid]);

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: `User not found in ${role} records`
      });
    }

    // STEP 3: Return success with user data and session
    res.json({
      success: true,
      message: "Login successful",
      user: result.rows[0],
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

module.exports = router;