import { Navigate } from "react-router-dom";

function ProtectedRoute({ session, allowAnonymous = false, children }) {
  console.log("Session inside ProtectedRoute:", session);
  if (!session) {
    console.log("No session, navigating to /auth");
    return <Navigate to="/auth" />;
  }

  if (session.user.is_anonymous && !allowAnonymous) {
    console.log("Anonymous session but not allowed, navigating to /auth");
    return <Navigate to="/auth" />;
  }

  console.log("Allowed, rendering children");
  return children;
}

export default ProtectedRoute;
