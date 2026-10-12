import { useEffect, useState } from "react";
import styles from "./ver-inventario-pantallas.module.css";

type Pantalla = {
  idPantalla: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  cantidad: number;
};

const API_PANTALLAS = "http://127.0.0.1:8000/api/inventario-pantallas";

export const VerInventarioPantallas = () => {
  const [pantallas, setPantallas] = useState<Pantalla[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPantallas = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(API_PANTALLAS);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.detail ?? `Error al cargar inventario: ${response.status}`,
          );
        }
        const data = (await response.json()) as Pantalla[];
        const normalizados = data.map((pantalla) => ({
          ...pantalla,
          idPantalla: Number(pantalla.idPantalla),
          cantidad: Number(pantalla.cantidad),
        }));
        const ordenados = normalizados.sort(
          (a, b) =>
            a.tipo.localeCompare(b.tipo) || a.nombre.localeCompare(b.nombre),
        );
        setPantallas(ordenados);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar el inventario.",
        );
      } finally {
        setCargando(false);
      }
    };
    void cargarPantallas();
  }, []);

  const esBajoStock = (pantalla: Pantalla) => pantalla.cantidad <= 0;

  return (
    <section className={`content`}>
      {cargando && <p className={styles.loading}>Cargando inventario...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!cargando && !error && (
        <div className={`${styles.cardsContainer} content`}>
          {pantallas.length === 0 ? (
            <p className={styles.emptyMessage}>
              No hay pantallas registradas en el inventario.
            </p>
          ) : (
            pantallas.map((pantalla) => (
              <article
                key={pantalla.idPantalla}
                className={`${styles.card} ${
                  esBajoStock(pantalla) ? styles.cardBajoStock : ""
                }`}
              >
                <header className={styles.cardHeader}>
                  <div className={styles.cardInfoItemWrapper}>
                    <span className={styles.cardTipo}>{pantalla.tipo}</span>
                    <span className={styles.cardId}>
                      ID: {pantalla.idPantalla}
                    </span>
                  </div>

                  {esBajoStock(pantalla) ? (
                    <div className={styles.badgeBajoStock}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-alert-triangle"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <span>Sin stock</span>
                    </div>
                  ) : (
                    <span className={styles.badgeOk}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-check"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>OK</span>
                    </span>
                  )}
                </header>

                <h4 className={styles.cardArticulo}>{pantalla.nombre}</h4>

                <p className={styles.cardDescripcion}>{pantalla.descripcion}</p>

                <div className={styles.cardData}>
                  <div className={styles.dataItem}>
                    <span className={styles.dataLabel}>Cantidad actual</span>
                    <span className={styles.dataValue}>
                      {pantalla.cantidad}
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
};
