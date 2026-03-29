import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import AdminBrowseCases from "./pages/AdminBrowseCase";
import AdminAddCase from "./pages/AdminAddCase";
import AdminViewUsers from "./pages/AdminViewUser";
import AdminManageUsers from "./pages/AdminUpdateUser";
import SignupPage from "./pages/AdminRegisterUser";
import AdminScheduleHearing from "./pages/AdminScheduleCases";

import JudgeDashboard from "./pages/JudgeDashboard";
import JudgeViewsCases from "./pages/JudgeCaseSchduele";
import JudgePendingTranscripts from "./pages/JudgeSelectsTranscriptApproval";
import JudgePendingOrdersheets from "./pages/JudgeSelectsOrdersheetApproval";
import JudgeReviewTranscript from "./pages/JudgeReviewTranscript";
import JudgeReviewOrdersheet from "./pages/JudgeReviewOrdersheet";
import JudgeDownloadCaseItems from "./pages/JudgeDownloadCaseItems";

import StenoDashboard from "./pages/StenographerDashboard";
import StenoViewsHearing from "./pages/StenoViewsHearing";
import StenoSelectsHearing from "./pages/StenoSelectsHearing";
import StenoSelectsHearingForOrdersheet from "./pages/StenoSelectCaseForOrdersheet";
import StenoSelectsHearingForOrdersheetAI from "./pages/StenoSelectCaseForOrdersheetAI";
import OrdersheetGeneration from "./pages/OrdersheetGeneration";
import OrdersheetGenerationAI from "./pages/OrdersheetGenerationAI";
import StenoViewsPreviousTranscript from "./pages/StenoViewsPreviousTranscript";
import StenoTranscript from "./pages/StenoTranscription";

import ChiefJudgeDashboard from "./pages/ChiefJudgeDashboard";
import ScheduleHearing from "./pages/ChiefJudgeScheduleCase";
import ChiefJudgeAddCase from "./pages/ChiefJudgeAddCase";
import ChiefJudgeAddUser from "./pages/ChiefJudgeAddUser";
import ChiefJudgeAddCourt from "./pages/ChiefJudgeAddCourt";
import ChiefJudgeAddCaseType from "./pages/ChiefJudgeAddCaseType";
import ChiefJudgeViewCourts from "./pages/ChiefJudgeViewCourts";
import ChiefJudgeAddTypeToCourt from "./pages/ChiefJudgeAddTypeToCourt";
import ChiefJudgeViewUsers from "./pages/ChiefJudgeViewUsers";
import ChiefJudgeUpdateUser from "./pages/ChiefJudgeUpdateUser";
import ChiefJudgeDownloadCaseItems from "./pages/ChiefJudgeDownloadCaseItems";
import ChiefJudgeViewsCases from "./pages/ChiefJudgeCases";
import ChiefJudgeManageCases from "./pages/ChiefJudgeUpdateCase";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactSupport from "./pages/ContactSupport";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact-support" element={<ContactSupport />} />


        <Route
          path="/admin-dash"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dash/browse-cases"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBrowseCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dash/register"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SignupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dash/add-case"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAddCase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dash/schedule-cases"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminScheduleHearing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dash/update-users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dash/view-users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminViewUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/judge-dash"
          element={
            <ProtectedRoute allowedRoles={["judge"]}>
              <JudgeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge-dash/view-cases"
          element={
            <ProtectedRoute allowedRoles={["judge"]}>
              <JudgeViewsCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge-dash/pending-transcripts"
          element={
            <ProtectedRoute allowedRoles={["judge"]}>
              <JudgePendingTranscripts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge-dash/review-transcripts"
          element={
            <ProtectedRoute allowedRoles={["judge"]}>
              <JudgeReviewTranscript />
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge-dash/pending-ordersheets"
          element={
            <ProtectedRoute allowedRoles={["judge"]}>
              <JudgePendingOrdersheets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge-dash/review-ordersheet"
          element={
            <ProtectedRoute allowedRoles={["judge"]}>
              <JudgeReviewOrdersheet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/judge-dash/download-case-items"
          element={
            <ProtectedRoute allowedRoles={["judge"]}>
              <JudgeDownloadCaseItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chiefJudge-dashboard"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/hearing-schedule"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ScheduleHearing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/add-cases"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeAddCase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/add-user"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeAddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/add-court"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeAddCourt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/add-type"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeAddCaseType />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/view-courts"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeViewCourts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/assign-type-to-court"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeAddTypeToCourt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/view-users"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeViewUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/download-case"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeDownloadCaseItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/view-cases"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeViewsCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/update-staff"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeUpdateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chiefJudge-dashboard/manage-cases"
          element={
            <ProtectedRoute allowedRoles={["chief-judge"]}>
              <ChiefJudgeManageCases />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stenographer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["stenographer"]}>
              <StenoDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stenographer-dashboard/view-hearings"
          element={
            <ProtectedRoute allowedRoles={["stenographer"]}>
              <StenoViewsHearing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stenographer-dashboard/view-transcripts"
          element={
            <ProtectedRoute allowedRoles={["stenographer"]}>
              <StenoViewsPreviousTranscript />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stenographer-dashboard/select-hearing"
          element={
            <ProtectedRoute allowedRoles={["stenographer"]}>
              <StenoSelectsHearing />
            </ProtectedRoute>
          }
        />


        <Route
          path="/stenographer-dashboard/case-for-ordersheet"
          element={
            <ProtectedRoute allowedRoles={["stenographer"]}>
              <StenoSelectsHearingForOrdersheet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stenographer-dashboard/case-for-ordersheet-ai"
          element={
            <ProtectedRoute allowedRoles={["stenographer"]}>
              <StenoSelectsHearingForOrdersheetAI />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stenographer-dashboard/case-transcript1"
          element={
            <ProtectedRoute allowedRoles={["stenographer"]}>
              <StenoTranscript />
            </ProtectedRoute>
          }
        />


        <Route
          path="/stenographer-dashboard/select-case-ordersheet/ordersheet-generation"
          element={
            <ProtectedRoute allowedRoles={["stenographer"]}>
              <OrdersheetGeneration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stenographer-dashboard/select-case-ordersheet/ordersheet-generation-ai"
          element={
            <ProtectedRoute allowedRoles={["stenographer"]}>
              <OrdersheetGenerationAI />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
