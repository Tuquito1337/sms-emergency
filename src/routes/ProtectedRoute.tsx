import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore"; // Importa tu store de Zustand

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirige al login si no está autenticado
  }

  return children;
};

export default ProtectedRoute;
