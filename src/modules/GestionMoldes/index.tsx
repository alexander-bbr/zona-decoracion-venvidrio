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
const API_EXPORTAR_MOLDES = "http://127.0.0.1:8000/api/exportacion/moldes";

export const GestionMoldes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [moldes, setMoldes] = useState<Molde[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorDescarga, setErrorDescarga] = useState("");
  const [descargando, setDescargando] = useState(false);

  const cargarMoldes = async () => {
    setCargando(true);
    setError("");
    try {
      const response = await fetch(API_MOLDES);
      if (!response.ok) {
        throw new Error(`Error al cargar moldes: ${response.status}`);
      }
      const data = await response.json();
      const moldesNormalizados: Molde[] = data.map((molde: Molde) => ({
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

  // Cargar moldes al montar el componente
  useEffect(() => {
    cargarMoldes();
  }, []);

  // Recargar cuando la ruta cambie a la raíz (cuando volvemos de registrar/editar)
  useEffect(() => {
    if (location.pathname === "/gestion-moldes") {
      cargarMoldes();
    }
  }, [location.pathname]);

  const handleDescargarExcel = async () => {
    setDescargando(true);
    setErrorDescarga("");
    try {
      const response = await fetch(API_EXPORTAR_MOLDES, {
        method: "POST",
        body: "",
      });

      if (!response.ok) {
        // Intentar leer el error como JSON, y si falla, usar un mensaje genérico
        let mensajeError = `Error al generar el Excel: ${response.status}`;
        try {
          const data = await response.json();
          if (data?.detail) {
            mensajeError =
              typeof data.detail === "string"
                ? data.detail
                : JSON.stringify(data.detail);
          }
        } catch {
          // La respuesta no era JSON, dejamos el mensaje genérico
        }
        throw new Error(mensajeError);
      }

      // Obtener el nombre del archivo desde Content-Disposition (si existe), sino se utiliza el nombre establecido:
      const contentDisposition = response.headers.get("Content-Disposition");
      let nombreArchivo = "Listado de Moldes.xlsx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          nombreArchivo = match[1];
        }
      }

      // Convertir la respuesta a Blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (downloadError) {
      setErrorDescarga(
        downloadError instanceof Error
          ? downloadError.message
          : "Error al descargar el Excel.",
      );
    } finally {
      setDescargando(false);
    }
  };

  const isRoot = location.pathname === "/gestion-moldes";

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("registrar-molde")) return "Registrar Molde";
    if (path.includes("editar-molde")) return "Editar Molde";
    return "";
  };

  return (
    <section className="container">
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
          {/* === PANEL DE CONTROL === */}
          <section className={styles.controlPanel}>
            <h2 className={styles.title}>Listado de Moldes</h2>

            <div className={styles.buttonWrapper}>
              <button
                className={styles.downloadButton}
                onClick={handleDescargarExcel}
                disabled={descargando || cargando}
              >
                {descargando ? "Descargando..." : "↓ Descargar"}
              </button>
              <button
                className={styles.registerButton}
                onClick={() => navigate("registrar-molde")}
              >
                + Registrar Molde
              </button>
            </div>
          </section>

          {errorDescarga && <p className={styles.error}>{errorDescarga}</p>}

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
