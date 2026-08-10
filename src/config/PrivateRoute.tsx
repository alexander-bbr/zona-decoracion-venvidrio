import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: string | string[];
  requiredPermissions?: {
    modulo: string;
    accion: string;
  }[];
}

export const PrivateRoute = ({
  children,
  requiredRoles,
  requiredPermissions,
}: PrivateRouteProps) => {
  const { isAuthenticated, hasRole, hasPermission, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // Verificar roles si se especifican
  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Verificar permisos si se especifican
  if (requiredPermissions) {
    const hasAllPermissions = requiredPermissions.every((p) =>
      hasPermission(p.modulo, p.accion),
    );
    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
