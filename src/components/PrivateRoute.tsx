import React from "react";
import { UseAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import "../App.css";

function PrivateRoute({ element: Element }: any) {
  const currentUser = UseAuth();

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return <Element />;
}

export default PrivateRoute;
