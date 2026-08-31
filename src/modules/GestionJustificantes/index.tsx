import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import styles from "./gestion-justificantes.module.css";

type Justificante = {
  idJustificante: number;
  etiqueta: string;
  descripcion: string | null;
};

const API_JUSTIFICANTES = "http://127.0.0.1:8000/api/gestion-justificantes";

export const GestionJustificantes = () => {
  const navigate = useNavigate();
  const [justificantes, setJustificantes] = useState<Justificante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarJustificantes = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(API_JUSTIFICANTES);
        if (!response.ok) {
          throw new Error(`Error al cargar justificantes: ${response.status}`);
        }
        const data = await response.json();
        const justificantesNormalizados = data.map(
          (justificante: Justificante) => ({
            ...justificante,
            idJustificante: Number(justificante.idJustificante),
          }),
        );
        // Ordenar los justificantes por ID de forma ascendente
        const justificantesOrdenados = justificantesNormalizados.sort(
          (a, b) => a.idJustificante - b.idJustificante,
        );
        setJustificantes(justificantesOrdenados);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar justificantes.",
        );
      } finally {
        setCargando(false);
      }
    };
    void cargarJustificantes();
  }, []);

  const location = useLocation();
  const isRoot = location.pathname === "/gestion-justificantes";

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("registrar-justificante"))
      return "Registrar Justificante";
    if (path.includes("editar-justificante")) return "Editar Justificante";
    return "";
  };

  return (
    <section className={styles.container}>
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Gestión de Justificantes</h2>
        <p className={styles.moduleSubtitle}>
          {isRoot
            ? "Gestión del catálogo de justificantes"
            : "Gestión de Justificantes"}
        </p>
      </header>

      {!isRoot ? (
        <nav className={`${styles.subNav} content`} id="subNav">
          <NavLink
            to="/gestion-justificantes"
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
        <section className={`${styles.gestionJustificantes} content`}>
          <section className={styles.controlPanel}>
            <h2 className={styles.title}>Listado de Justificantes</h2>
            <button
              className={styles.registerButton}
              onClick={() => navigate("registrar-justificante")}
            >
              + Registrar Justificante
            </button>
          </section>

          {cargando && (
            <p className={styles.loading}>Cargando justificantes...</p>
          )}
          {error && <p className={styles.error}>{error}</p>}
          {!cargando && !error && (
            <div className={styles.tableContainer}>
              {justificantes.length === 0 ? (
                <p className={styles.emptyMessage}>
                  No hay justificantes registrados.
                </p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Etiqueta</th>
                      <th>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {justificantes.map((justificante) => (
                      <tr
                        key={justificante.idJustificante}
                        onClick={() =>
                          navigate(
                            `editar-justificante/${justificante.idJustificante}`,
                          )
                        }
                        className={styles.clickableRow}
                      >
                        <td>{justificante.etiqueta}</td>
                        <td>{justificante.descripcion || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      ) : (
        <Outlet />
      )}
    </section>
  );
};
