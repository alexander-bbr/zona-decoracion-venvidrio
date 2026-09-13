import { useEffect, useState } from "react";
import styles from "./listar-inventario.module.css";

type Insumo = {
  idInsumo: number;
  tipo: string;
  articulo: string;
  unidad: string;
  cantidadActual: number;
  cantidadMinima: number;
};

const API_INSUMOS = "http://127.0.0.1:8000/api/inventario-insumos";

export const ListarInventario = () => {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarInsumos = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(API_INSUMOS);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.detail ?? `Error al cargar inventario: ${response.status}`,
          );
        }
        const data = (await response.json()) as Insumo[];
        const ordenados = [...data].sort(
          (a, b) =>
            a.tipo.localeCompare(b.tipo) ||
            a.articulo.localeCompare(b.articulo),
        );
        setInsumos(ordenados);
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
    void cargarInsumos();
  }, []);

  const esBajoStock = (insumo: Insumo) =>
    insumo.cantidadActual <= insumo.cantidadMinima;

  return (
    <section className={`content`}>
      {cargando && <p className={styles.loading}>Cargando inventario...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!cargando && !error && (
        <div className={`${styles.cardsContainer} content`}>
          {insumos.length === 0 ? (
            <p className={styles.emptyMessage}>
              No hay insumos registrados en el inventario.
            </p>
          ) : (
            insumos.map((insumo) => (
              <article
                key={insumo.idInsumo}
                className={`${styles.card} ${
                  esBajoStock(insumo) ? styles.cardBajoStock : ""
                }`}
              >
                <header className={styles.cardHeader}>
                  <div className={styles.cardInfoItemWrapper}>
                    <span className={styles.cardTipo}>{insumo.tipo}</span>
                    <span className={styles.cardId}>ID: {insumo.idInsumo}</span>
                  </div>

                  {esBajoStock(insumo) ? (
                    <div className={styles.badgeBajoStock}>
                      <span>⚠️</span>
                      <span>Bajo stock</span>
                    </div>
                  ) : (
                    <span className={styles.badgeOk}>
                      <span>✅</span>
                      <span>OK</span>
                    </span>
                  )}
                </header>

                <h4 className={styles.cardArticulo}>{insumo.articulo}</h4>

                <div className={styles.cardData}>
                  <div className={styles.dataItem}>
                    <span className={styles.dataLabel}>Cantidad actual</span>
                    <span className={styles.dataValue}>
                      {insumo.cantidadActual} {insumo.unidad}
                    </span>
                  </div>
                  <div className={styles.dataItem}>
                    <span className={styles.dataLabel}>Cantidad mínima</span>
                    <span className={styles.dataValue}>
                      {insumo.cantidadMinima} {insumo.unidad}
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
