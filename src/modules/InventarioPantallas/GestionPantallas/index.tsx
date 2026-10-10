import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import styles from "./gestion-pantallas.module.css";

type Pantalla = {
  idPantalla: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  cantidad: number;
};

const API_PANTALLAS = "http://127.0.0.1:8000/api/inventario-pantallas";
const API_EXPORTAR_PANTALLAS =
  "http://127.0.0.1:8000/api/exportacion/pantallas";

export const GestionPantallas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pantallas, setPantallas] = useState<Pantalla[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorDescarga, setErrorDescarga] = useState("");
  const [descargando, setDescargando] = useState(false);

  const cargarPantallas = async () => {
    setCargando(true);
    setError("");
    try {
      const response = await fetch(API_PANTALLAS);
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al cargar pantallas: ${response.status}`,
        );
      }
      const data = (await response.json()) as Pantalla[];
      const normalizados = data.map((pantalla) => ({
        ...pantalla,
        idPantalla: Number(pantalla.idPantalla),
        cantidad: Number(pantalla.cantidad),
      }));
      // Ordenar por tipo y luego por nombre
      const ordenados = normalizados.sort(
        (a, b) =>
          a.tipo.localeCompare(b.tipo) || a.nombre.localeCompare(b.nombre),
      );
      setPantallas(ordenados);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Error al cargar pantallas.",
      );
    } finally {
      setCargando(false);
    }
  };

  // Cargar pantallas al montar el componente
  useEffect(() => {
    cargarPantallas();
  }, []);

  // Recargar cuando la ruta cambie a la raíz (cuando volvemos de crear/editar)
  useEffect(() => {
    if (location.pathname === "/inventario-pantallas/gestion-pantallas") {
      cargarPantallas();
    }
  }, [location.pathname]);

  const handleDescargarExcel = async () => {
    setDescargando(true);
    setErrorDescarga("");
    try {
      const response = await fetch(API_EXPORTAR_PANTALLAS, {
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
      let nombreArchivo = "Listado de Pantallas.xlsx";
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

  const isRoot =
    location.pathname === "/inventario-pantallas/gestion-pantallas";

  return (
    <section className={styles.container}>
      {isRoot ? (
        <section className={`${styles.gestionPantallas} content`}>
          <section className={styles.controlPanel}>
            <h2 className={styles.title}>Listado de Pantallas</h2>

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
                onClick={() => navigate("crear-pantalla")}
              >
                + Crear Pantalla
              </button>
            </div>
          </section>

          {errorDescarga && <p className={styles.error}>{errorDescarga}</p>}

          {cargando && <p className={styles.loading}>Cargando pantallas...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!cargando && !error && (
            <div className={styles.tableContainer}>
              {pantallas.length === 0 ? (
                <p className={styles.emptyMessage}>
                  No hay pantallas registradas.
                </p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Cantidad Actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pantallas.map((pantalla) => (
                      <tr
                        key={pantalla.idPantalla}
                        onClick={() =>
                          navigate(`editar-pantalla/${pantalla.idPantalla}`)
                        }
                        className={styles.clickableRow}
                      >
                        <td>{pantalla.tipo}</td>
                        <td>{pantalla.nombre}</td>
                        <td>{pantalla.descripcion}</td>
                        <td>{pantalla.cantidad}</td>
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
