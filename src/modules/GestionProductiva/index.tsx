import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import styles from "./gestion-productiva.module.css";

type RegistroProduccionLista = {
  idProduccion: number;
  fecha: string;
  turno: string;
  tecnico: string;
  totalGruesas: number;
  totalGruesasLisas: number;
  totalGruesasDecoradas: number;
  eficienciaProductiva: number;
  deficienciaProductiva: number;
};

const API_PRODUCCION = "http://127.0.0.1:8000/produccion";

export const GestionProductiva = () => {
  const navigate = useNavigate();
  const [pagina, setPagina] = useState(1);
  const [registros, setRegistros] = useState<RegistroProduccionLista[]>([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [hayMasRegistros, setHayMasRegistros] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const registrosPorPagina = 50;
  const inicio = (pagina - 1) * registrosPorPagina;

  useEffect(() => {
    const cargarRegistros = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(
          `${API_PRODUCCION}/?skip=${inicio}&limit=${registrosPorPagina}`,
        );
        if (!response.ok)
          throw new Error(`Error al cargar registros: ${response.status}`);
        const data = await response.json();
        const registrosApi = data.data ?? [];
        const registrosNormalizados = registrosApi.map(
          (registro: RegistroProduccionLista) => ({
            ...registro,
            idProduccion: Number(registro.idProduccion),
            totalGruesas: Number(registro.totalGruesas),
            totalGruesasLisas: Number(registro.totalGruesasLisas),
            totalGruesasDecoradas: Number(registro.totalGruesasDecoradas),
            eficienciaProductiva: Number(registro.eficienciaProductiva),
            deficienciaProductiva: Number(registro.deficienciaProductiva),
          }),
        );
        setRegistros(registrosNormalizados);
        setTotalRegistros(Number(data.total) || 0);
        setHayMasRegistros(inicio + registrosNormalizados.length < data.total);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar producción.",
        );
      } finally {
        setCargando(false);
      }
    };
    void cargarRegistros();
  }, [inicio, pagina]);

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

          {cargando && <p>Cargando registros de producción...</p>}
          {error && <p>{error}</p>}
          {!cargando && !error && (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Turno</th>
                    <th>Técnico</th>
                    <th>Gruesas</th>
                    <th>Gruesas Decoradas</th>
                    <th>Eficiencia</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((registro) => (
                    <tr
                      key={registro.idProduccion}
                      onClick={() =>
                        navigate(`editar-produccion/${registro.idProduccion}`)
                      }
                    >
                      <td>#{registro.idProduccion}</td>
                      <td>{registro.fecha}</td>
                      <td>{registro.turno}</td>
                      <td>{registro.tecnico}</td>
                      <td>{registro.totalGruesas}</td>
                      <td>{registro.totalGruesasDecoradas}</td>
                      <td>{registro.eficienciaProductiva}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer className={styles.pagination}>
            <span>
              {registros.length
                ? `${inicio + 1}-${inicio + registros.length}`
                : "0-0"}{" "}
              de {totalRegistros}
            </span>

            <div className={styles.pageButtons}>
              <button
                className={styles.pageButton}
                disabled={pagina === 1}
                onClick={() => setPagina((actual) => actual - 1)}
              >
                &lt;
              </button>

              <button
                className={styles.pageButton}
                disabled={!hayMasRegistros}
                onClick={() => setPagina((actual) => actual + 1)}
              >
                &gt;
              </button>
            </div>
          </footer>
        </section>
      ) : (
        <Outlet />
      )}
    </section>
  );
};
