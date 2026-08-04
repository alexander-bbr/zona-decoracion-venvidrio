import { Outlet, NavLink, useLocation } from "react-router-dom";
import styles from "./produccion-lisa.module.css";

export const ProduccionLisa = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/produccion-lisa";

  /* Obtener el título para cada acción */
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("registrar")) return "Registrar Producción Lisa";
    if (path.includes("consumir")) return "Consumir Producción Lisa";
    if (path.includes("inventario")) return "Inventario de Producción Lisa";
  };

  return (
    <div className={styles.container}>
      {/* Título del módulo (siempre visible) */}
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Producción Lisa</h2>
        <p className={styles.moduleSubtitle}>
          {isRoot
            ? "Selecciona una opción para continuar"
            : "Gestión de producción Lisa"}
        </p>
      </header>

      {/* Si estamos en la raíz del módulo, mostramos las tarjetas */}
      {isRoot ? (
        <div className={`${styles.actions} content`}>
          <NavLink to="registrar" className={styles.actionCard}>
            <div className={styles.actionIcon}>📥</div>
            <h3>Registrar Producción Lisa</h3>
            <p>Registra la entrada de Producción Lisa al inventario</p>
          </NavLink>

          <NavLink to="consumir" className={styles.actionCard}>
            <div className={styles.actionIcon}>📤</div>
            <h3>Consumir Producción Lisa</h3>
            <p>Registra la salida de Producción Lisa del inventario</p>
          </NavLink>

          <NavLink to="inventario" className={styles.actionCard}>
            <div className={styles.actionIcon}>📦</div>
            <h3>Ver Inventario</h3>
            <p>Revisa el total de Producción Lisa en el inventario</p>
          </NavLink>
        </div>
      ) : (
        // * Si estamos en un submódulo, mostramos navegación secundaria + contenido
        <>
          <nav className={styles.subNav}>
            <NavLink
              to="/produccion-lisa"
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
