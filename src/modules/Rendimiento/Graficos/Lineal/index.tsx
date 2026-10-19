import {
  LineChart,
  Line,
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
import styles from "./lineal.module.css";

const COLORS = {
  envasesLisos: "#3562d3",
  envasesDecorados: "#0a9c7d",
  envasesPerdidos: "#f26c4f",
  pantallasFabricadas: "#0ea5e9",
  pantallasConsumidas: "#f59e0b",
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

type LinealProps = {
  data: DashboardDataItem[];
  visibleMetrics: VisibleMetrics;
  totales: Totales;
  metaActiva: MetaActiva | null;
};

export const Lineal = ({ data, visibleMetrics, metaActiva }: LinealProps) => {
  const mostrarMeta = visibleMetrics.meta && metaActiva !== null;

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
          <XAxis dataKey="date" tick={{ fill: "#5a6777", fontSize: 12 }} />
          {/* Eje izquierdo: envases y pantallas */}
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

          {visibleMetrics.envasesLisos && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="envasesLisos"
              name="Envases Lisos"
              stroke={COLORS.envasesLisos}
              strokeWidth={3}
              dot={false}
            />
          )}
          {visibleMetrics.envasesDecorados && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="envasesDecorados"
              name="Envases Decorados"
              stroke={COLORS.envasesDecorados}
              strokeWidth={3}
              dot={false}
            />
          )}
          {visibleMetrics.envasesPerdidos && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="envasesPerdidos"
              name="Envases Perdidos"
              stroke={COLORS.envasesPerdidos}
              strokeWidth={3}
              dot={false}
            />
          )}
          {visibleMetrics.pantallasFabricadas && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="pantallasFabricadas"
              name="Pantallas Fabricadas"
              stroke={COLORS.pantallasFabricadas}
              strokeWidth={3}
              dot={false}
            />
          )}
          {visibleMetrics.pantallasConsumidas && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="pantallasConsumidas"
              name="Pantallas Consumidas"
              stroke={COLORS.pantallasConsumidas}
              strokeWidth={3}
              dot={false}
            />
          )}
          {visibleMetrics.eficiencia && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="eficiencia"
              name="Eficiencia"
              stroke={COLORS.eficiencia}
              strokeWidth={3}
              dot={false}
              strokeDasharray="5 3"
            />
          )}
          {visibleMetrics.deficiencia && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="deficiencia"
              name="Deficiencia"
              stroke={COLORS.deficiencia}
              strokeWidth={3}
              dot={false}
              strokeDasharray="5 3"
            />
          )}

          {/* Línea de referencia: Meta activa (La colocamos al final para que se dibuje ENCIMA de las demás series) */}
          {mostrarMeta && metaActiva !== null && (
            <ReferenceLine
              yAxisId="right"
              y={metaActiva.valor}
              stroke={COLORS.meta}
              strokeDasharray="6 4"
              strokeWidth={2}
              ifOverflow="extendDomain"
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
