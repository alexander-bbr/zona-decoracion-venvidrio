import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./gestion-productiva.module.css";

export const GestionProductiva = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const isRoot = location.pathname === "/gestion-productiva";

  /* Obtener el título para cada acción */
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("produccion")) return "Producción";
    if (path.includes("moldes")) return "Moldes";
    return "";
  };

  // Definir los permisos para cada submódulo
  const permisos = {
    produccion: hasPermission("produccion_lisa", "ver_inventario"),
    moldes: hasPermission("produccion_lisa", "crear_registro"),
  };

  return (
    <div className={styles.container}>
      {/* Título del módulo (siempre visible) */}
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Gestión Productiva</h2>
        <p className={styles.moduleSubtitle}>
          {isRoot
            ? "Selecciona una opción para continuar"
            : "Gestión Productiva"}
        </p>
      </header>

      {/* Si estamos en la raíz del módulo, mostramos SOLO las tarjetas con permisos */}
      {isRoot ? (
        <div className={`${styles.actions} content`}>
          {/* Mostrar solo si tiene permiso de ver la produccion */}
          {permisos.produccion && (
            <NavLink to="produccion" className={styles.actionCard}>
              <div className={styles.actionIcon}>📤</div>
              <h3>Produccion</h3>
              <p>Gestiona la Producción de Zona Fría</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene permiso de registrar moldes */}
          {permisos.moldes && (
            <NavLink to="moldes" className={styles.actionCard}>
              <div className={styles.actionIcon}>📥</div>
              <h3>Moldes</h3>
              <p>Gestiona los Moldes utilizados en la Producción</p>
            </NavLink>
          )}
        </div>
      ) : (
        // Si estamos en un submódulo, mostramos navegación secundaria + contenido
        <>
          <nav className={styles.subNav}>
            <NavLink
              to="/gestion-productiva"
              className={({ isActive }) =>
                isActive
                  ? `${styles.subNavLink} ${styles.active}`
                  : styles.subNavLink
              }
            >
              ← Volver
            </NavLink>
            <span className={styles.subNavTitle}>{getTitle()}</span>
          </nav>

          <div className="content">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};
