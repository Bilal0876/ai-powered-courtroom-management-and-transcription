const User = require('../models/userModel');
const supabaseAdmin = require('../config/supabaseAdmin');

exports.registerUser = async (req, res) => {
  const { fullName, email, cnic, birthDate, court, role, password } = req.body;

  let table = "", codePrefix = "", codeColumn = "", emailField = "";
  if (role === "stenographer") { table = "stenographer_info"; codePrefix = "STN-"; codeColumn = "steno_code"; emailField = "steno_email"; }
  else if (role === "judge") { table = "judge_info"; codePrefix = "JDG-"; codeColumn = "judge_code"; emailField = "judge_email"; }
  else if (role === "chief-judge") { table = "chief_judge_info"; codePrefix = "CJD-"; codeColumn = "chief_judge_code"; emailField = "chief_judge_email"; }
  else if (role === "admin") { table = "admin_info"; codePrefix = "ADM-"; codeColumn = "admin_code"; emailField = "admin_email"; }
  else return res.status(400).json({ success: false, message: "Invalid role" });

  let authData = null;
  try {
    const exists = await User.checkEmailExists(table, emailField, email);
    if (exists) return res.status(409).json({ success: false, message: `A user with email ${email} already exists` });

    const authResult = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: fullName, role } });
    authData = authResult.data;
    if (authResult.error || !authData?.user?.id) throw new Error(authResult.error?.message || "Failed to create auth user");

    const authUid = authData.user.id;
    const generatedCode = await User.create(table, { fullName, email, cnic, birthDate, court, authUid }, codePrefix, codeColumn);

    res.json({ success: true, message: `${role} registered successfully!`, code: generatedCode, authUid });
  } catch (err) {
    if (authData?.user?.id) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id).catch(dErr => console.error("Failed to cleanup Supabase user:", dErr));
    }
    console.error("❌ Register error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail
    });
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: err.message,
      debugDetail: err.detail || err.hint || null 
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.getSummaryByCourt();
    res.json(data);
  } catch (err) {
    console.error("❌ users-by-court error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

exports.deleteUser = async (req, res) => {
    const { code, role } = req.body;
    let table, key;
    if (role === "judge") { table = "judge_info"; key = "judge_code"; }
    else if (role === "stenographer") { table = "stenographer_info"; key = "steno_code"; }
    else if (role === "admin") { table = "admin_info"; key = "admin_code"; }
    else return res.status(400).json({ error: "Invalid role" });

    try {
        const authUid = await User.getAuthUid(table, key, code);
        if (!authUid) return res.status(404).json({ success: false, message: "User not found" });

        await supabaseAdmin.auth.admin.deleteUser(authUid).catch(err => console.error("Supabase delete failed:", err.message));
        await User.delete(table, key, code);
        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        console.error("DELETE ERROR:", err);
        res.status(500).json({ success: false, message: "Database error", details: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const { role, code, name, email, cnic, birthday, court, password } = req.body;
    let table, codeColumn, emailColumn, nameColumn, courtColumn, birthdayColumn, cnicColumn;

    if (role === "stenographer") { table = "stenographer_info"; codeColumn = "steno_code"; emailColumn = "steno_email"; nameColumn = "steno_name"; courtColumn = "steno_court"; birthdayColumn = "steno_birthday"; cnicColumn = "steno_cnic"; }
    else if (role === "judge") { table = "judge_info"; codeColumn = "judge_code"; emailColumn = "judge_email"; nameColumn = "judge_name"; courtColumn = "judge_court"; birthdayColumn = "judge_birthday"; cnicColumn = "judge_cnic"; }
    else if (role === "chief-judge") { table = "chief_judge_info"; codeColumn = "chief_judge_code"; emailColumn = "chief_judge_email"; nameColumn = "chief_judge_name"; courtColumn = "chief_judge_court"; birthdayColumn = "chief_judge_birthday"; cnicColumn = "chief_judge_cnic"; }
    else if (role === "admin") { table = "admin_info"; codeColumn = "admin_code"; emailColumn = "admin_email"; nameColumn = "admin_name"; courtColumn = "admin_court"; }
    else return res.status(400).json({ success: false, message: "Invalid role" });

    try {
        const authUid = await User.getAuthUid(table, codeColumn, code);
        if (!authUid) return res.status(404).json({ success: false, message: "User not found" });

        const lowerEmail = email ? email.toLowerCase() : null;
        if (lowerEmail || password || name) {
            const updatePayload = {};
            if (lowerEmail) updatePayload.email = lowerEmail;
            if (password) updatePayload.password = password;
            if (name) updatePayload.user_metadata = { full_name: name };
            await supabaseAdmin.auth.admin.updateUserById(authUid, updatePayload);
        }

        const fields = role === "admin" ? { [nameColumn]: name, [emailColumn]: lowerEmail, [courtColumn]: court }
                                       : { [nameColumn]: name, [emailColumn]: lowerEmail, [cnicColumn]: cnic, [birthdayColumn]: birthday, [courtColumn]: court };

        await User.update(table, codeColumn, code, fields);
        res.json({ success: true, message: "User updated successfully" });
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json({ success: false, message: "Database error", details: err.message });
    }
};

exports.getProfile = async (req, res) => {
  const { email, role } = req.body;
  let table, codeField, nameField, emailField, courtField;
  const roleLower = role.toLowerCase();
  if (roleLower === "judge") { table = "judge_info"; codeField = "judge_code"; nameField = "judge_name"; emailField = "judge_email"; courtField = "judge_court"; }
  else if (roleLower === "chief-judge") { table = "chief_judge_info"; codeField = "chief_judge_code"; nameField = "chief_judge_name"; emailField = "chief_judge_email"; courtField = "chief_judge_court"; }
  else if (roleLower === "stenographer") { table = "stenographer_info"; codeField = "steno_code"; nameField = "steno_name"; emailField = "steno_email"; courtField = "steno_court"; }
  else if (roleLower === "admin") { table = "admin_info"; codeField = "admin_code"; nameField = "admin_name"; emailField = "admin_email"; courtField = "admin_court"; }
  else return res.status(400).json({ success: false, message: "Invalid role" });

  try {
    const user = await User.findProfileByEmail(table, emailField, codeField, nameField, email, courtField);
    if (user) res.json({ success: true, user: { id: user.code, dbId: user.dbId, name: user.name, email: user.email, court: user.court, role } });
    else res.status(404).json({ success: false, message: "User not found" });
  } catch (err) {
    console.error("profile DB error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getJudgeNames = async (req, res) => {
    const { court } = req.params;
    try {
        const queryCourt = (court === "0" || court === "all") ? null : court;
        const judges = await User.getJudgeList(queryCourt);
        res.json(judges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

exports.getStenoNames = async (req, res) => {
    const { court } = req.params;
    try {
        const queryCourt = (court === "0" || court === "all") ? null : court;
        const stenos = await User.getStenoList(queryCourt);
        res.json(stenos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};
