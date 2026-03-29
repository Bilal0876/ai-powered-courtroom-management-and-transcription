const db = require('../config/db');

exports.findUnscheduled = async () => {
  const query = `
    SELECT 
      cd.case_id AS "caseNumber", cd.case_type AS "caseType", cd.case_title AS "caseTitle",
      cd.case_party1 AS "party1", cd.case_party2 AS "party2", cd.case_status AS "status",
      cd.case_level AS "caseLevel", cd.case_code AS "caseCode"
    FROM case_details cd
    LEFT JOIN hearing_details hd ON cd.case_id = hd.case_id
    WHERE hd.case_id IS NULL AND LOWER(cd.case_status) != 'scheduled' AND LOWER(cd.case_level) != 'high court'
    ORDER BY cd.case_id DESC
  `;
  const result = await db.query(query);
  return result.rows;
};

exports.schedule = async (data) => {
  const { caseNumber, court, judge, stenographer, hearingDate, hearingTime } = data;
  await db.query('BEGIN');
  try {
    await db.query(
      `UPDATE case_details SET court = $1, judge_code = $2, steno_code = $3, case_status = 'Scheduled' WHERE case_id = $4`,
      [court, judge, stenographer, caseNumber]
    );
    await db.query(
      `INSERT INTO hearing_details (case_id, hearing_date, hearing_time) VALUES ($1, $2, $3)`,
      [caseNumber, hearingDate, hearingTime]
    );
    await db.query('COMMIT');
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }
};

exports.findForSteno = async (stenoCode) => {
  const query = `
    SELECT cd.Case_id AS "caseNumber", cd.Case_Type AS "caseType", cd.Case_Title AS "caseTitle",
           cd.Case_Party1 AS "party1", cd.Case_Party2 AS "party2", cd.case_code AS "caseCode",
           ji.Judge_Name AS "judge", TO_CHAR(hd.Hearing_Date, 'YYYY-MM-DD') AS "hearingDate",
           TO_CHAR(hd.Hearing_Time, 'HH24:MI') AS "hearingTime"
    FROM case_details cd
    JOIN hearing_details hd ON cd.Case_id = hd.case_id
    JOIN judge_info ji ON cd.judge_code = ji.Judge_Code
    JOIN stenographer_info si ON cd.steno_code = si.Steno_Code
    WHERE cd.Steno_Code = $1 AND cd.court = si.steno_court AND cd.transcript = 'NO'
  `;
  const result = await db.query(query, [stenoCode]);
  return result.rows;
};

exports.findForJudge = async (judgeCode) => {
  const query = `
    SELECT cd.Case_id AS "caseNumber", cd.Case_Type AS "caseType", cd.Case_Title AS "caseTitle",
           cd.Case_Status AS "status", cd.Case_Party1 AS "party1", cd.Case_Party2 AS "party2",
           st.Steno_Name AS "stenographer", TO_CHAR(hd.Hearing_Date, 'YYYY-MM-DD') AS "hearingDate",
           TO_CHAR(hd.Hearing_Time, 'HH24:MI') AS "hearingTime"
    FROM case_details cd
    LEFT JOIN hearing_details hd ON cd.Case_id = hd.case_id
    LEFT JOIN stenographer_info st ON cd.Steno_Code = st.Steno_Code
    WHERE cd.judge_code = $1
    ORDER BY cd.Case_id ASC
  `;
  const result = await db.query(query, [judgeCode]);
  return result.rows;
};
