import { Outlet, NavLink, useLocation } from "react-router-dom";
import styles from "./consumo-de-pintura.module.css";

export const ConsumoDePintura = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/consumo-pintura";

  /* Obtener el título para cada acción */
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("consumir")) return "Consumir Pintura";
    if (path.includes("suministrar")) return "Suministrar Pintura";
    if (path.includes("historialconsumo")) return "Historial de Consumo";
    if (path.includes("inventario")) return "Inventario de Pintura";
  };

  return (
    <div className={styles.container}>
      {/* Título del módulo (siempre visible) */}
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Consumo de Pintura</h2>
        <p className={styles.moduleSubtitle}>
          {isRoot
            ? "Selecciona una opción para continuar"
            : "Gestión de inventario de pintura"}
        </p>
      </header>

      {/* Si estamos en la raíz del módulo, mostramos las tarjetas */}
      {isRoot ? (
        <div className={styles.actions}>
          <NavLink to="/consumo-pintura/consumir" className={styles.actionCard}>
            <div className={styles.actionIcon}>📤</div>
            <h3>Consumir Pintura</h3>
            <p>Registra la salida de pintura del inventario</p>
          </NavLink>

          <NavLink
            to="/consumo-pintura/suministrar"
            className={styles.actionCard}
          >
            <div className={styles.actionIcon}>📥</div>
            <h3>Suministrar Pintura</h3>
            <p>Registra la entrada de pintura al inventario</p>
          </NavLink>

          <NavLink
            to="/consumo-pintura/historialconsumo"
            className={styles.actionCard}
          >
            <div className={styles.actionIcon}>📋</div>
            <h3>Historial de Consumo</h3>
            <p>Revisa el historial de consumo de pintura</p>
          </NavLink>

          <NavLink
            to="/consumo-pintura/inventario"
            className={styles.actionCard}
          >
            <div className={styles.actionIcon}>📦</div>
            <h3>Ver Inventario</h3>
            <p>Revisa la cantidad de pintura en el inventario</p>
          </NavLink>
        </div>
      ) : (
        // * Si estamos en un submódulo, mostramos navegación secundaria + contenido
        <>
          <nav className={styles.subNav}>
            <NavLink
              to="/consumo-pintura"
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

          <div className={styles.content}>
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};
