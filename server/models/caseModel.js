const db = require('../config/db');

exports.findAll = async () => {
  const query = `
    SELECT 
      cd.Case_id AS "caseNumber",
      cd.Case_Type AS "caseType",
      cd.Case_Title AS "caseTitle",
      cd.Case_Status AS "status",
      cd.Case_Party1 AS "party1",
      cd.Case_Party2 AS "party2",
      cd.case_code AS "caseCode",
      cd.judge_code AS "judge_code",
      cd.steno_code AS "steno_code",
      ji.judge_name AS "judge",
      si.steno_name AS "steno",
      cd.court AS "court",
      cd.case_level AS "caseLevel",
      TO_CHAR(hd.Hearing_Date, 'YYYY-MM-DD') AS "hearingDate",
      TO_CHAR(hd.Hearing_Time, 'HH24:MI') AS "hearingTime"
    FROM case_details cd
    LEFT JOIN judge_info ji ON cd.judge_code = ji.Judge_Code
    LEFT JOIN stenographer_info si ON cd.steno_code = si.steno_Code
    LEFT JOIN hearing_details hd ON cd.Case_id = hd.Case_id
    ORDER BY cd.Case_id ASC;
  `;
  const result = await db.query(query);
  return result.rows;
};

exports.create = async (caseData) => {
  const { caseType, caseLevel, caseTitle, party1, party2, role, userCode } = caseData;
  await db.query("BEGIN");
  try {
    const typeResult = await db.query(`SELECT court_type_code FROM court_type WHERE type_name = $1`, [caseType]);
    if (typeResult.rowCount === 0) throw new Error("Invalid case type");
    const typeCode = typeResult.rows[0].court_type_code;
    const year = new Date().getFullYear();

    const insertResult = await db.query(
      `INSERT INTO case_details (case_type, case_level, case_title, case_party1, case_party2, created_by_role, created_by_code, case_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING case_id`,
      [caseType, caseLevel, caseTitle, party1, party2, role, userCode, "In-Progress"]
    );
    const caseId = insertResult.rows[0].case_id;
    const caseCode = `${typeCode}-${year}-${caseId}`;
    await db.query(`UPDATE case_details SET case_code = $1 WHERE case_id = $2`, [caseCode, caseId]);
    await db.query("COMMIT");
    return { caseId, caseCode };
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  }
};

exports.update = async (caseCode, fields) => {
  const updateFields = [];
  const updateValues = [];
  let paramIndex = 1;
  
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null && value !== "") {
      updateFields.push(`${key} = $${paramIndex++}`);
      updateValues.push(value);
    }
  }
  
  if (updateFields.length === 0) return null;
  
  updateValues.push(caseCode);
  const query = `UPDATE case_details SET ${updateFields.join(', ')} WHERE case_code = $${paramIndex}`;
  const result = await db.query(query, updateValues);
  return result.rowCount;
};

exports.delete = async (caseCode) => {
  await db.query("BEGIN");
  try {
    // 1. Get case_id from case_code
    const caseResult = await db.query("SELECT case_id FROM case_details WHERE case_code = $1", [caseCode]);
    
    if (caseResult.rowCount === 0) {
      await db.query("ROLLBACK");
      return 0;
    }
    
    const caseId = caseResult.rows[0].case_id;

    // 2. Delete from tables NOT covered by ON DELETE CASCADE
    // (hearing_details and transcript don't have CASCADE in the current schema)
    await db.query("DELETE FROM hearing_details WHERE case_id = $1", [caseId]);
    await db.query("DELETE FROM transcript WHERE case_id = $1", [caseId]);

    // 3. Delete from case_details (others will CASCADE)
    const result = await db.query("DELETE FROM case_details WHERE case_id = $1", [caseId]);
    
    await db.query("COMMIT");
    return result.rowCount;
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  }
};

exports.getDetailedReportData = async () => {
  const query = `
    SELECT cd.Case_id AS "caseNumber", cd.Case_Type AS "caseType", cd.Case_Title AS "caseTitle", cd.Case_Status AS "status",
           cd.Case_Party1 AS "party1", cd.Case_Party2 AS "party2", cd.case_code AS "caseCode", st.Steno_Name AS "stenographer",
           ji.judge_name AS "judge", ci.court_name AS "court", TO_CHAR(hd.Hearing_Date, 'YYYY-MM-DD') AS "hearingDate",
           TO_CHAR(hd.Hearing_Time, 'HH24:MI') AS "hearingTime"
    FROM case_details cd
    LEFT JOIN hearing_details hd ON cd.Case_id = hd.Case_id
    LEFT JOIN stenographer_info st ON cd.Steno_Code = st.Steno_Code
    LEFT JOIN judge_info ji ON cd.Judge_Code = ji.judge_Code
    LEFT JOIN court_info ci ON cd.court = ci.court_id
    ORDER BY ci.court_name ASC, cd.Case_id ASC
  `;
  const result = await db.query(query);
  return result.rows;
};

exports.findAllForChiefJudge = async () => {
  const result = await db.query(`SELECT * FROM case_details ORDER BY case_id DESC`);
  return result.rows;
};

exports.saveAudioUrl = async (caseId, audioUrl) => {
  const result = await db.query("UPDATE case_details SET audio_url = $1 WHERE case_id = $2", [audioUrl, caseId]);
  return result.rowCount;
};

exports.findAllCompleted = async () => {
  const query = `
    SELECT 
      cd.Case_id AS "caseNumber",
      cd.Case_Type AS "caseType",
      cd.Case_Title AS "caseTitle",
      cd.Case_Status AS "status",
      cd.Case_Party1 AS "party1",
      cd.Case_Party2 AS "party2",
      cd.case_code AS "caseCode",
      ji.judge_name AS "judge",
      si.steno_name AS "steno"
    FROM case_details cd
    LEFT JOIN judge_info ji ON cd.judge_code = ji.Judge_Code
    LEFT JOIN stenographer_info si ON cd.steno_code = si.steno_Code
    WHERE cd.Case_Status = 'Completed'
    ORDER BY cd.Case_id DESC;
  `;
  const result = await db.query(query);
  return result.rows;
};
