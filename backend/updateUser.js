const express = require("express");
const router = express.Router();
const supabaseAdmin = require('./supabaseAdmin');
const { authenticateToken, requireRole } = require('./middleware/auth');
const { updateUserValidation } = require('./middleware/validation');

router.post("/", authenticateToken, requireRole(['admin']), updateUserValidation, async (req, res) => {
    const db = req.db;

    const {
        role,
        code,
        name,
        email,
        cnic,
        birthday,
        court,
        password
    } = req.body;

    let table, codeColumn, emailColumn, nameColumn, courtColumn, birthdayColumn, cnicColumn;

    if (role === "stenographer") {
        table = "stenographer_info";
        codeColumn = "steno_code";
        emailColumn = "steno_email";
        nameColumn = "steno_name";
        courtColumn = "steno_court";
        birthdayColumn = "steno_birthday";
        cnicColumn = "steno_cnic";
    } else if (role === "judge") {
        table = "judge_info";
        codeColumn = "judge_code";
        emailColumn = "judge_email";
        nameColumn = "judge_name";
        courtColumn = "judge_court";
        birthdayColumn = "judge_birthday";
        cnicColumn = "judge_cnic";
    } else if (role === "chief-judge") {
        table = "chief_judge_info";
        codeColumn = "chief_judge_code";
        emailColumn = "chief_judge_email";
        nameColumn = "chief_judge_name";
        courtColumn = "chief_judge_court";
        birthdayColumn = "chief_judge_birthday";
        cnicColumn = "chief_judge_cnic";
    } else if (role === "admin") {
        table = "admin_info";
        codeColumn = "admin_code";
        emailColumn = "admin_email";
        nameColumn = "admin_name";
        courtColumn = "admin_court";
        birthdayColumn = "admin_birthday";
        cnicColumn = "admin_cnic";
    } else {
        return res.status(400).json({ error: "Invalid role" });
    }

    try {
        // STEP 1: Get the auth_uid for the user
        const getUserQuery = `SELECT auth_uid FROM ${table} WHERE ${codeColumn} = $1`;
        const userResult = await db.query(getUserQuery, [code]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const authUid = userResult.rows[0].auth_uid;

        // STEP 2: Update Supabase Auth if email, password, or name changed
        if (authUid && (email || password || name)) {
            const updatePayload = {};
            if (email) updatePayload.email = email;
            if (password) updatePayload.password = password;
            if (name) updatePayload.user_metadata = { full_name: name };

            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(authUid, updatePayload);
            if (authError) {
                console.error("❌ Supabase Auth update failed:", authError.message);
                return res.status(500).json({ error: "Failed to update authentication details", details: authError.message });
            }
            console.log(`Supabase Auth updated for ${role}: ${code}`);
        }

        //STEP 3: Update PostgreSQL
        let query;
        let values;

        if (role === "admin") {
            query = `
                UPDATE ${table}
                SET
                    ${nameColumn} = $1,
                    ${emailColumn} = $2,
                    ${courtColumn} = $3
                WHERE ${codeColumn} = $4
            `;
            values = [name, email, court, code];
        } else {
            query = `
                UPDATE ${table}
                SET
                    ${nameColumn} = $1,
                    ${emailColumn} = $2,
                    ${cnicColumn} = $3,
                    ${birthdayColumn} = $4,
                    ${courtColumn} = $5
                WHERE ${codeColumn} = $6
            `;
            values = [name, email, cnic, birthday, court, code];
        }

        await db.query(query, values);
        res.json({ success: true, message: "User updated successfully in database and auth system" });

    } catch (err) {
        console.error("❌ Update error:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

module.exports = router;
