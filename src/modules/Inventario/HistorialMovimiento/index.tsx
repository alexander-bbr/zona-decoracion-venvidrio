import { useEffect, useState } from "react";
import { mockFetch } from "../../../mocks/inventarioMock";
import styles from "./historial-movimiento.module.css";

type Movimiento = {
  idInventarioEntrada?: number;
  idInventarioSalida?: number;
  idInsumo: number;
  fecha: string;
  encargado: string;
  turno: string;
  grupo: string;
  cantidad: number;
};

const API_HISTORIAL = "http://127.0.0.1:8000/api/inventario-insumos/historial";

const LIMIT = 50;

export const HistorialMovimiento = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(false);

  const inicio = (pagina - 1) * LIMIT;
  const fin = inicio + movimientos.length;

  const cargarHistorial = async (paginaActual: number) => {
    setCargando(true);
    setError("");
    try {
      const skip = (paginaActual - 1) * LIMIT;
      const url = `${API_HISTORIAL}?skip=${skip}&limit=${LIMIT}`;
      const response = await mockFetch(url);

      if (!response.ok) {
        throw new Error(`Error al cargar historial: ${response.status}`);
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

  return (
    <section className={`${styles.historialMovimiento} content`}>
      <section className={styles.controlPanel}>
        <h2 className={styles.title}>Historial de Movimientos</h2>
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
                    <th>ID Insumo</th>
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
                      key={`${mov.idInsumo}-${mov.fecha}-${index}`}
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
                      <td>{mov.idInsumo}</td>
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
    </section>
  );
};
