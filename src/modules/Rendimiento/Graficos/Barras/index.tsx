import {
  BarChart,
  Bar,
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
import styles from "./barras.module.css";

const COLORS = {
  envasesLisos: "#3562d3",
  envasesDecorados: "#0a9c7d",
  envasesPerdidos: "#f26c4f",
  eficiencia: "#7c3aed",
  deficiencia: "#d946ef",
};

type BarrasProps = {
  data: DashboardDataItem[];
  visibleMetrics: VisibleMetrics;
  totales: Totales;
};

export const Barras = ({ data, visibleMetrics }: BarrasProps) => {
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
