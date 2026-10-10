import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./sidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const { isAuthenticated, user, logout, hasPermission, hasAnyPermission } =
    useAuth();

  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Helper: ¿esta ruta es la actual?
  const isActive = (path: string) => location.pathname === path;

  const toggleSubmenu = (key: string) => {
    setOpenSubmenu((prev) => (prev === key ? null : key));
  };

  const canSeeGestionProductiva = hasAnyPermission("gestion_productiva", [
    "ver_produccion",
  ]);
  const canSeeMoldes = hasAnyPermission("gestion_productiva", [
    "gestion_moldes",
  ]);
  const canSeeJustificantes = hasAnyPermission("gestion_productiva", [
    "gestion_justificantes",
  ]);
  const hasChildren = canSeeMoldes || canSeeJustificantes;

  // Abre el submenú si estás en una ruta hija
  useEffect(() => {
    const childRoutes = ["/gestion-moldes", "/gestion-justificantes"];
    if (childRoutes.includes(location.pathname)) {
      setOpenSubmenu("gestion-productiva");
    }
  }, [location.pathname]);

  const sidebarClassName = `${styles.sidebar} ${
    isOpen ? styles.sidebarOpen : ""
  }`;

  if (!isAuthenticated) {
    return (
      <nav className={sidebarClassName} id="sidebar" aria-hidden={!isOpen}>
        <ul>
          <li>
            <Link to="/" className={isActive("/") ? styles.activeLink : ""}>
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/sign-in"
              className={isActive("/sign-in") ? styles.activeLink : ""}
            >
              Iniciar Sesión
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className={sidebarClassName} id="sidebar" aria-hidden={!isOpen}>
      {/* === INFO USUARIO === */}
      <section className={styles.userInfo}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
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
        {/* === INICIO === */}
        <li>
          <Link to="/" className={isActive("/") ? styles.activeLink : ""}>
            Inicio
          </Link>
        </li>

        {/* === RENDIMIENTO === */}
        {hasPermission("rendimiento", "ver") && (
          <li>
            <Link
              to="/rendimiento"
              className={isActive("/rendimiento") ? styles.activeLink : ""}
            >
              Rendimiento
            </Link>
          </li>
        )}

        {/* === INVENTARIO DE INSUMOS === */}
        {hasAnyPermission("inventario_insumos", ["ver_inventario"]) && (
          <li>
            <Link
              to="/inventario-insumos"
              className={
                isActive("/inventario-insumos") ? styles.activeLink : ""
              }
            >
              Inventario de Insumos
            </Link>
          </li>
        )}

        {/* === INVENTARIO DE PANTALLAS === */}
        {hasAnyPermission("inventario_pantallas", ["ver_inventario"]) && (
          <li>
            <Link
              to="/inventario-pantallas"
              className={
                isActive("/inventario-pantallas") ? styles.activeLink : ""
              }
            >
              Inventario de Pantallas
            </Link>
          </li>
        )}

        {/* === GESTIÓN PRODUCTIVA (padre + submenú) === */}
        {canSeeGestionProductiva && (
          <li className={styles.submenuItem}>
            <div className={styles.parentRow}>
              <Link
                to="/gestion-productiva"
                className={`${styles.parentLink} ${
                  isActive("/gestion-productiva") ? styles.activeLink : ""
                }`}
              >
                Gestión Productiva
              </Link>

              {hasChildren && (
                <button
                  type="button"
                  className={styles.submenuToggle}
                  onClick={() => toggleSubmenu("gestion-productiva")}
                  aria-expanded={openSubmenu === "gestion-productiva"}
                  aria-label="Mostrar submenú"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${styles.chevron} ${
                      openSubmenu === "gestion-productiva"
                        ? styles.chevronOpen
                        : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              )}
            </div>

            {hasChildren && openSubmenu === "gestion-productiva" && (
              <ul className={styles.tree}>
                {canSeeMoldes && (
                  <li className={styles.treeItem}>
                    <Link
                      to="/gestion-moldes"
                      className={`${styles.treeLink} ${
                        isActive("/gestion-moldes") ? styles.activeLink : ""
                      }`}
                    >
                      Gestión de Moldes
                    </Link>
                  </li>
                )}

                {canSeeJustificantes && (
                  <li className={styles.treeItem}>
                    <Link
                      to="/gestion-justificantes"
                      className={`${styles.treeLink} ${
                        isActive("/gestion-justificantes")
                          ? styles.activeLink
                          : ""
                      }`}
                    >
                      Gestión de Justificantes
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </li>
        )}

        {/* Gestión de Usuarios */}
        {hasAnyPermission("gestion_usuarios", ["ver_usuarios"]) && (
          <li>
            <Link
              to="/gestion-usuarios"
              className={isActive("/gestion-usuarios") ? styles.activeLink : ""}
            >
              Gestión de Usuarios
            </Link>
          </li>
        )}
      </ul>

      <button onClick={logout} className={styles.logoutButton}>
        Cerrar Sesión
      </button>
    </nav>
  );
};
