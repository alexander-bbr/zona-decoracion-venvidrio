import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type {
  DashboardDataItem,
  VisibleMetrics,
  Totales,
  MetaActiva,
} from "../../../../types";
import styles from "./barras.module.css";

const COLORS = {
  envasesLisos: "#3562d3",
  envasesDecorados: "#0a9c7d",
  envasesPerdidos: "#f26c4f",
  eficiencia: "#7c3aed",
  deficiencia: "#d946ef",
  meta: "#e11d48",
};

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

//* Capitaliza la primera letra: "octubre" -> "Octubre"
const capitalizar = (texto: string): string =>
  texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

type BarrasProps = {
  data: DashboardDataItem[];
  visibleMetrics: VisibleMetrics;
  totales: Totales;
  metaActiva: MetaActiva | null;
};

export const Barras = ({ data, visibleMetrics, metaActiva }: BarrasProps) => {
  const mostrarMeta = visibleMetrics.meta && metaActiva !== null;

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
          <XAxis dataKey="date" tick={{ fill: "#5a6777", fontSize: 12 }} />
          {/* Eje izquierdo: envases */}
          <YAxis yAxisId="left" tick={{ fill: "#5a6777", fontSize: 12 }} />
          {/* Eje derecho: porcentajes (0-100) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fill: "#5a6777", fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value, name) => {
              const numValue =
                typeof value === "number" ? value : Number(value);
              if (name === "Eficiencia" || name === "Deficiencia") {
                return [`${numValue}%`, name];
              }
              return [numValue.toLocaleString("es-VE"), name];
            }}
          />
          <Legend
            verticalAlign="top"
            height={60}
            wrapperStyle={{ paddingBottom: "20px" }}
          />

          {/* Línea de referencia: Meta activa */}
          {mostrarMeta && metaActiva !== null && (
            <ReferenceLine
              yAxisId="right"
              y={metaActiva.valor}
              stroke={COLORS.meta}
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: `Meta de Deficiencia (${capitalizar(
                  metaActiva.mes,
                )}): ${formatearPorcentaje(metaActiva.valor)}%`,
                position: "insideTopRight",
                fill: COLORS.meta,
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          )}

          {visibleMetrics.envasesLisos && (
            <Bar
              yAxisId="left"
              dataKey="envasesLisos"
              name="Envases Lisos"
              fill={COLORS.envasesLisos}
              radius={[8, 8, 0, 0]}
            />
          )}
          {visibleMetrics.envasesDecorados && (
            <Bar
              yAxisId="left"
              dataKey="envasesDecorados"
              name="Envases Decorados"
              fill={COLORS.envasesDecorados}
              radius={[8, 8, 0, 0]}
            />
          )}
          {visibleMetrics.envasesPerdidos && (
            <Bar
              yAxisId="left"
              dataKey="envasesPerdidos"
              name="Envases Perdidos"
              fill={COLORS.envasesPerdidos}
              radius={[8, 8, 0, 0]}
            />
          )}
          {visibleMetrics.eficiencia && (
            <Bar
              yAxisId="right"
              dataKey="eficiencia"
              name="Eficiencia"
              fill={COLORS.eficiencia}
              radius={[8, 8, 0, 0]}
            />
          )}
          {visibleMetrics.deficiencia && (
            <Bar
              yAxisId="right"
              dataKey="deficiencia"
              name="Deficiencia"
              fill={COLORS.deficiencia}
              radius={[8, 8, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
