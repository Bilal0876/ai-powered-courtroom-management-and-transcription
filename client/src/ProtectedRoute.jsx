import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    // 🚨 No login info → send to login page
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // 🚨 Logged in but wrong role → block access
    return <h1>❌ Unauthorized</h1>;
  }

  // ✅ Logged in and correct role
  console.log("ProtectedRoute → user:", user);
  return children;
}
