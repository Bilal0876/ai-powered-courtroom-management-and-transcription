const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
     const { caseNumber, content, submittedBy } = req.body;

     if (!caseNumber || !content) {
          return res.status(400).json({ success: false, message: "Missing data" });
     }

     const client = req.db;

     try {
          // Insert into ordersheets and get the generated ordersheet_id
          const result = await client.query(
               `
      INSERT INTO ordersheets (case_id, content_html)
      VALUES ($1, $2)
      RETURNING id
      `,
               [caseNumber, content]
          );

          const ordersheetID = result.rows[0].id;

          // Insert into ordersheets_approval with the generated ordersheet_id
          await client.query(
               `
      INSERT INTO ordersheets_approval (case_id, ordersheet_id, submitted_by, status)
      VALUES ($1, $2, $3, 'submitted')
      `,
               [caseNumber, ordersheetID, submittedBy || "stenographer"]
          );

          res.json({ success: true, ordersheetID });
     } catch (err) {
          console.error("❌ Error creating ordersheet:", err);
          res.status(500).json({ success: false, error: err.message });
     }
});

module.exports = router;
