// ProtectedRoute.jsx
import { Navigate } from "react-router";

const ProtectedRoute = ({ user, children }) => {
  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
