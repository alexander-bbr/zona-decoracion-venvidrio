import { useAuth } from "../contexts/AuthContext";

export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, user } = useAuth();

  return {
    can: (modulo: string, accion: string) => hasPermission(modulo, accion),
    canAny: (modulo: string, acciones: string[]) =>
      hasAnyPermission(modulo, acciones),
    permissions: user?.permisos || [],
  };
};
