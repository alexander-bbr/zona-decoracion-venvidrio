import { useEffect, useMemo, useState } from "react";
import type { MoldeRendimiento } from "../../../types";
import styles from "./analisis-moldes.module.css";

const API_MOLDES = "http://127.0.0.1:8000/api/rendimiento/moldes";
const API_EXPORTAR_MOLDES =
  "http://127.0.0.1:8000/api/exportacion/rendimiento-moldes";

//* Helpers para fechas por defecto (zona horaria Venezuela)
const getTodayVenezuela = (): string => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Caracas",
  }).format(new Date());
};

const getStartOfYearVenezuela = (): string => {
  const today = getTodayVenezuela();
  const year = today.slice(0, 4);
  return `${year}-01-01`;
};

//* Formatea número con separador de miles y 2 decimales (es-VE)
const formatearNumero = (valor: number | null | undefined): string => {
  if (valor === null || valor === undefined) return "0";
  return Number(valor).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

//* Formatea un porcentaje: 85.0 -> "85", 85.5 -> "85.5"
const formatearPorcentaje = (
  valor: number | string | null | undefined,
): string => {
  if (valor === null || valor === undefined || valor === "") return "0";
  const num = typeof valor === "number" ? valor : Number(valor);
  if (isNaN(num)) return "0";
  return Number.isInteger(num)
    ? String(num)
    : num.toFixed(2).replace(/\.?0+$/, "");
};

export const AnalisisMoldes = () => {
  const todayVenezuela = useMemo(() => getTodayVenezuela(), []);
  const [fromDate, setFromDate] = useState(getStartOfYearVenezuela());
  const [toDate, setToDate] = useState(todayVenezuela);

  const [moldes, setMoldes] = useState<MoldeRendimiento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //* Estado independiente para la exportación
  const [descargando, setDescargando] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState("");

  useEffect(() => {
    const fetchMoldes = async () => {
      setCargando(true);
      setError(null);

      const query = `desde=${fromDate}&hasta=${toDate}`;

      try {
        const response = await fetch(`${API_MOLDES}?${query}`);

        if (!response.ok) {
          let mensaje = `Error HTTP: ${response.status}`;
          try {
            const data = await response.json();
            if (data?.detail) mensaje = data.detail;
          } catch {
            //* La respuesta no era JSON, dejamos el mensaje genérico
          }
          throw new Error(mensaje);
        }

        const data = (await response.json()) as MoldeRendimiento[];
        setMoldes(data);
      } catch (e) {
        console.error(`Error encontrado: ${e}`);
        setError(e instanceof Error ? e.message : "Error al cargar los datos");
        setMoldes([]);
      } finally {
        setCargando(false);
      }
    };

    fetchMoldes();
  }, [fromDate, toDate]);

  const handleDescargarExcel = async () => {
    setDescargando(true);
    setErrorDescarga("");
    try {
      const response = await fetch(API_EXPORTAR_MOLDES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaDesde: fromDate,
          fechaHasta: toDate,
        }),
      });

      if (!response.ok) {
        //* Intentar leer el error como JSON, y si falla, usar un mensaje genérico
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
          //* La respuesta no era JSON, dejamos el mensaje genérico
        }
        throw new Error(mensajeError);
      }

      //* Obtener el nombre del archivo desde Content-Disposition (si existe)
      const contentDisposition = response.headers.get("Content-Disposition");
      let nombreArchivo = "Rendimiento por Molde.xlsx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          nombreArchivo = match[1];
        }
      }

      //* Convertir la respuesta a Blob y descargar
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

  const hayDatos = moldes.length > 0;

  return (
    <section className={`${styles.analisisMoldes} content`}>
      <section className={styles.controlPanel}>
        <h2 className={styles.title}>Rendimiento por Molde</h2>

        {/* Filtros */}
        <div className={styles.filterWrapper}>
          <label htmlFor="fromDate" className={styles.filterLabel}>
            Fecha Desde
          </label>
          <input
            id="fromDate"
            className={styles.dateInput}
            type="date"
            value={fromDate}
            max={toDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>

        <div className={styles.filterWrapper}>
          <label htmlFor="toDate" className={styles.filterLabel}>
            Fecha Hasta
          </label>
          <input
            id="toDate"
            className={styles.dateInput}
            type="date"
            value={toDate}
            min={fromDate}
            max={todayVenezuela}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>

        <div className={styles.downloadWrapper}>
          <button
            className={styles.downloadButton}
            onClick={handleDescargarExcel}
            disabled={descargando || cargando}
          >
            {descargando ? "Descargando..." : "↓ Descargar"}
          </button>
        </div>
      </section>

      {errorDescarga && <p className={styles.error}>{errorDescarga}</p>}

      {cargando && <p className={styles.loading}>Cargando moldes...</p>}
      {!cargando && error && <p className={styles.error}>{error}</p>}
      {!cargando && !error && !hayDatos && (
        <p className={styles.emptyMessage}>
          No hay información de moldes para el período seleccionado.
        </p>
      )}
      {!cargando && !error && hayDatos && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Gruesas Lisas</th>
                <th>Entradas (Gruesas)</th>
                <th>Gruesas Decoradas</th>
                <th>Gruesas Defectuosas</th>
                <th>Eficiencia</th>
                <th>Deficiencia</th>
              </tr>
            </thead>
            <tbody>
              {moldes.map((molde) => (
                <tr key={molde.item}>
                  <td>{molde.item}</td>
                  <td>{molde.nombre}</td>
                  <td className={styles.descripcion}>
                    {molde.descripcion || "—"}
                  </td>
                  <td>{formatearNumero(molde.gruesasLisas)}</td>
                  <td>{formatearNumero(molde.entradasGruesas)}</td>
                  <td>{formatearNumero(molde.gruesasDecoradas)}</td>
                  <td>{formatearNumero(molde.gruesasDefectuosas)}</td>
                  <td>
                    <span className={styles.badgeGood}>
                      {formatearPorcentaje(molde.eficiencia)}%
                    </span>
                  </td>
                  <td>
                    <span className={styles.badgeBad}>
                      {formatearPorcentaje(molde.deficiencia)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
