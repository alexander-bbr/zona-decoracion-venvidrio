import { useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import styles from "./gestion-productiva.module.css";

import { registrosProduccion } from "../../mocks/registrosproduccion";

export const GestionProductiva = () => {
  const navigate = useNavigate();
  const [pagina, setPagina] = useState(1);
  const registrosPorPagina = 50;
  const inicio = (pagina - 1) * registrosPorPagina;
  const registros = registrosProduccion.slice(
    inicio,
    inicio + registrosPorPagina,
  );
  const totalPaginas = Math.max(
    1,
    Math.ceil(registrosProduccion.length / registrosPorPagina),
  );

  const location = useLocation();
  const isRoot = location.pathname === "/gestion-productiva";

  /* Obtener el título para cada acción */
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("registrar-produccion")) return "Registrar Producción";
    if (path.includes("editar-produccion")) return "Editar Producción";
    return "";
  };

  return (
    <section className={styles.container}>
      {/* Título del módulo (siempre visible) */}
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Gestión Productiva</h2>
        <p className={styles.moduleSubtitle}>
          {isRoot
            ? "Gestión del historial de producción"
            : "Gestión de Producción"}
        </p>
      </header>

      {!isRoot ? (
        <nav className={`${styles.subNav} content`} id="subNav">
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
      ) : null}

      {isRoot ? (
        <section className={`${styles.gestionProductiva} content`}>
          <section className={styles.controlPanel}>
            <h2 className={styles.title}>Registros de Producción</h2>
            <button
              className={styles.registerButton}
              onClick={() => navigate("registrar-produccion")}
            >
              + Registrar Producción
            </button>
          </section>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Turno</th>
                  <th>Técnico</th>
                  <th>Paletas</th>
                  <th>Modelos</th>
                  <th>Pérdidas</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr
                    key={registro.id_registro}
                    onClick={() =>
                      navigate(`editar-produccion/${registro.id_registro}`)
                    }
                  >
                    <td>#{registro.id_registro}</td>
                    <td>{registro.fecha}</td>
                    <td>{registro.turno}</td>
                    <td>{registro.tecnico}</td>
                    <td>{registro.totalPaletas}</td>
                    <td>
                      {registro.modelos
                        .map((modelo) => modelo.modelo)
                        .join(", ")}
                    </td>
                    <td>{registro.perdidas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className={styles.pagination}>
            <span>
              {registros.length
                ? `${inicio + 1}-${inicio + registros.length}`
                : "0-0"}{" "}
              de {registrosProduccion.length}
            </span>
            <button
              disabled={pagina === 1}
              onClick={() => setPagina((actual) => actual - 1)}
            >
              Anterior
            </button>
            <span>
              Página {pagina} de {totalPaginas}
            </span>
            <button
              disabled={pagina === totalPaginas}
              onClick={() => setPagina((actual) => actual + 1)}
            >
              Siguiente
            </button>
          </footer>
        </section>
      ) : (
        <Outlet />
      )}
    </section>
  );
};
