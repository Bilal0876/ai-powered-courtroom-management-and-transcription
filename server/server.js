const express = require("express");
require('dotenv').config({ path: __dirname + '/.env' });
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db"); // Using centralized DB connection

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : ['http://localhost:5173', 'http://localhost:3000'];
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-role', 'x-user-code', 'x-judge-code', 'x-steno-code', 'x-cjudge-code', 'x-admin-code']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Pass DB to req if still needed by legacy routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
const authRoutes = require("./routes/authRoutes");
const caseRoutes = require("./routes/caseRoutes");
const userRoutes = require("./routes/userRoutes");
const courtRoutes = require("./routes/courtRoutes");
const transcriptRoutes = require("./routes/transcriptRoutes");
const ordersheetRoutes = require("./routes/ordersheetRoutes");
const hearingRoutes = require("./routes/hearingRoutes");
const legacyRoutes = require("./routes/legacyRoutes");

// Explicit legacy redirections (Priority)
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
app.post("/login", authController.login);
app.post("/register-user", userController.registerUser);

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/ordersheets", ordersheetRoutes);
app.use("/api/hearings", hearingRoutes);
app.use("/", legacyRoutes);
console.log("Global and legacy routes mounted");

app.get("/test", (req, res) => {
  res.send("API is working");
});

// Root route
app.get("/", (req, res) => {
  res.send("Courtroom Management API is running in MVC mode");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
