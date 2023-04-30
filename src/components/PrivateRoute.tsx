import React from "react";
import { UseAuth } from "../reducers/AuthContext";
import { Navigate } from "react-router-dom";
import "../App.css";

interface IObjectElement {
  element: React.FC;
}

function PrivateRoute({ element: Element }: IObjectElement) {
  const currentUser = UseAuth();

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return <Element />;
}

export default PrivateRoute;
