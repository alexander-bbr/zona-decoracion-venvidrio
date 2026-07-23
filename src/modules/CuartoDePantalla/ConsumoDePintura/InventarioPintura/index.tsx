import { useEffect, useState } from "react";
import styles from "./inventario-pintura.module.css";

type PinturaData = {
  id: number;
  color: string;
  cantidad_actual: number;
  cantidad_minima_alerta: number;
};

type ApiResponse = {
  data: PinturaData[];
};

export const InventarioPintura = () => {
  const [pinturas, setPinturas] = useState<PinturaData[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/pintura/inventario")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data: ApiResponse) => {
        setPinturas(data.data);
      })
      .catch((e) => {
        console.log(`Error en la búsqueda del inventario: ${e}`);
      });
  }, []);

  // Generar clases para asignar colores y estilos en el CSS
  const getColorClass = (color: string) => {
    return styles[`color-${color.toLowerCase().replace(/\s+/g, "-")}`];
  };

  return (
    <section className={styles.paintingContainer}>
      {pinturas.length > 0 ? (
        pinturas.map((pintura) => (
          <div
            key={pintura.id}
            className={`${styles.painting} ${getColorClass(pintura.color) || ""}`}
          >
            <h3 className={styles.paintingName}>{pintura.color}</h3>
            <p className={styles.stock}>
              Stock: {pintura.cantidad_actual}
              <span style={{ color: "grey" }}> L</span>
            </p>

            {/* Mostrar alertas si los niveles de pintura son bajos */}
            {pintura.cantidad_actual <= pintura.cantidad_minima_alerta && (
              <div className={styles.alert}>
                <span>⚠️</span> ¡Stock bajo!
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Cargando pinturas...</p>
      )}
    </section>
  );
};
