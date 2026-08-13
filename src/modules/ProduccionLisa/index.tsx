import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./produccion-lisa.module.css";

export const ProduccionLisa = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const isRoot = location.pathname === "/produccion-lisa";

  /* Obtener el título para cada acción */
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("registrar")) return "Registrar Producción Lisa";
    if (path.includes("consumir")) return "Consumir Producción Lisa";
    if (path.includes("historial")) return "Historial de Movimiento";
    if (path.includes("inventario")) return "Inventario de Producción Lisa";
    return "";
  };

  // Definir los permisos para cada submódulo
  const permisos = {
    registrar: hasPermission("produccion_lisa", "crear_registro"),
    consumir: hasPermission("produccion_lisa", "crear_salida"),
    historial: hasPermission("produccion_lisa", "ver_historial"),
    inventario: hasPermission("produccion_lisa", "ver_inventario"),
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

      {/* Si estamos en la raíz del módulo, mostramos SOLO las tarjetas con permisos */}
      {isRoot ? (
        <div className={`${styles.actions} content`}>
          {/* Mostrar solo si tiene permiso para consumir */}
          {permisos.consumir && (
            <NavLink to="consumir" className={styles.actionCard}>
              <div className={styles.actionIcon}>📤</div>
              <h3>Consumir Producción Lisa</h3>
              <p>Registra la salida de Producción Lisa del inventario</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene permiso para registrar */}
          {permisos.registrar && (
            <NavLink to="registrar" className={styles.actionCard}>
              <div className={styles.actionIcon}>📥</div>
              <h3>Registrar Producción Lisa</h3>
              <p>Registra la entrada de Producción Lisa al inventario</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene permiso para ver historial */}
          {permisos.historial && (
            <NavLink to="historial" className={styles.actionCard}>
              <div className={styles.actionIcon}>📋</div>
              <h3>Historial de Movimiento</h3>
              <p>Revisa el historial de movimiento de la Producción Lisa</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene permiso para ver inventario */}
          {permisos.inventario && (
            <NavLink to="inventario" className={styles.actionCard}>
              <div className={styles.actionIcon}>📦</div>
              <h3>Ver Inventario</h3>
              <p>Revisa el total de Producción Lisa en el inventario</p>
            </NavLink>
          )}
        </div>
      ) : (
        // Si estamos en un submódulo, mostramos navegación secundaria + contenido
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
