import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./inventario.module.css";

export const Inventario = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const isRoot = location.pathname === "/inventario";

  /* Obtener el título para cada acción */
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("registro-insumo")) return "Registro de Insumo";
    if (path.includes("salida-insumo")) return "Salida de Insumo";
    if (path.includes("historial-movimiento")) return "Historial de Movimeinto";
    if (path.includes("listar-inventario")) return "Ver Inventario";
    if (path.includes("gestion-insumos")) return "Gestión de Insumos";
    return "";
  };

  // Definir los permisos para cada submódulo
  const permisos = {
    registroInsumo: hasPermission("inventario_insumos", "entrada_insumos"),
    salidaInsumo: hasPermission("inventario_insumos", "salida_insumos"),
    historialMovimiento: hasPermission(
      "inventario_insumos",
      "historial_movimientos",
    ),
    verInventario: hasPermission("inventario_insumos", "ver_inventario"),
    gestionInsumos: hasPermission("inventario_insumos", "gestion_insumos"),
  };

  return (
    <section className="container">
      {/* Título del módulo (siempre visible) */}
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Inventario</h2>
        <p className={styles.moduleSubtitle}>
          Inventario de la Zona de Decoración
        </p>
      </header>

      {!isRoot ? (
        <nav className={`${styles.subNav} content`} id="subNav">
          <NavLink
            to="/inventario"
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
      ) : null}

      {/* Se muestran solamente las opciones que el usuario tenga permiso de acceder */}
      {isRoot ? (
        <div className={`${styles.actions} content`}>
          {/* Mostrar solo si tiene el permiso registroInsumo */}
          {permisos.registroInsumo && (
            <NavLink to="registro-insumo" className={styles.actionCard}>
              <div className={styles.actionIcon}>📥</div>
              <h3>Registro de Insumo</h3>
              <p>Registra la entrada de un insumo</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de salidaInsumo */}
          {permisos.salidaInsumo && (
            <NavLink to="salida-insumo" className={styles.actionCard}>
              <div className={styles.actionIcon}>📤</div>
              <h3>Salida de Insumo</h3>
              <p>Registra la salida de un insumo</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de historialMovimiento */}
          {permisos.historialMovimiento && (
            <NavLink to="historial-movimiento" className={styles.actionCard}>
              <div className={styles.actionIcon}>📋</div>
              <h3>Historial de Movimiento</h3>
              <p>Revisa el historial de movimiento de los insumos</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de verInventario */}
          {permisos.verInventario && (
            <NavLink to="listar-inventario" className={styles.actionCard}>
              <div className={styles.actionIcon}>📦</div>
              <h3>Ver Inventario</h3>
              <p>Observa las existencias de los insumos</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de gestionInsumos */}
          {permisos.gestionInsumos && (
            <NavLink to="gestion-insumos" className={styles.actionCard}>
              <div className={styles.actionIcon}>⚙️</div>
              <h3>Gestión de Insumos</h3>
              <p>Gestión del catálogo de insumos</p>
            </NavLink>
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </section>
  );
};
