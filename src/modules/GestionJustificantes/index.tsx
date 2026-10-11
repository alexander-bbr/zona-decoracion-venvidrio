import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import styles from "./gestion-justificantes.module.css";

type Justificante = {
  idJustificante: number;
  etiqueta: string;
  descripcion: string | null;
};

const API_JUSTIFICANTES = "http://127.0.0.1:8000/api/gestion-justificantes";
const API_EXPORTAR_JUSTIFICANTES =
  "http://127.0.0.1:8000/api/exportacion/justificantes";

export const GestionJustificantes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [justificantes, setJustificantes] = useState<Justificante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorDescarga, setErrorDescarga] = useState("");
  const [descargando, setDescargando] = useState(false);

  const cargarJustificantes = async () => {
    setCargando(true);
    setError("");
    try {
      const response = await fetch(API_JUSTIFICANTES);
      if (!response.ok) {
        throw new Error(`Error al cargar justificantes: ${response.status}`);
      }
      const data = await response.json();
      const justificantesNormalizados: Justificante[] = data.map(
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

  // Cargar justificantes al montar el componente
  useEffect(() => {
    cargarJustificantes();
  }, []);

  // Recargar cuando la ruta cambie a la raíz (cuando volvemos de registrar/editar)
  useEffect(() => {
    if (location.pathname === "/gestion-justificantes") {
      cargarJustificantes();
    }
  }, [location.pathname]);

  const handleDescargarExcel = async () => {
    setDescargando(true);
    setErrorDescarga("");
    try {
      const response = await fetch(API_EXPORTAR_JUSTIFICANTES, {
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
      let nombreArchivo = "Listado de Justificantes.xlsx";
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

  const isRoot = location.pathname === "/gestion-justificantes";

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("registrar-justificante"))
      return "Registrar Justificante";
    if (path.includes("editar-justificante")) return "Editar Justificante";
    return "";
  };

  return (
    <section className="container">
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
          {/* === PANEL DE CONTROL === */}
          <section className={styles.controlPanel}>
            <h2 className={styles.title}>Listado de Justificantes</h2>

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
                onClick={() => navigate("registrar-justificante")}
              >
                + Registrar Justificante
              </button>
            </div>
          </section>

          {errorDescarga && <p className={styles.error}>{errorDescarga}</p>}

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
