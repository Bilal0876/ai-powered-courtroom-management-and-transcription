const db = require('../config/db');

exports.create = async (data) => {
    const { case_id, speaker, start_time, end_time, message, original_language } = data;
    const result = await db.query(
      `INSERT INTO original_transcript (case_id, speaker, start_time, end_time, message, original_language)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [case_id, speaker, Number(start_time), Number(end_time), message, original_language]
    );
    return result.rows[0];
};

exports.approve = async (case_id, judge_name, judge_notes, pdfUrl) => {
    return await db.query(`
      INSERT INTO transcript_approval (case_id, status, reviewed_by, reviewed_at, judge_notes, transcript_url)
      VALUES ($1, 'approved', $2, NOW(), $3, $4)
      ON CONFLICT (case_id)
      DO UPDATE SET status = 'approved', reviewed_by = $2, reviewed_at = NOW(), judge_notes = $3, transcript_url = $4
    `, [case_id, judge_name, judge_notes || null, pdfUrl]);
};

exports.findByCase = async (caseId) => {
    const result = await db.query("SELECT * FROM original_transcript WHERE case_id = $1 ORDER BY start_time ASC", [caseId]);
    return result.rows;
};

exports.findPending = async (judgeCode) => {
    const query = `
        SELECT DISTINCT cd.Case_id AS case_id, cd.Case_code AS case_code, cd.Case_Type AS case_type, cd.Case_Title AS case_title,
                        cd.Case_Party1 AS party1, cd.Case_Party2 AS party2, si.Steno_Name AS submitted_by, ta.submitted_at AS submitted_at
        FROM case_details cd
        JOIN stenographer_info si ON cd.steno_code = si.Steno_Code
        JOIN transcript_approval ta ON cd.Case_id = ta.case_id
        WHERE cd.judge_code = $1 AND ta.status = 'submitted'
        ORDER BY ta.submitted_at DESC;
    `;
    const result = await db.query(query, [judgeCode]);
    return result.rows;
};

exports.getReviewData = async (caseId) => {
    const approvalRes = await db.query("SELECT status FROM transcript_approval WHERE case_id = $1", [caseId]);
    const status = approvalRes.rows[0]?.status || "draft";
    const query = `
        SELECT ot.id AS original_id, ot.speaker, ot.start_time, ot.end_time, ot.message AS original_text, ot.original_language,
               COALESCE(et.edited_text, ot.message) AS current_text, et.edited_by, et.role
        FROM original_transcript ot
        LEFT JOIN LATERAL (
            SELECT edited_text, edited_by, role FROM edited_transcripts
            WHERE original_transcript_id = ot.id ORDER BY updated_at DESC LIMIT 1
        ) et ON true
        WHERE ot.case_id = $1 ORDER BY ot.start_time ASC
    `;
    const transcriptRes = await db.query(query, [caseId]);
    return { status, rows: transcriptRes.rows };
};

exports.submitForApproval = async (case_id, submitted_by) => {
    await db.query(`
        INSERT INTO transcript_approval (case_id, status, submitted_by, submitted_at)
        VALUES ($1, 'submitted', $2, NOW()) ON CONFLICT (case_id) DO UPDATE SET status='submitted', submitted_by=$2, submitted_at=NOW()
    `, [case_id, submitted_by]);
    await db.query(`UPDATE case_details SET transcript = 'YES' WHERE case_id = $1`, [case_id]);
};

exports.editSegment = async (data) => {
    const { original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role } = data;
    await db.query('BEGIN');
    try {
        await db.query(`
            INSERT INTO edited_transcripts (original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [original_transcript_id, case_id, speaker, edited_text, start_time, end_time, edited_by, role]);
        await db.query(`
            INSERT INTO transcript_edit_history (original_transcript_id, previous_text, new_text, edited_by, role)
            SELECT id, message, $2, $3, $4 FROM original_transcript WHERE id=$1`, [original_transcript_id, edited_text, edited_by, role]);
        await db.query('COMMIT');
    } catch (err) {
        await db.query('ROLLBACK');
        throw err;
    }
};
