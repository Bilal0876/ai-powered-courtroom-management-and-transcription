import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

import AdminDashboard from "./AdminDashboard";
import AdminBrowseCases from "./AdminBrowseCase";
import AdminAddCase from "./AdminAddCase";
import AdminViewUsers from "./AdminViewUser";
import AdminManageUsers from "./AdminUpdateUser";
import SignupPage from "./AdminRegisterUser";
import AdminScheduleHearing from "./AdminScheduleCases";

import JudgeDashboard from "./JudgeDashboard";
import JudgeViewsCases from "./JudgeCaseSchduele";
import JudgePendingTranscripts from "./JudgeSelectsTranscriptApproval";
import JudgePendingOrdersheets from "./JudgeSelectsOrdersheetApproval";
import JudgeReviewTranscript from "./JudgeReviewTranscript";
import JudgeReviewOrdersheet from "./JudgeReviewOrdersheet";
import JudgeDownloadCaseItems from "./JudgeDownloadCaseItems";

import StenoDashboard from "./StenographerDashboard";
import StenoViewsHearing from "./StenoViewsHearing";
import StenoSelectsHearing from "./StenoSelectsHearing";
import StenoSelectsHearingForOrdersheet from "./StenoSelectCaseForOrdersheet";
import StenoSelectsHearingForOrdersheetAI from "./StenoSelectCaseForOrdersheetAI";
import OrdersheetGeneration from "./OrdersheetGeneration";
import OrdersheetGenerationAI from "./OrdersheetGenerationAI";
import StenoViewsPreviousTranscript from "./StenoViewsPreviousTranscript";
import StenoTranscript from "./StenoTranscription";

import ChiefJudgeDashboard from "./ChiefJudgeDashboard";
import ScheduleHearing from "./ChiefJudgeScheduleCase";
import ChiefJudgeAddCase from "./ChiefJudgeAddCase";
import ChiefJudgeAddUser from "./ChiefJudgeAddUser";
import ChiefJudgeAddCourt from "./ChiefJudgeAddCourt";
import ChiefJudgeAddCaseType from "./ChiefJudgeAddCaseType";
import ChiefJudgeViewCourts from "./ChiefJudgeViewCourts";
import ChiefJudgeAddTypeToCourt from "./ChiefJudgeAddTypeToCourt";
import ChiefJudgeViewUsers from "./ChiefJudgeViewUsers";
import ChiefJudgeUpdateUser from "./ChiefJudgeUpdateUser";
import ChiefJudgeDownloadCaseItems from "./ChiefJudgeDownloadCaseItems";
import ChiefJudgeViewsCases from "./ChiefJudgeCases";
import ChiefJudgeManageCases from "./ChiefJudgeUpdateCase";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import ContactSupport from "./ContactSupport";

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
