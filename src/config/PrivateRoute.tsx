import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: string | string[];
  requiredPermissions?: {
    modulo: string;
    accion: string;
  }[];
  requireAnyPermission?: boolean;
}

export const PrivateRoute = ({
  children,
  requiredRoles,
  requiredPermissions,
  requireAnyPermission = false, // Por defecto false (requiere todos)
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
    if (requireAnyPermission) {
      // Requiere AL MENOS UNO de los permisos
      const hasAnyPermission = requiredPermissions.some((p) =>
        hasPermission(p.modulo, p.accion),
      );
      if (!hasAnyPermission) {
        return <Navigate to="/unauthorized" replace />;
      }
    } else {
      // Requiere TODOS los permisos (comportamiento por defecto)
      const hasAllPermissions = requiredPermissions.every((p) =>
        hasPermission(p.modulo, p.accion),
      );
      if (!hasAllPermissions) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  return <>{children}</>;
};
