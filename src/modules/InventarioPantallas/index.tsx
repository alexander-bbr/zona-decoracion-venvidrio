import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./inventario-pantallas.module.css";

export const InventarioPantallas = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const isRoot = location.pathname === "/inventario-pantallas";

  /* Obtener el título para cada acción */
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("crear-pantalla")) return "Crear Pantalla";
    if (path.includes("editar-pantalla")) return "Editar Pantalla";
    if (path.includes("registro-pantalla")) return "Registro de Pantalla";
    if (path.includes("salida-pantalla")) return "Salida de Pantalla";
    if (path.includes("historial-movimiento")) return "Historial de Movimiento";
    if (path.includes("ver-inventario")) return "Ver Inventario";
    if (path.includes("gestion-pantallas")) return "Gestión de Pantallas";
    return "";
  };

  const getParentPath = () =>
    location.pathname.startsWith("/inventario-pantallas/gestion-pantallas/")
      ? "/inventario-pantallas/gestion-pantallas"
      : "/inventario-pantallas";

  // Definir los permisos para cada submódulo
  const permisos = {
    registroPantalla: hasPermission(
      "inventario_pantallas",
      "entrada_pantallas",
    ),
    salidaPantalla: hasPermission("inventario_pantallas", "salida_pantallas"),
    historialMovimiento: hasPermission(
      "inventario_pantallas",
      "historial_movimientos",
    ),
    verInventario: hasPermission("inventario_pantallas", "ver_inventario"),
    gestionPantallas: hasPermission(
      "inventario_pantallas",
      "gestion_pantallas",
    ),
  };

  return (
    <section className="container">
      {/* Título del módulo (siempre visible) */}
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Inventario de Pantallas</h2>
        <p className={styles.moduleSubtitle}>
          Inventario de pantallas de la Zona de Decoración
        </p>
      </header>

      {!isRoot ? (
        <nav className={`${styles.subNav} content`} id="subNav">
          <NavLink
            to={getParentPath()}
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
          {/* Mostrar solo si tiene el permiso registroPantalla */}
          {permisos.registroPantalla && (
            <NavLink to="registro-pantalla" className={styles.actionCard}>
              <div className={styles.actionIcon}>📥</div>
              <h3>Registro de Pantalla</h3>
              <p>Registra la entrada de una pantalla</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de salidaPantalla */}
          {permisos.salidaPantalla && (
            <NavLink to="salida-pantalla" className={styles.actionCard}>
              <div className={styles.actionIcon}>📤</div>
              <h3>Salida de Pantalla</h3>
              <p>Registra la salida de una pantalla</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de historialMovimiento */}
          {permisos.historialMovimiento && (
            <NavLink to="historial-movimiento" className={styles.actionCard}>
              <div className={styles.actionIcon}>📋</div>
              <h3>Historial de Movimiento</h3>
              <p>Revisa el historial de movimiento de las pantallas</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de verInventario */}
          {permisos.verInventario && (
            <NavLink to="ver-inventario" className={styles.actionCard}>
              <div className={styles.actionIcon}>📦</div>
              <h3>Ver Inventario</h3>
              <p>Observa las existencias de las pantallas</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de gestionPantallas */}
          {permisos.gestionPantallas && (
            <NavLink to="gestion-pantallas" className={styles.actionCard}>
              <div className={styles.actionIcon}>⚙️</div>
              <h3>Gestión de Pantallas</h3>
              <p>Gestión del catálogo de pantallas</p>
            </NavLink>
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </section>
  );
};
