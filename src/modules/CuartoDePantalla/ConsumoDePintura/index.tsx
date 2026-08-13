import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./consumo-de-pintura.module.css";

export const ConsumoDePintura = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const isRoot = location.pathname === "/consumo-pintura";

  /* Obtener el título para cada acción */
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("consumir")) return "Consumir Pintura";
    if (path.includes("suministrar")) return "Suministrar Pintura";
    if (path.includes("historial-consumo")) return "Historial de Consumo";
    if (path.includes("inventario")) return "Inventario de Pintura";
    return "";
  };

  // Definir los permisos para cada submódulo
  const permisos = {
    consumir: hasPermission("insumo_pintura", "crear_consumo"),
    suministrar: hasPermission("insumo_pintura", "crear_registro"),
    historial: hasPermission("insumo_pintura", "ver_historial_consumo"),
    inventario: hasPermission("insumo_pintura", "ver_inventario"),
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

      {/* Si estamos en la raíz del módulo, mostramos SOLO las tarjetas con permisos */}
      {isRoot ? (
        <div className={`${styles.actions} content`}>
          {/* Mostrar solo si tiene permiso para consumir */}
          {permisos.consumir && (
            <NavLink to="consumir" className={styles.actionCard}>
              <div className={styles.actionIcon}>📤</div>
              <h3>Consumir Pintura</h3>
              <p>Registra la salida de pintura del inventario</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene permiso para suministrar */}
          {permisos.suministrar && (
            <NavLink to="suministrar" className={styles.actionCard}>
              <div className={styles.actionIcon}>📥</div>
              <h3>Suministrar Pintura</h3>
              <p>Registra la entrada de pintura al inventario</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene permiso para ver historial */}
          {permisos.historial && (
            <NavLink to="historial-consumo" className={styles.actionCard}>
              <div className={styles.actionIcon}>📋</div>
              <h3>Historial de Consumo</h3>
              <p>Revisa el historial de consumo de pintura</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene permiso para ver inventario */}
          {permisos.inventario && (
            <NavLink to="inventario" className={styles.actionCard}>
              <div className={styles.actionIcon}>📦</div>
              <h3>Ver Inventario</h3>
              <p>Revisa la cantidad de pintura en el inventario</p>
            </NavLink>
          )}
        </div>
      ) : (
        // Si estamos en un submódulo, mostramos navegación secundaria + contenido
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

          <div className="content">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};
