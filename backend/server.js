const express = require("express");
require('dotenv').config();
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");

// ✅ Validate required environment variables on startup
function validateEnvVariables() {
  const requiredVars = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missingVars = [];
  const warnings = [];

  // Check required variables
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Check optional but recommended variables
  if (!process.env.DB_PORT) {
    warnings.push('DB_PORT not set, using default: 5432');
  }

  if (!process.env.FRONTEND_URL && process.env.NODE_ENV === 'production') {
    warnings.push('⚠️ FRONTEND_URL not set in production - CORS may not work correctly');
  }

  // Log errors and warnings
  if (missingVars.length > 0) {
    console.error('\n❌ ERROR: Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Please set these variables in your .env file or environment.');
    console.error('💡 See backend/ENV_SETUP.md for details.\n');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️ WARNINGS:');
    warnings.forEach(warning => {
      console.warn(`   ${warning}`);
    });
    console.warn('');
  }

  // Success message
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Environment variables validated');
  }
}

// Run validation before starting server
validateEnvVariables();

// Import route files
const loginRoutes = require("./login");
const profileRoutes = require("./profileRoutes");
const registerUser = require("./registerUser");
const caseRoutes = require("./caseRoutes");
const addCase = require("./addCase");
const judgeCases = require("./judgeCases");
const judgePendingTranscript = require("./judgePendingTranscript");
const stenoHearings = require("./stenoHearing");
const stenoOrdersheetSelection = require("./stenoOrdersheetSelection");
const caseTranscript = require("./caseTranscript");
const scheduleHearing = require("./scheduleHearing");
const completedCasesRoute = require("./judgeCompletedCases");


const ordersheetAI = require("./ordersheetAI");
const saveTranscript = require("./saveTranscript");
const editedTranscript = require("./editedTranscript");
const submitTranscript = require("./submitApprovalTranscript");
const courtRoutes = require("./chiefJudgeAddCourt");
const courtTypes = require("./addCaseType");
const courts = require("./chiefJudgeViewCourts");

const caseTypes = require("./caseTypes");
const courtName = require("./courtName");
const judgesByCourt = require("./judgeNames");
const stenographersByCourt = require("./stenoNames");

const selectCase = require("./selectCase");

const app = express();

// ✅ Configure CORS with proper origin restrictions
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);

    // Get allowed origins from environment variable
    const allowedOrigins = process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : ['http://localhost:5173', 'http://localhost:3000']; // Default for development

    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      // In production, log the blocked origin for debugging
      if (process.env.NODE_ENV === 'production') {
        console.warn(`⚠️ CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/auth headers
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-role', 'x-user-code', 'x-judge-code', 'x-steno-code', 'x-cjudge-code', 'x-admin-code']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// ✅ Connect to PostgreSQL
const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});


db.connect((err) => {
  if (err) {
    console.error("❌ PostgreSQL connection error:", err);
    return;
  }
  console.log("✅ Connected to PostgreSQL Database");
});

// ✅ Pass DB to routes via middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use("/login", loginRoutes);
app.use("/profile", profileRoutes);
app.use("/register-user", registerUser);
app.use("/add-case", addCase);
app.use("/cases", caseRoutes);
app.use("/jcases", judgeCases);
app.use("/sthearings", stenoHearings);
app.use("/schedule-hearing", scheduleHearing);
app.use("/sthearingsOrdersheet", stenoOrdersheetSelection);
app.use("/transcriptForOrdersheet", caseTranscript);
app.use("/pending-transcripts", judgePendingTranscript);

app.use("/review-transcript", require("./judgeReviewTranscript"));
app.use("/save-edit", require("./judgeReviewEdit"));
app.use("/approve-transcript", require("./approveTranscript"));
app.use("/save-ordersheet", require("./stenoSaveOrdersheet"));
app.use("/pending-ordersheets", require("./judgePendingOrdersheet"));
app.use("/review-ordersheet", require("./judgeReviewOrdersheet"));
app.use("/approve-ordersheet", require("./judgeApproveOrdersheet"));
app.use("/steno-completed-cases", require("./stenoCompletedCases"));
app.use("/save-edit-name", require("./saveEditName"));

app.use("/api/ordersheet", ordersheetAI);
app.use("/save-transcript", saveTranscript);
app.use("/save-edited-transcript", editedTranscript);
app.use("/submit-for-approval", submitTranscript);
app.use("/completed-cases", completedCasesRoute);

app.use("/register-court", courtRoutes);
app.use("/add-type", courtTypes);
app.use("/view-courts", courts);
app.use("/assign-court-types", require("./assignType"));
app.use("/users-by-court", require("./allUsers"));
app.use("/chief-judge-download-case", require("./chiefJudgeDownloadCase"));
app.use("/cjcases", require("./cjcases"));
app.use("/delete-user", require("./deleteUser"));
app.use("/update-user", require("./updateUser"));
app.use("/update-case", require("./updateCase"));
app.use("/delete-case", require("./deleteCase"));
app.use("/download-cases-pdf", require("./downloadCases"));

app.use("/case-types", caseTypes);
app.use("/court-names", courtName);
app.use("/judges-by-court", judgesByCourt);
app.use("/stenographers-by-court", stenographersByCourt);
app.use("/upload-recording", require("./uploadHearingRecording"));

app.use("/admin-selectCase", require("./adminScheduleCase"));

app.use("/selectCase", selectCase);
app.use("/save-audio-url", require("./saveAudioUrl"));

app.use("/login-mobile", require("./loginMobile"));
app.use("/judge-profile", require("./judgeProfileMob"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173 (default)'}`);
});
