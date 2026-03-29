const db = require('../config/db');

exports.create = async (courtData) => {
  const { courtName, courtLevel, courtCity, courtAddress, courtPhone, courtStatus } = courtData;
  const result = await db.query(
    `INSERT INTO court_info (court_name, court_level, court_city, court_address, court_phone_number, court_status)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING court_id`,
    [courtName, courtLevel, courtCity, courtAddress || null, courtPhone || null, courtStatus || "Active"]
  );
  return result.rows[0].court_id;
};

exports.createCaseType = async (typeName, typeCode) => {
  const result = await db.query(
    "INSERT INTO court_type (type_name, court_type_code) VALUES ($1, $2) RETURNING type_id",
    [typeName, typeCode]
  );
  return result.rows[0].type_id;
};

exports.findAll = async () => {
  const result = await db.query("SELECT * FROM court_info ORDER BY court_name ASC");
  return result.rows;
};

exports.findActiveNames = async () => {
  const result = await db.query("SELECT court_id, court_name FROM court_info WHERE court_status = 'Active' ORDER BY court_name");
  return result.rows;
};

exports.findAllCaseTypes = async () => {
  const result = await db.query("SELECT type_id, type_name FROM court_type ORDER BY type_name");
  return result.rows;
};

exports.assignTypes = async (courtId, typeIds) => {
  await db.query("BEGIN");
  try {
    await db.query("DELETE FROM court_courttype WHERE court_id = $1", [courtId]);
    for (const typeId of typeIds) {
      await db.query("INSERT INTO court_courttype (court_id, type_id) VALUES ($1, $2)", [courtId, typeId]);
    }
    await db.query("COMMIT");
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  }
};
