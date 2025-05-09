import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = () => {
  const { loading, isAuth } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
