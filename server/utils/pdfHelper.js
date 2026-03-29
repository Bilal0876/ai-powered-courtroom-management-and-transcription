const PDFDocument = require("pdfkit");

exports.generateCaseReport = (res, groupedByCourt) => {
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=cases_report.pdf");
  doc.pipe(res);
  
  doc.fontSize(18).text("Automated Trial Log", { align: "center" }).moveDown(0.5);
  doc.fontSize(12).text("Case Report", { align: "center" }).moveDown(1.5);

  Object.keys(groupedByCourt).forEach((courtName, index) => {
    if (index > 0) doc.addPage();
    doc.fontSize(14).fillColor("green").text(`Court: ${courtName}`).moveDown(0.5);
    groupedByCourt[courtName].forEach(c => {
      doc.fontSize(10).fillColor("black")
        .text(`Case No: ${c.caseCode}`).text(`Title: ${c.caseTitle}`).text(`Type: ${c.caseType}`)
        .text(`Parties: ${c.party1} vs ${c.party2}`).text(`Judge: Justice ${c.judge || "—"}`)
        .text(`Stenographer: ${c.stenographer || "—"}`).text(`Hearing: ${c.hearingDate ? `${c.hearingDate} ${c.hearingTime || ""}` : "Not Scheduled"}`)
        .text(`Status: ${c.status}`).moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke().moveDown(0.5);
    });
  });
  
  doc.end();
};
