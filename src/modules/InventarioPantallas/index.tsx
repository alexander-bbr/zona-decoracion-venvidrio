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
              <div className={styles.actionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="54"
                  height="54"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-download"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <h3>Registro de Pantalla</h3>
              <p>Registra la entrada de una pantalla</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de salidaPantalla */}
          {permisos.salidaPantalla && (
            <NavLink to="salida-pantalla" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="54"
                  height="54"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-upload"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <h3>Salida de Pantalla</h3>
              <p>Registra la salida de una pantalla</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de historialMovimiento */}
          {permisos.historialMovimiento && (
            <NavLink to="historial-movimiento" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg
                  width="54"
                  height="54"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5.00001C8 2.33333 6 2.33333 2 5.00001V21C6 18.5 8 18.5 12 21M12 5.00001V21M12 5.00001C16 2.33333 18 2.33333 22 5.00001V21C18 18.5 16 18.5 12 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              <h3>Historial de Movimiento</h3>
              <p>Revisa el historial de movimiento de las pantallas</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de verInventario */}
          {permisos.verInventario && (
            <NavLink to="ver-inventario" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="54"
                  height="54"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-archive"
                >
                  <polyline points="21 8 21 21 3 21 3 8"></polyline>
                  <rect x="1" y="3" width="22" height="5"></rect>
                  <line x1="10" y1="12" x2="14" y2="12"></line>
                </svg>
              </div>
              <h3>Ver Inventario</h3>
              <p>Observa las existencias de las pantallas</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de gestionPantallas */}
          {permisos.gestionPantallas && (
            <NavLink to="gestion-pantallas" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="54"
                  height="54"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-settings"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
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
