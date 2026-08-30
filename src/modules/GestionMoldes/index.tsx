import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import styles from "./gestion-moldes.module.css";

type Molde = {
  idMolde: number;
  nombre: string;
  descripcion: string | null;
  numeroCamadas: number;
  numeroEnvases: number;
  numeroGruesas: number;
};

const API_MOLDES = "http://127.0.0.1:8000/api/gestion-moldes";

export const GestionMoldes = () => {
  const navigate = useNavigate();
  const [moldes, setMoldes] = useState<Molde[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarMoldes = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(API_MOLDES);
        if (!response.ok) {
          throw new Error(`Error al cargar moldes: ${response.status}`);
        }
        const data = await response.json();
        const moldesNormalizados = data.map((molde: Molde) => ({
          ...molde,
          idMolde: Number(molde.idMolde),
          numeroCamadas: Number(molde.numeroCamadas),
          numeroEnvases: Number(molde.numeroEnvases),
          numeroGruesas: Number(molde.numeroGruesas),
        }));
        // Ordenar los moldes por ID de forma ascendente
        const moldesOrdenados = moldesNormalizados.sort(
          (a, b) => a.idMolde - b.idMolde,
        );
        setMoldes(moldesOrdenados);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar moldes.",
        );
      } finally {
        setCargando(false);
      }
    };
    void cargarMoldes();
  }, []);

  const location = useLocation();
  const isRoot = location.pathname === "/gestion-moldes";

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("registrar-molde")) return "Registrar Molde";
    if (path.includes("editar-molde")) return "Editar Molde";
    return "";
  };

  return (
    <section className={styles.container}>
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Gestión de Moldes</h2>
        <p className={styles.moduleSubtitle}>
          Catálogo de los moldes disponibles en la aplicación
        </p>
      </header>

      {!isRoot ? (
        <nav className={`${styles.subNav} content`} id="subNav">
          <NavLink
            to="/gestion-moldes"
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
        <section className={`${styles.gestionMoldes} content`}>
          <section className={styles.controlPanel}>
            <h2 className={styles.title}>Listado de Moldes</h2>
            <button
              className={styles.registerButton}
              onClick={() => navigate("registrar-molde")}
            >
              + Registrar Molde
            </button>
          </section>

          {cargando && <p className={styles.loading}>Cargando moldes...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!cargando && !error && (
            <div className={styles.tableContainer}>
              {moldes.length === 0 ? (
                <p className={styles.emptyMessage}>
                  No hay moldes registrados.
                </p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Camadas</th>
                      <th>Envases</th>
                      <th>Gruesas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moldes.map((molde) => (
                      <tr
                        key={molde.idMolde}
                        onClick={() =>
                          navigate(`editar-molde/${molde.idMolde}`)
                        }
                        className={styles.clickableRow}
                      >
                        <td>{molde.nombre}</td>
                        <td>{molde.descripcion || "—"}</td>
                        <td>{molde.numeroCamadas}</td>
                        <td>{molde.numeroEnvases}</td>
                        <td>{molde.numeroGruesas}</td>
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
