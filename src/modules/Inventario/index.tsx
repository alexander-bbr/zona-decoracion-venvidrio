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
    if (path.includes("listar-inventario")) return "Listar Inventario";
    if (path.includes("crear-insumo")) return "Crear Insumo";
    if (path.includes("editar-insumo")) return "Editar Insumo";
    return "";
  };

  // Definir los permisos para cada submódulo
  const permisos = {
    registroInsumo: hasPermission("insumo_pintura", "crear_consumo"),
    salidaInsumo: hasPermission("insumo_pintura", "crear_consumo"),
    historialMovimiento: hasPermission("insumo_pintura", "crear_consumo"),
    listarInventario: hasPermission("insumo_pintura", "crear_consumo"),
    crearInsumo: hasPermission("insumo_pintura", "crear_consumo"),
    editarInsumo: hasPermission("insumo_pintura", "crear_consumo"),
  };

  return (
    <section className={styles.container}>
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
              <p>Registra la entrada de un insumo en el inventario</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de salidaInsumo */}
          {permisos.salidaInsumo && (
            <NavLink to="salida-insumo" className={styles.actionCard}>
              <div className={styles.actionIcon}>📤</div>
              <h3>Salida de Insumo</h3>
              <p>Registra la salida de un insumo en el inventario</p>
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

          {/* Mostrar solo si tiene el permiso de listarInventario */}
          {permisos.listarInventario && (
            <NavLink to="listar-inventario" className={styles.actionCard}>
              <div className={styles.actionIcon}>📦</div>
              <h3>Listar Inventario</h3>
              <p>Revisa la cantidad de todos los insumos en el inventario</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de crearInsumo */}
          {permisos.crearInsumo && (
            <NavLink to="crear-insumo" className={styles.actionCard}>
              <div className={styles.actionIcon}>🖋️</div>
              <h3>Crear Insumo</h3>
              <p>Crea un nuevo ítem de insumo</p>
            </NavLink>
          )}

          {/* Mostrar solo si tiene el permiso de editarInsumo */}
          {permisos.editarInsumo && (
            <NavLink to="editar-insumo" className={styles.actionCard}>
              <div className={styles.actionIcon}>🔧</div>
              <h3>Editar Insumo</h3>
              <p>Edita un ítem de insumo</p>
            </NavLink>
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </section>
  );
};
