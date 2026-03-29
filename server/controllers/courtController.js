const Court = require('../models/courtModel');

exports.addCourt = async (req, res) => {
  const { courtName, courtLevel, courtCity, courtAddress, courtPhone, courtStatus } = req.body;
  if (!courtName || !courtLevel || !courtCity) {
    return res.status(400).json({ success: false, message: "Court name, level, and city are required" });
  }

  try {
    const courtId = await Court.create({ courtName, courtLevel, courtCity, courtAddress, courtPhone, courtStatus });
    res.json({ success: true, message: "Court added successfully", court_id: courtId });
  } catch (err) {
    console.error("❌ Add court error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.addCaseType = async (req, res) => {
  let { typeName, typeCode } = req.body;
  if (!typeName || !typeCode) {
    return res.status(400).json({ success: false, message: "Case type and code required" });
  }

  typeCode = typeCode.toUpperCase().trim();
  typeName = typeName.toLowerCase().trim().replace(/^\w/, (c) => c.toUpperCase());

  try {
    const typeId = await Court.createCaseType(typeName, typeCode);
    res.json({ success: true, message: "Type added successfully", type_id: typeId });
  } catch (err) {
    console.error("❌ Add type error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.getAllCourts = async (req, res) => {
  try {
    const courts = await Court.findAll();
    res.json(courts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.getCourtNames = async (req, res) => {
  try {
    const names = await Court.findActiveNames();
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.getAllCaseTypes = async (req, res) => {
  try {
      const types = await Court.findAllCaseTypes();
      res.json(types);
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.assignTypeToCourt = async (req, res) => {
  const { courtId, typeIds } = req.body;
  if (!courtId || !Array.isArray(typeIds)) {
    return res.status(400).json({ success: false, message: "Invalid payload" });
  }

  try {
    await Court.assignTypes(courtId, typeIds);
    res.json({ success: true, message: "Case types assigned successfully" });
  } catch (err) {
    console.error("❌ Assign types error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};
