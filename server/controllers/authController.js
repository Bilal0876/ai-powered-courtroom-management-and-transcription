const supabaseAdmin = require('../config/supabaseAdmin');
const db = require('../config/db');

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

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
    const lowerEmail = email.toLowerCase();
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: lowerEmail,
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
    const query = `SELECT * FROM ${table} WHERE LOWER(${emailField}) = $1 AND auth_uid = $2`;
    const result = await db.query(query, [lowerEmail, authUid]);

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: `User not found in ${role} records`
      });
    }

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
};
