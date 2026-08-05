import { useState, useEffect, useCallback } from "react";
import styles from "./historial-produccion-lisa.module.css";

interface Registro {
  id_registro: number;
  fecha_registro: string;
  id_inventariopl: number;
  cantidad_registrada: number;
}

interface Salida {
  id_salida: number;
  fecha_salida: string;
  id_inventariopl: number;
  cantidad_sacada: number;
}

// Tipo unificado para mostrar en la tabla
interface MovimientoMostrable {
  fecha: string;
  numeroModelo: number;
  cantidad: number;
  codigoModelo: string; // Podrías obtenerlo del inventario si es necesario
  tipoMovimiento: "REGISTRO" | "CONSUMO";
  id: number;
}

export const HistorialProduccionLisa = () => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [movimientos, setMovimientos] = useState<MovimientoMostrable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  // Validar que fecha desde no sea mayor a fecha hasta
  const validateDates = useCallback((): boolean => {
    if (!fromDate || !toDate) {
      setDateError(null);
      return true;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (from > to) {
      setDateError("La fecha desde no puede ser mayor a la fecha hasta");
      return false;
    }

    setDateError(null);
    return true;
  }, [fromDate, toDate]);

  // Obtener el historial
  const fetchHistorial = useCallback(async () => {
    // Validar fechas antes de hacer la petición
    if (!validateDates()) return;

    if (!fromDate || !toDate) {
      setError("Por favor selecciona ambas fechas");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `http://127.0.0.1:8000/api/produccion-lisa/historial?from_date=${fromDate}&to_date=${toDate}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.status}`);
      }

      const data = await response.json();

      // Transformar los datos para la tabla
      const movimientosTransformados: MovimientoMostrable[] = [
        ...data.data.registros.map((reg: Registro) => ({
          fecha: new Date(reg.fecha_registro).toLocaleDateString("es-ES"),
          numeroModelo: reg.id_inventariopl,
          cantidad: reg.cantidad_registrada,
          codigoModelo: `PL-${reg.id_inventariopl}`, // Ajusta según tu lógica
          tipoMovimiento: "REGISTRO" as const,
          id: reg.id_registro,
        })),
        ...data.data.salidas.map((sal: Salida) => ({
          fecha: new Date(sal.fecha_salida).toLocaleDateString("es-ES"),
          numeroModelo: sal.id_inventariopl,
          cantidad: sal.cantidad_sacada,
          codigoModelo: `PL-${sal.id_inventariopl}`, // Ajusta según tu lógica
          tipoMovimiento: "CONSUMO" as const,
          id: sal.id_salida,
        })),
      ];

      // Ordenar por fecha (más reciente primero)
      movimientosTransformados.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );

      setMovimientos(movimientosTransformados);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los datos",
      );
      console.error("Error fetching historial:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fromDate, toDate, validateDates]);

  // Validar fechas cuando cambian
  useEffect(() => {
    validateDates();
  }, [fromDate, toDate, validateDates]);

  // Cargar datos cuando las fechas son válidas
  useEffect(() => {
    if (fromDate && toDate && !dateError) {
      fetchHistorial();
    }
  }, [fromDate, toDate, dateError, fetchHistorial]);

  // Manejar cambios en el input de Fecha Desde
  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  // Manejar cambios en el input de Fecha Hasta
  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  /* === RENDERIZADO === */
  return (
    <section className={styles.historial}>
      <h2 className={styles.historialTitle}>Historial de Movimiento</h2>

      {/* Panel de control */}
      <section className={styles.controls}>
        {/* Fecha Desde */}
        <div className={styles.controlWrapper}>
          <label htmlFor="fromDate" className={styles.controlLabel}>
            Fecha Desde
          </label>
          <input
            id="fromDate"
            className={`${styles.dateInput} ${dateError ? styles.error : ""}`}
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            max={toDate || undefined} // No permite seleccionar fecha posterior a "hasta"
          />
        </div>

        {/* Fecha Hasta */}
        <div className={styles.controlWrapper}>
          <label htmlFor="toDate" className={styles.controlLabel}>
            Fecha Hasta
          </label>
          <input
            id="toDate"
            className={`${styles.dateInput} ${dateError ? styles.error : ""}`}
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            min={fromDate || undefined} // No permite seleccionar fecha anterior a "desde"
          />
        </div>

        {/* Mostrar error de fechas */}
        {dateError && <div className={styles.errorMessage}>{dateError}</div>}
      </section>

      {/* Estado de carga */}
      {isLoading && (
        <div className={styles.loadingMessage}>Cargando datos...</div>
      )}

      {/* Error general */}
      {error && !isLoading && (
        <div className={styles.errorMessage}>{error}</div>
      )}

      {/* Tabla */}
      {!isLoading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.glassTable}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Número del Modelo</th>
                <th>Cantidad</th>
                <th>Código del modelo</th>
                <th>Tipo de Movimiento</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    No hay movimientos para el período seleccionado
                  </td>
                </tr>
              ) : (
                movimientos.map((mov) => (
                  <tr key={`${mov.tipoMovimiento}-${mov.id}`}>
                    <td>{mov.fecha}</td>
                    <td>{mov.numeroModelo}</td>
                    <td>{mov.cantidad}</td>
                    <td>{mov.codigoModelo}</td>
                    <td>
                      <span
                        className={styles[mov.tipoMovimiento.toLowerCase()]}
                      >
                        {mov.tipoMovimiento}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
