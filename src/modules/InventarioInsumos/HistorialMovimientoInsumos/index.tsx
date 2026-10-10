import { useEffect, useState } from "react";
import styles from "./historial-movimiento-insumos.module.css";

type Movimiento = {
  idInventarioEntrada?: number;
  idInventarioSalida?: number;
  tipoInsumo: string;
  articulo: string;
  fecha: string;
  encargado: string;
  turno: string;
  grupo: string;
  cantidad: number;
};

const API_HISTORIAL = "http://127.0.0.1:8000/api/inventario-insumos/historial";
const API_EXPORTAR_MOVIMIENTOS =
  "http://127.0.0.1:8000/api/exportacion/movimientos-inventario";

const LIMIT = 50;

export const HistorialMovimientoInsumos = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(false);

  // Estados para exportación
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [descargando, setDescargando] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState("");

  const inicio = (pagina - 1) * LIMIT;
  const fin = inicio + movimientos.length;

  const cargarHistorial = async (paginaActual: number) => {
    setCargando(true);
    setError("");
    try {
      const skip = (paginaActual - 1) * LIMIT;
      const url = `${API_HISTORIAL}?skip=${skip}&limit=${LIMIT}`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al cargar historial: ${response.status}`,
        );
      }

      const data = (await response.json()) as Movimiento[];
      setMovimientos(data);
      setHayMas(data.length === LIMIT);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Error al cargar el historial.",
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarHistorial(pagina);
  }, [pagina]);

  const esEntrada = (mov: Movimiento) => mov.idInventarioEntrada !== undefined;

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
      const response = await fetch(API_EXPORTAR_MOVIMIENTOS, {
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
      let nombreArchivo = "Historial de Movimientos.xlsx";
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

  return (
    <section className={`${styles.historialMovimiento} content`}>
      <section className={styles.controlPanel}>
        <h2 className={styles.title}>Historial de Movimientos</h2>

        <div className={styles.buttonWrapper}>
          <button
            className={styles.downloadButton}
            onClick={abrirModalExportar}
            disabled={cargando}
          >
            ↓ Descargar
          </button>
        </div>
      </section>

      {cargando && <p className={styles.loading}>Cargando historial...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!cargando && !error && (
        <>
          <div className={styles.tableContainer}>
            {movimientos.length === 0 ? (
              <p className={styles.emptyMessage}>
                No hay movimientos registrados.
              </p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Tipo Insumo</th>
                    <th>Artículo</th>
                    <th>Fecha</th>
                    <th>Encargado</th>
                    <th>Turno</th>
                    <th>Grupo</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((mov, index) => (
                    <tr
                      key={`${mov.tipoInsumo}-${mov.articulo}-${mov.fecha}-${index}`}
                      className={
                        esEntrada(mov) ? styles.rowEntrada : styles.rowSalida
                      }
                    >
                      <td>
                        <span
                          className={
                            esEntrada(mov)
                              ? styles.badgeEntrada
                              : styles.badgeSalida
                          }
                        >
                          {esEntrada(mov) ? "Entrada" : "Salida"}
                        </span>
                      </td>
                      <td>{mov.tipoInsumo}</td>
                      <td>{mov.articulo}</td>
                      <td>{mov.fecha}</td>
                      <td>{mov.encargado}</td>
                      <td>{mov.turno}</td>
                      <td>{mov.grupo}</td>
                      <td>{mov.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <footer className={styles.pagination}>
            <span>{movimientos.length ? `${inicio + 1}-${fin}` : "0-0"}</span>

            <div className={styles.pageButtons}>
              <button
                className={styles.pageButton}
                disabled={pagina === 1 || cargando}
                onClick={() => setPagina((actual) => actual - 1)}
              >
                &lt;
              </button>

              <button
                className={styles.pageButton}
                disabled={!hayMas || cargando}
                onClick={() => setPagina((actual) => actual + 1)}
              >
                &gt;
              </button>
            </div>
          </footer>
        </>
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
                Exportar Historial de Movimientos
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
              Selecciona el rango de fechas para exportar los movimientos de
              inventario.
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
