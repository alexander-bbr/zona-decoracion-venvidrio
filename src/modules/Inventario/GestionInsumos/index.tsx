import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import styles from "./gestion-insumos.module.css";

type Insumo = {
  idInsumo: number;
  tipo: string;
  articulo: string;
  unidad: string;
  cantidadActual: number;
  cantidadMinima: number;
};

const API_INSUMOS = "http://127.0.0.1:8000/api/inventario-insumos";
const API_EXPORTAR_INSUMOS = "http://127.0.0.1:8000/api/exportacion/insumos";

export const GestionInsumos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorDescarga, setErrorDescarga] = useState("");
  const [descargando, setDescargando] = useState(false);

  const cargarInsumos = async () => {
    setCargando(true);
    setError("");
    try {
      const response = await fetch(API_INSUMOS);
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al cargar insumos: ${response.status}`,
        );
      }
      const data = (await response.json()) as Insumo[];
      const normalizados = data.map((insumo) => ({
        ...insumo,
        idInsumo: Number(insumo.idInsumo),
        cantidadActual: Number(insumo.cantidadActual),
        cantidadMinima: Number(insumo.cantidadMinima),
      }));
      // Ordenar por tipo y luego por artículo
      const ordenados = normalizados.sort(
        (a, b) =>
          a.tipo.localeCompare(b.tipo) || a.articulo.localeCompare(b.articulo),
      );
      setInsumos(ordenados);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Error al cargar insumos.",
      );
    } finally {
      setCargando(false);
    }
  };

  // Cargar insumos al montar el componente
  useEffect(() => {
    cargarInsumos();
  }, []);

  // Recargar cuando la ruta cambie a la raíz (cuando volvemos de crear/editar)
  useEffect(() => {
    if (location.pathname === "/inventario/gestion-insumos") {
      cargarInsumos();
    }
  }, [location.pathname]);

  const handleDescargarExcel = async () => {
    setDescargando(true);
    setErrorDescarga("");
    try {
      const response = await fetch(API_EXPORTAR_INSUMOS, {
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
      let nombreArchivo = "Listado de Insumos.xlsx";
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

  const isRoot = location.pathname === "/inventario/gestion-insumos";

  return (
    <section className={styles.container}>
      {isRoot ? (
        <section className={`${styles.gestionInsumos} content`}>
          <section className={styles.controlPanel}>
            <h2 className={styles.title}>Listado de Insumos</h2>

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
                onClick={() => navigate("crear-insumo")}
              >
                + Crear Insumo
              </button>
            </div>
          </section>

          {errorDescarga && <p className={styles.error}>{errorDescarga}</p>}

          {cargando && <p className={styles.loading}>Cargando insumos...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!cargando && !error && (
            <div className={styles.tableContainer}>
              {insumos.length === 0 ? (
                <p className={styles.emptyMessage}>
                  No hay insumos registrados.
                </p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Artículo</th>
                      <th>Unidad</th>
                      <th>Cantidad Actual</th>
                      <th>Cantidad Mínima</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insumos.map((insumo) => (
                      <tr
                        key={insumo.idInsumo}
                        onClick={() =>
                          navigate(`editar-insumo/${insumo.idInsumo}`)
                        }
                        className={styles.clickableRow}
                      >
                        <td>{insumo.tipo}</td>
                        <td>{insumo.articulo}</td>
                        <td>{insumo.unidad}</td>
                        <td>{insumo.cantidadActual}</td>
                        <td>{insumo.cantidadMinima}</td>
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
