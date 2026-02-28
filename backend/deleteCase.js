const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./middleware/auth');
const { deleteCaseValidation } = require('./middleware/validation');

router.post("/", authenticateToken, requireRole(['admin']), deleteCaseValidation, async (req, res) => {
     const db = req.db;
     const { case_code } = req.body;

     try {
          await db.query(
               "DELETE FROM case_details WHERE case_code = $1",
               [case_code]
          );

          res.json({ success: true });
     } catch (err) {
          console.error("❌ Delete case error:", err);
          res.status(500).json({ error: "Delete failed" });
     }
});

module.exports = router;
