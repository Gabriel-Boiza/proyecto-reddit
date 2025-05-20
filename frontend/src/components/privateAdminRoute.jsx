import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/adminContext"; 

const PrivateAdminRoute = () => {
  const { loading, isAuth } = useAdminAuth();
  const location = useLocation();

  if (loading) return <div>Loading admin...</div>;

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" state={{ from: location }} replace />
  );
};

export default PrivateAdminRoute;
