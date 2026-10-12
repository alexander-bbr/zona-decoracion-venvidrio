import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type {
  DashboardDataItem,
  VisibleMetrics,
  Totales,
} from "../../../../types";
import styles from "./lineal.module.css";

const COLORS = {
  envasesLisos: "#3562d3",
  envasesDecorados: "#0a9c7d",
  envasesPerdidos: "#f26c4f",
  eficiencia: "#7c3aed",
  deficiencia: "#d946ef",
};

type LinealProps = {
  data: DashboardDataItem[];
  visibleMetrics: VisibleMetrics;
  totales: Totales;
};

export const Lineal = ({ data, visibleMetrics }: LinealProps) => {
  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
