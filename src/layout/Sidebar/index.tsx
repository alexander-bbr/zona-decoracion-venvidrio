// src/layout/Sidebar/index.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./sidebar.module.css";

export const Sidebar = () => {
  const { isAuthenticated, user, logout, hasPermission, hasAnyPermission } =
    useAuth();

  // Si NO está autenticado, muestra los siguientes links
  if (!isAuthenticated) {
    return (
      <nav className={styles.sidebar} id="sidebar">
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/sign-in">Iniciar Sesión</Link>
          </li>
        </ul>
      </nav>
    );
  }

  // Si está autenticado, muestra los siguientes links
  return (
    <nav className={styles.sidebar} id="sidebar">
      {/* === INFORMACIÓN DEL USUARIO ===*/}
      <section className={styles.userInfo}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-user"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>

        <p>
          {user?.nombres} {user?.apellidos}
        </p>
        <p>{user.rol}</p>
      </section>

      {/* === LINKS === */}
      <ul>
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
      </ul>

      {/* Cerrar sesión */}
      <button onClick={logout} className={styles.logoutButton}>
        Cerrar Sesión
      </button>
    </nav>
  );
};
