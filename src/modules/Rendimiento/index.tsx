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
  PantallasResponse,
  Meta,
  MetaActiva,
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
  pantallasFabricadas: "Pantallas Fabricadas",
  pantallasConsumidas: "Pantallas Consumidas",
  eficiencia: "Eficiencia (%)",
  deficiencia: "Deficiencia (%)",
  meta: "Meta (%)",
};

//* Métricas que NO aplican al gráfico de Torta
const TORTA_HIDDEN_METRICS: (keyof VisibleMetrics)[] = [
  "pantallasFabricadas",
  "pantallasConsumidas",
  "eficiencia",
  "deficiencia",
  "meta",
];

//* Formatea un porcentaje: 85.0 -> "85", 85.5 -> "85.5", "85.50" -> "85.5"
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
  totalPantallasFabricadas: 0,
  totalPantallasConsumidas: 0,
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
    pantallasFabricadas: true,
    pantallasConsumidas: true,
    eficiencia: true,
    deficiencia: true,
    meta: true,
  });

  const [apiData, setApiData] = useState<DashboardDataItem[]>([]);
  const [totales, setTotales] = useState<Totales>(EMPTY_TOTALES);
  const [metaActiva, setMetaActiva] = useState<MetaActiva | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const baseUrl = "http://127.0.0.1:8000/api/rendimiento";
      const query = `desde=${fromDate}&hasta=${toDate}`;

      try {
        const [
          lisosRes,
          decoradosRes,
          perdidosRes,
          rendimientoRes,
          pantallasRes,
          metasRes,
        ] = await Promise.all([
          fetch(`${baseUrl}/lisos?${query}`),
          fetch(`${baseUrl}/decorados?${query}`),
          fetch(`${baseUrl}/perdidos?${query}`),
          fetch(`${baseUrl}/eficiencia-deficiencia?${query}`),
          fetch(`${baseUrl}/pantallas?${query}`),
          fetch(`${baseUrl}/metas`),
        ]);

        const parseSafe = async <T,>(res: Response): Promise<T | null> => {
          if (res.status === 404) return null;
          if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
          }
          return (await res.json()) as T;
        };

        const [lisos, decorados, perdidos, rendimiento, pantallas, metas] =
          await Promise.all([
            parseSafe<LisosResponse>(lisosRes),
            parseSafe<DecoradosResponse>(decoradosRes),
            parseSafe<PerdidosResponse>(perdidosRes),
            parseSafe<RendimientoResponse>(rendimientoRes),
            parseSafe<PantallasResponse>(pantallasRes),
            parseSafe<Meta[]>(metasRes),
          ]);

        setTotales({
          totalEnvasesLisos: lisos?.totalEnvasesLisos ?? 0,
          totalGruesasLisas: lisos?.totalGruesasLisas ?? "0",
          totalEnvasesDecorados: decorados?.totalEnvasesDecorados ?? 0,
          totalGruesasDecoradas: decorados?.totalGruesasDecoradas ?? "0",
          totalEnvasesPerdidos: perdidos?.totalEnvasesPerdidos ?? 0,
          totalGruesasPerdidas: perdidos?.totalGruesasPerdidas ?? "0",
          totalPantallasFabricadas: pantallas?.totalFabricadas ?? 0,
          totalPantallasConsumidas: pantallas?.totalConsumidas ?? 0,
          eficienciaGeneral: rendimiento?.eficienciaGeneral ?? 0,
          deficienciaGeneral: rendimiento?.deficienciaGeneral ?? 0,
        });

        //* Buscamos la meta activa (solo debería haber una) y guardamos valor + mes
        const meta = metas?.find((m) => m.estado === true);
        setMetaActiva(
          meta ? { valor: Number(meta.deficiencia), mes: meta.mes } : null,
        );

        const map = new Map<string, DashboardDataItem>();

        //* Helper para inicializar un item con todos los campos en 0
        const initItem = (fecha: string): DashboardDataItem => ({
          date: fecha,
          envasesLisos: 0,
          envasesDecorados: 0,
          envasesPerdidos: 0,
          pantallasFabricadas: 0,
          pantallasConsumidas: 0,
          eficiencia: 0,
          deficiencia: 0,
        });

        lisos?.registrosLisos.forEach((r) => {
          const item = initItem(r.fecha);
          item.envasesLisos = r.totalEnvasesLisos;
          map.set(r.fecha, item);
        });

        decorados?.registrosDecorados.forEach((r) => {
          const existing = map.get(r.fecha);
          if (existing) {
            existing.envasesDecorados = r.totalEnvasesDecorados;
          } else {
            const item = initItem(r.fecha);
            item.envasesDecorados = r.totalEnvasesDecorados;
            map.set(r.fecha, item);
          }
        });

        perdidos?.registrosPerdidos.forEach((r) => {
          const existing = map.get(r.fecha);
          if (existing) {
            existing.envasesPerdidos = r.totalEnvasesPerdidos;
          } else {
            const item = initItem(r.fecha);
            item.envasesPerdidos = r.totalEnvasesPerdidos;
            map.set(r.fecha, item);
          }
        });

        pantallas?.registrosPantallas.forEach((r) => {
          const existing = map.get(r.fecha);
          if (existing) {
            existing.pantallasFabricadas = r.totalFabricadas;
            existing.pantallasConsumidas = r.totalConsumidas;
          } else {
            const item = initItem(r.fecha);
            item.pantallasFabricadas = r.totalFabricadas;
            item.pantallasConsumidas = r.totalConsumidas;
            map.set(r.fecha, item);
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
            const item = initItem(r.fecha);
            item.eficiencia = eficiencia;
            item.deficiencia = deficiencia;
            map.set(r.fecha, item);
          }
        });

        setApiData(Array.from(map.values()));
      } catch (e) {
        console.error(`Error encontrado: ${e}`);
        setError(e instanceof Error ? e.message : "Error al cargar los datos");
        setApiData([]);
        setTotales(EMPTY_TOTALES);
        setMetaActiva(null);
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

  const isRoot = location.pathname === "/rendimiento";
  //* Mostrar subnav tanto los submódulos de Metas y Análisis de Moldes
  const showSubNav =
    location.pathname === "/rendimiento/metas" ||
    location.pathname === "/rendimiento/analis-moldes";

  //* Métricas visibles según el tipo de gráfico seleccionado
  const metricasVisibles = (
    Object.keys(visibleMetricLabels) as (keyof VisibleMetrics)[]
  ).filter(
    (metric) => chartType !== "torta" || !TORTA_HIDDEN_METRICS.includes(metric),
  );

  return (
    <section className="container content">
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Rendimiento</h2>
        <p className={styles.moduleSubtitle}>
          Análisis estadísitico de la producción
        </p>
      </header>

      {showSubNav && (
        <nav className={styles.subNav} id="subNav">
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
          <span className={styles.subNavTitle}>
            {location.pathname === "/rendimiento/analis-moldes"
              ? "Análisis de Moldes"
              : "Metas"}
          </span>
        </nav>
      )}

      {isRoot ? (
        <>
          <section className={`${styles.dashboard} content-only-animation`}>
            {/* === PANEL DE CONTROL === */}
            <section className={styles.controls}>
              {/* Botones principales */}
              <div className={styles.mainButtons}>
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

                {/* Botones de Enlace */}
                <div className={styles.linkButtons}>
                  <NavLink
                    to="/rendimiento/analis-moldes"
                    className={styles.moldAnalysis}
                  >
                    Análisis de Moldes
                  </NavLink>
                  <NavLink
                    to="/rendimiento/metas"
                    className={styles.objectivesModule}
                  >
                    Metas
                  </NavLink>
                </div>
              </div>

              {/* Variables a observar */}
              <div className={styles.checkboxList}>
                {metricasVisibles.map((metric) => {
                  //* Deshabilitamos el checkbox de la meta si no hay meta activa
                  const disabled = metric === "meta" && metaActiva === null;
                  return (
                    <label
                      className={styles.checkboxItem}
                      key={metric}
                      title={
                        disabled
                          ? "No hay ninguna meta activa registrada"
                          : undefined
                      }
                    >
                      <input
                        type="checkbox"
                        checked={visibleMetrics[metric]}
                        onChange={() => toggleMetric(metric)}
                        disabled={disabled}
                      />
                      {visibleMetricLabels[metric]}
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
                    metaActiva={metaActiva}
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
                        Pantallas Fabricadas:
                      </span>{" "}
                      <strong>
                        {totales.totalPantallasFabricadas.toLocaleString(
                          "es-VE",
                        )}
                      </strong>
                    </p>
                    <p className={styles.totalItem}>
                      <span className={styles.totalLabel}>
                        Pantallas Consumidas:
                      </span>{" "}
                      <strong>
                        {totales.totalPantallasConsumidas.toLocaleString(
                          "es-VE",
                        )}
                      </strong>
                    </p>
                    <p className={styles.totalItem}>
                      <span className={styles.totalLabel}>
                        Eficiencia General:
                      </span>{" "}
                      <strong>
                        {formatearPorcentaje(totales.eficienciaGeneral)}%
                      </strong>
                    </p>
                    <p className={styles.totalItem}>
                      <span className={styles.totalLabel}>
                        Deficiencia General:
                      </span>{" "}
                      <strong>
                        {formatearPorcentaje(totales.deficienciaGeneral)}%
                      </strong>
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
        </>
      ) : (
        <Outlet />
      )}
    </section>
  );
};
