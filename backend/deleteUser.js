const express = require("express");
const router = express.Router();
const supabaseAdmin = require('./supabaseAdmin');
const { authenticateToken, requireRole } = require('./middleware/auth');
const { deleteUserValidation } = require('./middleware/validation');

router.post("/", authenticateToken, requireRole(['admin']), deleteUserValidation, async (req, res) => {
    const db = req.db;
    const { code, role } = req.body;

    let table, key;

    if (role === "judge") {
        table = "judge_info";
        key = "judge_code";
    } else if (role === "stenographer") {
        table = "stenographer_info";
        key = "steno_code";
    } else if (role === "admin") {
        table = "admin_info";
        key = "admin_code";
    } else {
        return res.status(400).json({ error: "Invalid role" });
    }

    try {
        // STEP 1: Get the auth_uid
        console.log(`Looking for user with ${key} = ${code}`);
        const getUserQuery = `SELECT auth_uid FROM ${table} WHERE ${key} = $1`;
        const userResult = await db.query(getUserQuery, [code]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const authUid = userResult.rows[0].auth_uid;

        // STEP 2: Delete from Supabase Auth FIRST (before database deletion)
        let supabaseDeleteSuccess = false;

        if (authUid) {
            try {
                const { data, error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(authUid);
                if (deleteAuthError) {
                    console.error("SUPABASE AUTH DELETE FAILED:");
                    console.error("Error message:", deleteAuthError.message);
                    console.error("Error code:", deleteAuthError.status);
                    console.error("Error object:", JSON.stringify(deleteAuthError, null, 2));
                } else {
                    console.log(" Successfully deleted from Supabase Auth");
                    supabaseDeleteSuccess = true;
                }
            } catch (supabaseErr) {
                console.error("Exception during Supabase Auth deletion:", supabaseErr);
                console.error("Exception details:", supabaseErr.message);
                console.warn("Continuing with database deletion despite Supabase Auth exception");
            }
        }
        // STEP 3: Delete from PostgreSQL
        console.log(` Deleting from PostgreSQL table: ${table}`);
        await db.query(`DELETE FROM ${table} WHERE ${key} = $1`, [code]);
        console.log("Successfully deleted from PostgreSQL");

        res.json({
            success: true,
            message: supabaseDeleteSuccess
                ? "User deleted from database and authentication system"
                : "User deleted from database" + (authUid ? " (Supabase Auth deletion failed - check logs)" : " (no auth record found)")
        });

    } catch (err) {
        console.error(" DELETE ERROR:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

module.exports = router;