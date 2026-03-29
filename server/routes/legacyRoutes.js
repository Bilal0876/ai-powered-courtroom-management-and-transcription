const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const caseController = require("../controllers/caseController");
const userController = require("../controllers/userController");
const courtController = require("../controllers/courtController");
const hearingController = require("../controllers/hearingController");
const transcriptController = require("../controllers/transcriptController");
const ordersheetController = require("../controllers/ordersheetController");

// --- Legacy Auth ---
router.post("/login", authController.login);

// --- Legacy Users ---
router.post("/register-user", userController.registerUser);
router.get("/users-by-court", userController.getAllUsers);
router.post("/update-user", userController.updateUser);
router.post("/delete-user", userController.deleteUser);
router.post("/profile", userController.getProfile);
router.get("/judges-by-court/:court", userController.getJudgeNames);
router.get("/stenographers-by-court/:court", userController.getStenoNames);

// --- Legacy Courts ---
router.get("/view-courts", courtController.getAllCourts);
router.get("/court-names", courtController.getCourtNames);
router.get("/case-types", courtController.getAllCaseTypes);
router.post("/add-court", courtController.addCourt);
router.post("/add-case-type", courtController.addCaseType);
router.post("/assign-type-to-court", courtController.assignTypeToCourt);

// --- Legacy Cases ---
router.get("/cjcases", caseController.getChiefJudgeCases);
router.get("/all-cases", caseController.getAllCases);
router.post("/add-case", caseController.addCase);
router.post("/update-case", caseController.updateCase);
router.post("/delete-case", caseController.deleteCase);

// --- Legacy Hearings ---
router.get("/get-unscheduled-cases", hearingController.getUnscheduledCases);
router.post("/schedule-hearing", hearingController.scheduleHearing);

// --- Legacy Transcripts & Ordersheets ---
router.post("/save-transcript", transcriptController.saveTranscript);
router.post("/submit-for-approval", transcriptController.submitTranscriptForApproval);
router.get("/review-transcript/:caseId", transcriptController.getReviewTranscript);
router.get("/transcriptForOrdersheet/:caseId", transcriptController.getTranscriptByCase);
router.post("/save-ordersheet", ordersheetController.saveOrdersheet);

module.exports = router;
