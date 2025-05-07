import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/authContext";

const PrivateRoute = () => {
  const {loading, isAuth} = useAuth()


  if (loading) return <div>Loading...</div>;

  return isAuth ? <Outlet /> : <Navigate to="/login" />;  
};

export default PrivateRoute;
