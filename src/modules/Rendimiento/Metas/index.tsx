import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import styles from "./metas.module.css";

type Meta = {
  idMeta: number;
  anio: number;
  mes: string;
  deficiencia: number;
  estado: boolean;
};

const API_METAS = "http://127.0.0.1:8000/api/rendimiento/metas";

export const Metas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [metas, setMetas] = useState<Meta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarMetas = async () => {
    setCargando(true);
    setError("");
    try {
      const response = await fetch(API_METAS);
      if (!response.ok) {
        throw new Error(`Error al cargar metas: ${response.status}`);
      }
      const data = await response.json();
      //* Normalizamos tipos por si el backend manda algún valor como string
      const metasNormalizadas: Meta[] = data.map((meta: Meta) => ({
        ...meta,
        idMeta: Number(meta.idMeta),
        anio: Number(meta.anio),
        deficiencia: Number(meta.deficiencia),
        estado: Boolean(meta.estado),
      }));
      setMetas(metasNormalizadas);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Error al cargar metas.",
      );
    } finally {
      setCargando(false);
    }
  };

  //* Cargar metas al montar el componente
  useEffect(() => {
    cargarMetas();
  }, []);

  //* Recargar cuando volvemos a la raíz (al salir de registrar/editar)
  useEffect(() => {
    if (location.pathname === "/rendimiento/metas") {
      cargarMetas();
    }
  }, [location.pathname]);

  const isRoot = location.pathname === "/rendimiento/metas";

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("registrar-meta")) return "Registrar Meta";
    if (path.includes("editar-meta")) return "Editar Meta";
    return "";
  };

  return (
    <section className={styles.metasSection}>
      {!isRoot ? (
        <nav className={`${styles.subNav} content`} id="subNav">
          <NavLink
            to="/rendimiento/metas"
            className={({ isActive }) =>
              isActive
                ? `${styles.subNavLink} ${styles.active}`
                : styles.subNavLink
            }
          >
            ← Volver
          </NavLink>
          <span className={styles.subNavTitle}>{getTitle()}</span>
        </nav>
      ) : null}

      {isRoot ? (
        <section className={`${styles.metas} content`}>
          {/* === PANEL DE CONTROL === */}
          <section className={styles.controlPanel}>
            <h2 className={styles.title}>Listado de Metas</h2>

            <div className={styles.buttonWrapper}>
              <button
                className={styles.registerButton}
                onClick={() => navigate("registrar-meta")}
              >
                + Registrar Meta
              </button>
            </div>
          </section>

          {cargando && <p className={styles.loading}>Cargando metas...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!cargando && !error && (
            <div className={styles.tableContainer}>
              {metas.length === 0 ? (
                <p className={styles.emptyMessage}>No hay metas registradas.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Año</th>
                      <th>Mes</th>
                      <th>Deficiencia</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metas.map((meta) => (
                      <tr
                        key={meta.idMeta}
                        onClick={() => navigate(`editar-meta/${meta.idMeta}`)}
                        className={styles.clickableRow}
                      >
                        <td>{meta.anio}</td>
                        <td className={styles.mesCell}>{meta.mes}</td>
                        <td>{meta.deficiencia}%</td>
                        <td>
                          <span
                            className={
                              meta.estado
                                ? `${styles.estadoBadge} ${styles.estadoActivo}`
                                : `${styles.estadoBadge} ${styles.estadoInactivo}`
                            }
                          >
                            {meta.estado ? "Cumplida" : "Pendiente"}
                          </span>
                        </td>
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
