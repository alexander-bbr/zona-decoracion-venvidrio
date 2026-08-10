import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si ya está autenticado y trata de ir a una ruta pública,
  // lo redirigimos al Home
  if (isAuthenticated) {
    // Verificar si la ruta actual es /sign-in
    const currentPath = window.location.pathname;
    if (currentPath === "/sign-in") {
      return <Navigate to="/" replace />;
    }
    // Si está en /sign-in y ya está autenticado, va a Home
    return <>{children}</>;
  }

  return <>{children}</>;
};
