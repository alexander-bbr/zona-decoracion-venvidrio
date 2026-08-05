import { useEffect, useState } from "react";
import styles from "./inventario-produccion-lisa.module.css";

type envases = {
  id_inventariopl: number;
  modelo: string;
  cantidad_actual: number;
};

type ApiResponse = {
  data: envases[];
};

export const InventarioProduccionLisa = () => {
  const [envase, setEnvase] = useState<envases[]>([]);

  // Obtener envases
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/produccion-lisa/inventario")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((response: ApiResponse) => {
        setEnvase(response.data);
      })
      .catch((e) => {
        console.log(`Error en la búsqueda del inventario: ${e}`);
      });
  }, []);

  // Generar clases para estilizar cada envase
  const getModel = (modelo: string) => {
    return styles[`${modelo.toLowerCase().replace(/\s+/g, "-")}-model`];
  };

  /* === RENDERIZADO === */
  return (
    <section className={styles.glassesContainer}>
      {envase.length > 0 ? (
        envase.map((envase) => (
          <article
            key={envase.id_inventariopl}
            className={`${styles.glass} ${getModel(envase.modelo)}`}
          >
            <h3 className={styles.glassName}>{envase.modelo}</h3>
            <p className={styles.glassStock}>Stock: {envase.cantidad_actual}</p>
          </article>
        ))
      ) : (
        <p>Cargando Envases...</p>
      )}
    </section>
  );
};
