import { useMemo, useState, useEffect } from "react";
import { Lineal } from "./Graficos/Lineal";
import { Barras } from "./Graficos/Barras";
import { Torta } from "./Graficos/Torta";
import type { ChartType, DashboardDataItem, VisibleMetrics } from "../../types";
import styles from "./Dashboard.module.css";

const chartOptions = [
  { value: "lineal" as const, label: "Lineal" },
  { value: "barras" as const, label: "Barras" },
  { value: "torta" as const, label: "Torta" },
];

const visibleMetricLabels: Record<keyof VisibleMetrics, string> = {
  produceLisa: "Producción Lisa",
  envasesDecorados: "Envases Decorados",
  envasesDefectuosos: "Envases con Defectos",
};

export const Dashboard = () => {
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-07-05");
  const [chartType, setChartType] = useState<ChartType>("lineal");
  const [visibleMetrics, setVisibleMetrics] = useState<VisibleMetrics>({
    produceLisa: true,
    envasesDecorados: true,
    envasesDefectuosos: true,
  });

  const [apiData, setApiData] = useState<DashboardDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar los datos cuando el usuario coloque las fechas
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `http://127.0.0.1:8000/api/dashboard/datos?fromDate=${fromDate}&toDate=${toDate}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();

        //* La API devuelve { status: "string", data: [...] }, por lo que extraemos solo el array 'data', ya que es el que nos interesa
        setApiData(result.data || []);
      } catch (e) {
        console.error(`Error encontrado: ${e}`);
        setError(e instanceof Error ? e.message : "Error al cargar los datos");
        setApiData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  //* Utilizamos useMemo por si necesitamos ordenar o transformar los datos
  //? Revisar si es necesario, o si podemos eliminar esta función
  const chartData = useMemo(() => {
    // Si quieres ordenar por fecha (por si acaso)
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

  return (
    <div className={styles.container}>
      {/* Título del módulo*/}
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Dashboard</h2>
        <p className={styles.moduleSubtitle}>
          Análisis estadísitico de la producción
        </p>
      </header>

      <section className={`${styles.dashboard} content`}>
        {/* Panel de control */}
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
          <div className={`${styles.controlWrapper} ${styles.checkboxList}`}>
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

        {/* Estadísticas */}
        <section className={styles.chartArea}>
          <h3 className={styles.chartTitle}>Estadísticas</h3>
          {isLoading ? (
            <p className={styles.loading}>Cargando datos...</p>
          ) : error ? (
            <p className={styles.error}>¡Parece que hay un Error!: {error}</p>
          ) : hasData ? (
            <ChartComponent data={chartData} visibleMetrics={visibleMetrics} />
          ) : (
            <p className={styles.noData}>
              No hay datos para el período seleccionado. Ajusta las fechas.
            </p>
          )}
        </section>
      </section>
    </div>
  );
};
