import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./sidebar.module.css";

export const Sidebar = () => {
  const { isAuthenticated, user, logout, hasPermission, hasAnyPermission } =
    useAuth();

  // Si no está autenticado, solo mostramos el enlace de login
  if (!isAuthenticated) {
    return (
      <nav className={styles.sidebar} id="sidebar">
        <ul>
          <li>
            <Link to="/sign-in">Iniciar Sesión</Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className={styles.sidebar} id="sidebar">
      <ul>
        {/* Información del usuario */}
        <li className={styles.userInfo}>
          <strong>
            {user?.nombres} {user?.apellidos}
          </strong>
          <span className={styles.userRole}>{user.rol}</span>
        </li>

        <li className={styles.divider}></li>

        {/* Inicio */}
        <li>
          <Link to="/">Inicio</Link>
        </li>

        {/* Dashboard - visible si tiene permiso */}
        {hasPermission("dashboard", "ver") && (
          <li>
            <Link to="/rendimiento">Rendimiento</Link>
          </li>
        )}

        {/* Consumo de Pintura - visible si tiene algún permiso del módulo */}
        {hasAnyPermission("insumo_pintura", [
          "ver_inventario",
          "crear_registro",
          "crear_consumo",
          "ver_historial_consumo",
        ]) && (
          <li>
            <Link to="/consumo-pintura">Consumo de Pintura</Link>
          </li>
        )}

        {/* Producción Lisa - visible si tiene algún permiso del módulo */}
        {hasAnyPermission("produccion_lisa", [
          "ver_inventario",
          "crear_registro",
          "crear_salida",
          "ver_historial",
        ]) && (
          <li>
            <Link to="/produccion-lisa">Producción Lisa</Link>
          </li>
        )}

        {/* Gestión de Usuarios - visible solo si tiene permisos */}
        {hasAnyPermission("gestion_usuarios", [
          "ver_usuarios",
          "crear_editar",
        ]) && (
          <li>
            <Link to="/gestion-usuarios">Gestión de Usuarios</Link>
          </li>
        )}

        <li className={styles.divider}></li>

        {/* Cerrar sesión */}
        <li>
          <button onClick={logout} className={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};
