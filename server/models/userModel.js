const db = require('../config/db');

exports.checkEmailExists = async (table, emailField, email) => {
  const result = await db.query(`SELECT ${emailField} FROM ${table} WHERE LOWER(${emailField}) = LOWER($1)`, [email]);
  return result.rows.length > 0;
};

exports.create = async (table, data, codePrefix, codeColumn) => {
  const { fullName, email, cnic, birthDate, court, authUid } = data;
  
  let insertQuery, params;
  
  if (table === "admin_info") {
    // admin_info in this schema only has name, email, court, and auth_uid
    // admin_code was made nullable to allow this 2-step process
    insertQuery = `INSERT INTO ${table} (admin_name, admin_email, admin_court, auth_uid) VALUES ($1, $2, $3, $4) RETURNING id`;
    params = [fullName, email.toLowerCase(), court, authUid];
  } else {
    const prefix = table.split('_')[0];
    insertQuery = `INSERT INTO ${table} (${prefix}_name, ${prefix}_email, ${prefix}_cnic, ${prefix}_birthday, ${prefix}_court, auth_uid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    params = [fullName, email.toLowerCase(), cnic, birthDate, court, authUid];
  }

  await db.query("BEGIN");
  try {
    const insertResult = await db.query(insertQuery, params);
    const insertedId = insertResult.rows[0].id;
    const generatedCode = `${codePrefix}${String(insertedId).padStart(2, "0")}`;
    await db.query(`UPDATE ${table} SET ${codeColumn} = $1 WHERE id = $2`, [generatedCode, insertedId]);
    await db.query("COMMIT");
    return generatedCode;
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  }
};

exports.getSummaryByCourt = async () => {
  const chiefJudgeResult = await db.query(`SELECT id, chief_judge_code AS code, chief_judge_name AS name, chief_judge_email AS email, chief_judge_cnic AS cnic, chief_judge_birthday AS birthday FROM chief_judge_info LIMIT 1`);
  const chiefJudge = chiefJudgeResult.rows[0] || null;

  const courtsResult = await db.query(`SELECT court_id, court_name FROM court_info ORDER BY court_id`);
  const allJudges = (await db.query(`SELECT id, judge_code AS code, judge_name AS name, judge_email AS email, judge_cnic AS cnic, judge_birthday AS birthday, judge_court AS court_id FROM judge_info ORDER BY judge_name`)).rows;
  const allStenos = (await db.query(`SELECT id, steno_code AS code, steno_name AS name, steno_email AS email, steno_cnic AS cnic, steno_birthday AS birthday, steno_court AS court_id FROM stenographer_info ORDER BY steno_name`)).rows;
  const allAdmins = (await db.query(`SELECT id, admin_code AS code, admin_name AS name, admin_email AS email, admin_court AS court_id FROM admin_info ORDER BY admin_name`)).rows;

  const courts = courtsResult.rows.map(court => ({
    court_id: court.court_id,
    court_name: court.court_name,
    judges: allJudges.filter(j => j.court_id === court.court_id),
    stenographers: allStenos.filter(s => s.court_id === court.court_id),
    admins: allAdmins.filter(a => a.court_id === court.court_id)
  }));

  return { chiefJudge, courts };
};

exports.getAuthUid = async (table, key, code) => {
  const result = await db.query(`SELECT auth_uid FROM ${table} WHERE ${key} = $1`, [code]);
  return result.rows[0]?.auth_uid;
};

exports.delete = async (table, key, code) => {
  return await db.query(`DELETE FROM ${table} WHERE ${key} = $1`, [code]);
};

exports.update = async (table, codeColumn, code, fields) => {
  const updateFields = [];
  const updateValues = [];
  let paramIndex = 1;
  for (const [key, value] of Object.entries(fields)) {
     updateFields.push(`${key} = $${paramIndex++}`);
     updateValues.push(value);
  }
  updateValues.push(code);
  const query = `UPDATE ${table} SET ${updateFields.join(', ')} WHERE ${codeColumn} = $${paramIndex}`;
  return await db.query(query, updateValues);
};

exports.findProfileByEmail = async (table, emailField, codeField, nameField, email, courtField) => {
    const query = `SELECT t.id AS "dbId", t.${codeField} AS code, t.${nameField} AS name, t.${emailField} AS email, c.Court_Name AS court 
                   FROM ${table} t JOIN court_info c ON c.court_id = t.${courtField} WHERE LOWER(t.${emailField}) = LOWER($1)`;
    const result = await db.query(query, [email]);
    return result.rows[0];
};

exports.getJudgeList = async (courtId) => {
    let query = "SELECT judge_code, judge_name, judge_court FROM judge_info";
    const params = [];
    if (courtId) {
        query += " WHERE judge_court = $1";
        params.push(courtId);
    }
    query += " ORDER BY judge_name";
    const result = await db.query(query, params);
    return result.rows;
};

exports.getStenoList = async (courtId) => {
    let query = "SELECT steno_code, steno_name, steno_court FROM stenographer_info";
    const params = [];
    if (courtId) {
        query += " WHERE steno_court = $1";
        params.push(courtId);
    }
    query += " ORDER BY steno_name";
    const result = await db.query(query, params);
    return result.rows;
};
