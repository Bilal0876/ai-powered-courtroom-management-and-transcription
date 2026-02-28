const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

router.get("/", async (req, res) => {
     try {
          const db = req.db;

          // Fetch all cases with LEFT JOIN to include unscheduled ones
          const result = await db.query(`
            SELECT 
                cd.Case_id AS "caseNumber",
                cd.Case_Type AS "caseType",
                cd.Case_Title AS "caseTitle",
                cd.Case_Status AS "status",
                cd.Case_Party1 AS "party1",
                cd.Case_Party2 AS "party2",
                cd.case_code AS "caseCode",
                st.Steno_Name AS "stenographer",
                ji.judge_name AS "judge",
                ci.court_name AS "court",
                TO_CHAR(hd.Hearing_Date, 'YYYY-MM-DD') AS "hearingDate",
                TO_CHAR(hd.Hearing_Time, 'HH24:MI') AS "hearingTime"
            FROM case_details cd
            LEFT JOIN hearing_details hd ON cd.Case_id = hd.Case_id
            LEFT JOIN stenographer_info st ON cd.Steno_Code = st.Steno_Code
            LEFT JOIN judge_info ji ON cd.Judge_Code = ji.judge_Code
            LEFT JOIN court_info ci ON cd.court = ci.court_id
            ORDER BY ci.court_name ASC, cd.Case_id ASC
        `);

          const cases = result.rows;

          // Group cases by court
          const groupedByCourt = {};
          cases.forEach(c => {
               const courtName = c.court || "Unassigned Court";
               if (!groupedByCourt[courtName]) groupedByCourt[courtName] = [];
               groupedByCourt[courtName].push(c);
          });

          // Create PDF
          const doc = new PDFDocument({ margin: 40, size: "A4" });

          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", "attachment; filename=cases_report.pdf");

          doc.pipe(res);

          doc.fontSize(18).text("Automated Trial Log", { align: "center" }).moveDown(0.5);
          doc.fontSize(12).text("Case Report", { align: "center" }).moveDown(1.5);

          // Loop through courts
          Object.keys(groupedByCourt).forEach(courtName => {
               doc.fontSize(14).fillColor("green").text(`Court: ${courtName}`).moveDown(0.5);

               groupedByCourt[courtName].forEach(c => {
                    doc.fontSize(10)
                         .fillColor("black")
                         .text(`Case No: ${c.caseCode}`)
                         .text(`Title: ${c.caseTitle}`)
                         .text(`Type: ${c.caseType}`)
                         .text(`Parties: ${c.party1} vs ${c.party2}`)
                         .text(`Judge: Justice ${c.judge || "—"}`)
                         .text(`Stenographer: ${c.stenographer || "—"}`)
                         .text(`Hearing: ${c.hearingDate ? `${c.hearingDate} ${c.hearingTime || ""}` : "Not Scheduled"}`)
                         .text(`Status: ${c.status}`)
                         .moveDown(0.5);

                    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke().moveDown(0.5);
               });

               doc.addPage(); // start new page per court (optional)
          });

          doc.end();
     } catch (err) {
          console.error("PDF generation error:", err);
          res.status(500).json({ error: "Failed to generate PDF" });
     }
});

module.exports = router;
