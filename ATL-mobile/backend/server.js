const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const loginRoutes = require("./Login");
const profileRoutes = require("./profileInfo");
const casesRoutes = require("./cases")
const transcriptRoutes = require("./transcriptCases")

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "automated_trial_log",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// ✅ Pass DB to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use("/login", loginRoutes);
app.use("/profile", profileRoutes);
app.use("/cases", casesRoutes)
app.use("/with-transcripts", transcriptRoutes);

// Start server
const PORT = 3010;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
