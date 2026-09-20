import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./sidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const { isAuthenticated, user, logout, hasPermission, hasAnyPermission } =
    useAuth();

  const sidebarClassName = `${styles.sidebar} ${
    isOpen ? styles.sidebarOpen : ""
  }`;

  // Si NO está autenticado, muestra los siguientes links
  if (!isAuthenticated) {
    return (
      <nav className={sidebarClassName} id="sidebar" aria-hidden={!isOpen}>
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
    <nav className={sidebarClassName} id="sidebar" aria-hidden={!isOpen}>
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
        <p>{user?.rol}</p>
      </section>

      {/* === LINKS === */}
      <ul>
        {/* Inicio */}
        <li>
          <Link to="/">Inicio</Link>
        </li>

        {/* Rendimiento - visible si tiene el permiso rendimiento ver */}
        {hasPermission("rendimiento", "ver") && (
          <li>
            <Link to="/rendimiento">Rendimiento</Link>
          </li>
        )}

        {/*Inventario - visible si tiene algún permiso de inventario_insumos */}
        {hasAnyPermission("inventario_insumos", ["ver_inventario"]) && (
          <li>
            <Link to="/inventario">Inventario</Link>
          </li>
        )}

        {/* Gestion Productiva - visible si tiene el permiso de (ver_produccion) */}
        {hasAnyPermission("gestion_productiva", ["ver_produccion"]) && (
          <li>
            <Link to="/gestion-productiva">Gestión Productiva</Link>
          </li>
        )}

        {/* Gestion de Moldes - visible si tiene el permiso de gestion_moldes (gestion_productiva) */}
        {hasAnyPermission("gestion_productiva", ["gestion_moldes"]) && (
          <li>
            <Link to="/gestion-moldes">Gestión de Moldes</Link>
          </li>
        )}

        {/* Gestion de Justificantes - visible si tiene el permiso de gestion_justificantes (gestion_productiva) */}
        {hasAnyPermission("gestion_productiva", ["gestion_justificantes"]) && (
          <li>
            <Link to="/gestion-justificantes">Gestión de Justificantes</Link>
          </li>
        )}

        {/* Gestión de Usuarios - visible si tiene el permiso de ver_usuarios (gestion_usuarios)*/}
        {hasAnyPermission("gestion_usuarios", ["ver_usuarios"]) && (
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
