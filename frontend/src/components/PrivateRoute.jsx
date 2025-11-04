import React from "react";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  const token = localStorage.getItem("authToken");
  // Verificamos que haya token (ya que el api.js se encarga de expiración)
  return token ? children : <Navigate to="/login" replace />;
}