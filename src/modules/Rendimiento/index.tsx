import { useMemo, useState, useEffect } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { Lineal } from "./Graficos/Lineal";
import { Barras } from "./Graficos/Barras";
import { Torta } from "./Graficos/Torta";
import type {
  ChartType,
  DashboardDataItem,
  VisibleMetrics,
  Totales,
  LisosResponse,
  DecoradosResponse,
  PerdidosResponse,
  RendimientoResponse,
} from "../../types";
import styles from "./rendimiento.module.css";

const chartOptions = [
  { value: "lineal" as const, label: "Lineal" },
  { value: "barras" as const, label: "Barras" },
  { value: "torta" as const, label: "Torta" },
];

const visibleMetricLabels: Record<keyof VisibleMetrics, string> = {
  envasesLisos: "Envases Lisos",
  envasesDecorados: "Envases Decorados",
  envasesPerdidos: "Envases Perdidos",
  eficiencia: "Eficiencia (%)",
  deficiencia: "Deficiencia (%)",
};

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

const EMPTY_TOTALES: Totales = {
  totalEnvasesLisos: 0,
  totalGruesasLisas: "0",
  totalEnvasesDecorados: 0,
  totalGruesasDecoradas: "0",
  totalEnvasesPerdidos: 0,
  totalGruesasPerdidas: "0",
  eficienciaGeneral: 0,
  deficienciaGeneral: 0,
};

export const Rendimiento = () => {
  const location = useLocation();
  const todayVenezuela = useMemo(() => getTodayVenezuela(), []);

  const [fromDate, setFromDate] = useState(getStartOfYearVenezuela());
  const [toDate, setToDate] = useState(todayVenezuela);
  const [chartType, setChartType] = useState<ChartType>("lineal");
  const [visibleMetrics, setVisibleMetrics] = useState<VisibleMetrics>({
    envasesLisos: true,
    envasesDecorados: true,
    envasesPerdidos: true,
    eficiencia: true,
    deficiencia: true,
  });

  const [apiData, setApiData] = useState<DashboardDataItem[]>([]);
  const [totales, setTotales] = useState<Totales>(EMPTY_TOTALES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const baseUrl = "http://127.0.0.1:8000/api/rendimiento";
      const query = `desde=${fromDate}&hasta=${toDate}`;

      try {
        const [lisosRes, decoradosRes, perdidosRes, rendimientoRes] =
          await Promise.all([
            fetch(`${baseUrl}/lisos?${query}`),
            fetch(`${baseUrl}/decorados?${query}`),
            fetch(`${baseUrl}/perdidos?${query}`),
            fetch(`${baseUrl}/eficiencia-deficiencia?${query}`),
          ]);

        const parseSafe = async <T,>(res: Response): Promise<T | null> => {
          if (res.status === 404) return null;
          if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
          }
          return (await res.json()) as T;
        };

        const [lisos, decorados, perdidos, rendimiento] = await Promise.all([
          parseSafe<LisosResponse>(lisosRes),
          parseSafe<DecoradosResponse>(decoradosRes),
          parseSafe<PerdidosResponse>(perdidosRes),
          parseSafe<RendimientoResponse>(rendimientoRes),
        ]);

        setTotales({
          totalEnvasesLisos: lisos?.totalEnvasesLisos ?? 0,
          totalGruesasLisas: lisos?.totalGruesasLisas ?? "0",
          totalEnvasesDecorados: decorados?.totalEnvasesDecorados ?? 0,
          totalGruesasDecoradas: decorados?.totalGruesasDecoradas ?? "0",
          totalEnvasesPerdidos: perdidos?.totalEnvasesPerdidos ?? 0,
          totalGruesasPerdidas: perdidos?.totalGruesasPerdidas ?? "0",
          eficienciaGeneral: rendimiento?.eficienciaGeneral ?? 0,
          deficienciaGeneral: rendimiento?.deficienciaGeneral ?? 0,
        });

        const map = new Map<string, DashboardDataItem>();

        lisos?.registrosLisos.forEach((r) => {
          map.set(r.fecha, {
            date: r.fecha,
            envasesLisos: r.totalEnvasesLisos,
            envasesDecorados: 0,
            envasesPerdidos: 0,
            eficiencia: 0,
            deficiencia: 0,
          });
        });

        decorados?.registrosDecorados.forEach((r) => {
          const existing = map.get(r.fecha);
          if (existing) {
            existing.envasesDecorados = r.totalEnvasesDecorados;
          } else {
            map.set(r.fecha, {
              date: r.fecha,
              envasesLisos: 0,
              envasesDecorados: r.totalEnvasesDecorados,
              envasesPerdidos: 0,
              eficiencia: 0,
              deficiencia: 0,
            });
          }
        });

        perdidos?.registrosPerdidos.forEach((r) => {
          const existing = map.get(r.fecha);
          if (existing) {
            existing.envasesPerdidos = r.totalEnvasesPerdidos;
          } else {
            map.set(r.fecha, {
              date: r.fecha,
              envasesLisos: 0,
              envasesDecorados: 0,
              envasesPerdidos: r.totalEnvasesPerdidos,
              eficiencia: 0,
              deficiencia: 0,
            });
          }
        });

        rendimiento?.rendimiento.forEach((r) => {
          const existing = map.get(r.fecha);
          const eficiencia = r.eficiencia;
          const deficiencia = Number(r.deficiencia);
          if (existing) {
            existing.eficiencia = eficiencia;
            existing.deficiencia = deficiencia;
          } else {
            map.set(r.fecha, {
              date: r.fecha,
              envasesLisos: 0,
              envasesDecorados: 0,
              envasesPerdidos: 0,
              eficiencia,
              deficiencia,
            });
          }
        });

        setApiData(Array.from(map.values()));
      } catch (e) {
        console.error(`Error encontrado: ${e}`);
        setError(e instanceof Error ? e.message : "Error al cargar los datos");
        setApiData([]);
        setTotales(EMPTY_TOTALES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  const chartData = useMemo(() => {
    return [...apiData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [apiData]);

  const hasData = chartData.length > 0;

  const toggleMetric = (metric: keyof VisibleMetrics) => {
    setVisibleMetrics((current) => ({
      ...current,
      [metric]: !current[metric],
    }));
  };

  const ChartComponent =
    chartType === "lineal" ? Lineal : chartType === "barras" ? Barras : Torta;

  //* ¿Estamos en la raíz /rendimiento?
  const isRoot = location.pathname === "/rendimiento";

  //* Solo mostramos el subnav en /rendimiento/metas (no en subrutas más profundas,
  //* porque ahí el subnav lo maneja el propio componente Metas)
  const showSubNav = location.pathname === "/rendimiento/metas";

  return (
    <section className="container content">
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Rendimiento</h2>
        <p className={styles.moduleSubtitle}>
          Análisis estadísitico de la producción
        </p>
      </header>

      {/* Subnav SOLO cuando estamos exactamente en /rendimiento/metas */}
      {showSubNav && (
        <nav className={`${styles.subNav}`} id="subNav">
          <NavLink
            to="/rendimiento"
            className={({ isActive }) =>
              isActive
                ? `${styles.subNavLink} ${styles.active}`
                : styles.subNavLink
            }
          >
            ← Volver
          </NavLink>
          <span className={styles.subNavTitle}>Metas</span>
        </nav>
      )}

      {isRoot ? (
        <>
          <section className={`${styles.dashboard} content-only-animation`}>
            {/* === PANEL DE CONTROL === */}
            <section className={styles.controls}>
              {/* Fecha Desde */}
              <div className={styles.controlWrapper}>
                <label htmlFor="fromDate" className={styles.controlLabel}>
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

              {/* Fecha Hasta */}
              <div className={styles.controlWrapper}>
                <label htmlFor="toDate" className={styles.controlLabel}>
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

              {/* Tipo de Gráfico */}
              <div className={styles.controlWrapper}>
                <label htmlFor="chartType" className={styles.controlLabel}>
                  Tipo de gráfico
                </label>
                <select
                  id="chartType"
                  className={styles.select}
                  value={chartType}
                  onChange={(event) =>
                    setChartType(event.target.value as ChartType)
                  }
                >
                  {chartOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variables a observar */}
              <div
                className={`${styles.controlWrapper} ${styles.checkboxList}`}
              >
                {Object.keys(visibleMetricLabels).map((metric) => {
                  const key = metric as keyof VisibleMetrics;
                  return (
                    <label className={styles.checkboxItem} key={metric}>
                      <input
                        type="checkbox"
                        checked={visibleMetrics[key]}
                        onChange={() => toggleMetric(key)}
                      />
                      {visibleMetricLabels[key]}
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Estadística */}
            <section className={styles.chartArea}>
              <h3 className={styles.chartTitle}>Estadística</h3>
              {isLoading ? (
                <p className={styles.loading}>Cargando datos...</p>
              ) : error ? (
                <p className={styles.error}>
                  ¡Parece que hay un Error!: {error}
                </p>
              ) : hasData ? (
                <>
                  <ChartComponent
                    data={chartData}
                    visibleMetrics={visibleMetrics}
                    totales={totales}
                  />

                  {/* Totales del período */}
                  <div className={styles.totalesContainer}>
                    <p className={styles.totalItem}>
                      <span className={styles.totalLabel}>Envases Lisos:</span>{" "}
                      <strong>
                        {totales.totalEnvasesLisos.toLocaleString("es-VE")}
                      </strong>{" "}
                      <span className={styles.totalGruesas}>
                        ({totales.totalGruesasLisas} gruesas)
                      </span>
                    </p>
                    <p className={styles.totalItem}>
                      <span className={styles.totalLabel}>
                        Envases Decorados:
                      </span>{" "}
                      <strong>
                        {totales.totalEnvasesDecorados.toLocaleString("es-VE")}
                      </strong>{" "}
                      <span className={styles.totalGruesas}>
                        ({totales.totalGruesasDecoradas} gruesas)
                      </span>
                    </p>
                    <p className={styles.totalItem}>
                      <span className={styles.totalLabel}>
                        Envases Perdidos:
                      </span>{" "}
                      <strong>
                        {totales.totalEnvasesPerdidos.toLocaleString("es-VE")}
                      </strong>{" "}
                      <span className={styles.totalGruesas}>
                        ({totales.totalGruesasPerdidas} gruesas)
                      </span>
                    </p>
                    <p className={styles.totalItem}>
                      <span className={styles.totalLabel}>
                        Eficiencia General:
                      </span>{" "}
                      <strong>{totales.eficienciaGeneral}%</strong>
                    </p>
                    <p className={styles.totalItem}>
                      <span className={styles.totalLabel}>
                        Deficiencia General:
                      </span>{" "}
                      <strong>{totales.deficienciaGeneral}%</strong>
                    </p>
                  </div>
                </>
              ) : (
                <p className={styles.noData}>
                  No hay datos para el período seleccionado. Ajusta las fechas.
                </p>
              )}
            </section>
          </section>

          {/* Link al submódulo de Metas */}
          <section className={`${styles.modulesLink}`}>
            <NavLink to="/rendimiento/metas" className={styles.moduleLinkCard}>
              <span className={styles.moduleLinkTitle}>Metas</span>
              <span className={styles.moduleLinkDesc}>
                Gestiona las metas de eficiencia y deficiencia mensuales
              </span>
            </NavLink>
          </section>
        </>
      ) : (
        <Outlet />
      )}
    </section>
  );
};
