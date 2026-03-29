const db = require('../config/db');

exports.create = async (caseNumber, content, submittedBy) => {
    const result = await db.query(
      "INSERT INTO ordersheets (case_id, content_html) VALUES ($1, $2) RETURNING id",
      [caseNumber, content]
    );
    const ordersheetID = result.rows[0].id;
    await db.query(
      "INSERT INTO ordersheets_approval (case_id, ordersheet_id, submitted_by, status) VALUES ($1, $2, $3, 'submitted')",
      [caseNumber, ordersheetID, submittedBy || "stenographer"]
    );
    return ordersheetID;
};

exports.approve = async (case_id, judge_name, judge_notes) => {
    return await db.query(
      "UPDATE ordersheets_approval SET status = 'approved', reviewed_by = $1, reviewed_at = NOW(), judge_notes = $2 WHERE case_id = $3",
      [judge_name, judge_notes, case_id]
    );
};

exports.findPending = async (judgeCode) => {
    const query = `
        SELECT DISTINCT cd.Case_id AS case_id, cd.Case_code AS case_code, cd.Case_Type AS case_type, cd.Case_Title AS case_title,
                        cd.Case_Party1 AS party1, cd.Case_Party2 AS party2, si.Steno_Name AS submitted_by, os.created_at AS submitted_at
        FROM case_details cd
        JOIN stenographer_info si ON cd.steno_code = si.Steno_Code
        JOIN ordersheets_approval oa ON cd.Case_id = oa.case_id
        JOIN ordersheets os ON cd.Case_id = os.case_id
        WHERE cd.judge_code = $1 AND oa.status = 'submitted'
        ORDER BY os.created_at DESC;
    `;
    const result = await db.query(query, [judgeCode]);
    return result.rows;
};

exports.getReviewData = async (caseId) => {
    const result = await db.query(`
        SELECT * FROM ordersheets os
        JOIN case_details cd ON cd.case_id = os.case_id
        JOIN ordersheets_approval oa ON oa.case_id = cd.case_id
        WHERE os.case_id = $1 AND oa.status != 'approved';
    `, [caseId]);
    return result.rows[0];
};
