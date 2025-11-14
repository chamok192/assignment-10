import React, { useContext } from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthContext } from "../Provider/AuthContext";

import SpinnerSVG from "../components/SpinnerSVG";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <SpinnerSVG size={56} label="Checking authentication..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
