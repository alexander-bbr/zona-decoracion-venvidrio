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
const API_EXPORTAR_PRODUCCION =
  "http://127.0.0.1:8000/api/exportacion/gestion-productiva";

export const GestionProductiva = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pagina, setPagina] = useState(1);
  const [registros, setRegistros] = useState<RegistroProduccionLista[]>([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Estados para exportación
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [descargando, setDescargando] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState("");

  const registrosPorPagina = 50;
  const inicio = (pagina - 1) * registrosPorPagina;
  const registrosPagina = registros.slice(inicio, inicio + registrosPorPagina);
  const hayMasRegistros = inicio + registrosPagina.length < totalRegistros;

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

        const totalApi = data.total ? Number(data.total) : registrosApi.length;
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

  // Cargar registros al montar el componente
  useEffect(() => {
    cargarRegistros();
  }, []);

  // Recargar cuando la ruta cambie a la raíz (cuando volvemos de registrar/editar)
  useEffect(() => {
    if (location.pathname === "/gestion-productiva") {
      cargarRegistros();
    }
  }, [location.pathname]);

  // === LÓGICA DE EXPORTACIÓN ===
  const abrirModalExportar = () => {
    // Establecer valores por defecto: hoy y hoy
    const hoy = new Date().toISOString().split("T")[0];
    setFechaDesde(hoy);
    setFechaHasta(hoy);
    setErrorDescarga("");
    setMostrarModal(true);
  };

  const cerrarModalExportar = () => {
    setMostrarModal(false);
    setErrorDescarga("");
  };

  const handleDescargarExcel = async () => {
    // Validaciones
    if (!fechaDesde || !fechaHasta) {
      setErrorDescarga("Debes seleccionar ambas fechas.");
      return;
    }

    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      setErrorDescarga(
        "La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.",
      );
      return;
    }

    setDescargando(true);
    setErrorDescarga("");

    try {
      const response = await fetch(API_EXPORTAR_PRODUCCION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaDesde,
          fechaHasta,
        }),
      });

      if (!response.ok) {
        // Intentar leer el error como JSON
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

      // Obtener el nombre del archivo desde Content-Disposition (si existe)
      const contentDisposition = response.headers.get("Content-Disposition");
      let nombreArchivo = "Historial de Producción.xlsx";
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

      // Cerrar el modal al terminar exitosamente
      cerrarModalExportar();
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

  const isRoot = location.pathname === "/gestion-productiva";

  /* Obtener el título para cada acción */
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("registrar-produccion")) return "Registrar Producción";
    if (path.includes("editar-produccion")) return "Editar Producción";
    return "";
  };

  return (
    <section className="container">
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
            <h2 className={styles.title}>Historial de Producción</h2>

            <div className={styles.buttonWrapper}>
              <button
                className={styles.downloadButton}
                onClick={abrirModalExportar}
                disabled={cargando}
              >
                ↓ Descargar
              </button>
              <button
                className={styles.registerButton}
                onClick={() => navigate("registrar-produccion")}
              >
                + Registrar Producción
              </button>
            </div>
          </section>

          {cargando && <p>Cargando registros de producción...</p>}
          {error && <p>{error}</p>}
          {!cargando && !error && (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nro. Registro</th>
                    <th>Fecha</th>
                    <th>Turno</th>
                    <th>Técnico</th>
                    <th>Total Gruesas</th>
                    <th>Gruesas Lisas</th>
                    <th>Gruesas Decoradas</th>
                    <th>Eficiencia</th>
                    <th>Deficiencia</th>
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
                      <td>
                        <strong>{registro.idCabecera}</strong>
                      </td>
                      <td>{registro.fecha}</td>
                      <td>{registro.turno}</td>
                      <td>{registro.tecnico}</td>
                      <td>{registro.totalGruesas}</td>
                      <td>{registro.totalGruesasLisas}</td>
                      <td>{registro.totalGruesasDecoradas}</td>
                      <td className={styles.eficent}>
                        {registro.eficienciaProductiva} %
                      </td>
                      <td className={styles.deficent}>
                        {registro.deficienciaProductiva} %
                      </td>
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

      {/* === MODAL DE EXPORTACIÓN === */}
      {mostrarModal && (
        <div className={styles.modalOverlay} onClick={cerrarModalExportar}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Exportar Historial de Producción
              </h3>
              <button
                className={styles.modalCloseButton}
                onClick={cerrarModalExportar}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <p className={styles.modalDescription}>
              Selecciona el rango de fechas para exportar los registros de
              producción.
            </p>

            <div className={styles.modalBody}>
              <div className={styles.modalInputWrapper}>
                <label htmlFor="fechaDesde">Desde</label>
                <input
                  id="fechaDesde"
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  max={fechaHasta || undefined}
                />
              </div>

              <div className={styles.modalInputWrapper}>
                <label htmlFor="fechaHasta">Hasta</label>
                <input
                  id="fechaHasta"
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  min={fechaDesde || undefined}
                />
              </div>
            </div>

            {errorDescarga && (
              <p className={styles.modalError}>{errorDescarga}</p>
            )}

            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelButton}
                onClick={cerrarModalExportar}
                disabled={descargando}
              >
                Cancelar
              </button>
              <button
                className={styles.modalDownloadButton}
                onClick={handleDescargarExcel}
                disabled={descargando}
              >
                {descargando ? "Generando..." : "Descargar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
