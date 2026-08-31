import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import styles from "./gestion-productiva.module.css";

type RegistroProduccionLista = {
  idCabecera: number;
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
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const registrosPorPagina = 50;
  const inicio = (pagina - 1) * registrosPorPagina;
  const registrosPagina = registros.slice(inicio, inicio + registrosPorPagina);
  const hayMasRegistros = inicio + registrosPagina.length < totalRegistros;

  useEffect(() => {
    const cargarRegistros = async () => {
      setCargando(true);
      setError("");
      try {
        const registrosCargados: RegistroProduccionLista[] = [];
        let skip = 0;

        while (true) {
          const response = await fetch(
            `${API_PRODUCCION}?skip=${skip}&limit=${registrosPorPagina}`,
          );
          if (!response.ok)
            throw new Error(`Error al cargar registros: ${response.status}`);

          const data = await response.json();
          // El nuevo endpoint devuelve directamente un array
          const registrosApi = Array.isArray(data) ? data : (data.data ?? []);
          const registrosNormalizados = registrosApi.map(
            (registro: RegistroProduccionLista) => ({
              ...registro,
              idCabecera: Number(registro.idCabecera),
              totalGruesas: Number(registro.totalGruesas),
              totalGruesasLisas: Number(registro.totalGruesasLisas),
              totalGruesasDecoradas: Number(registro.totalGruesasDecoradas),
              eficienciaProductiva: Number(registro.eficienciaProductiva),
              deficienciaProductiva: Number(registro.deficienciaProductiva),
            }),
          );

          registrosCargados.push(...registrosNormalizados);

          // Si la respuesta no tiene total, usamos la longitud del array
          const totalApi = data.total
            ? Number(data.total)
            : registrosApi.length;
          if (
            registrosNormalizados.length < registrosPorPagina ||
            (totalApi > 0 && registrosCargados.length >= totalApi)
          ) {
            break;
          }
          skip += registrosPorPagina;
        }

        setRegistros(registrosCargados);
        setTotalRegistros(registrosCargados.length);
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
  }, []);

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
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Gestión Productiva</h2>
        <p className={styles.moduleSubtitle}>
          Historial de producción en la Zona de Decoración
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
                  {registrosPagina.map((registro) => (
                    <tr
                      key={registro.idCabecera}
                      onClick={() =>
                        navigate(`editar-produccion/${registro.idCabecera}`)
                      }
                    >
                      <td>#{registro.idCabecera}</td>
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
              {registrosPagina.length
                ? `${inicio + 1}-${inicio + registrosPagina.length}`
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
