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
import type { DashboardDataItem, VisibleMetrics } from "../../../../types";
import styles from "./Barras.module.css";

const COLORS = {
  produceLisa: "#3562d3",
  envasesDecorados: "#0a9c7d",
  envasesDefectuosos: "#f26c4f",
};

type BarrasProps = {
  data: DashboardDataItem[];
  visibleMetrics: VisibleMetrics;
};

export const Barras = ({ data, visibleMetrics }: BarrasProps) => {
  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 16, left: 0, bottom: 10 }}
        >
          <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
          <XAxis dataKey="date" tick={{ fill: "#5a6777", fontSize: 12 }} />
          <YAxis tick={{ fill: "#5a6777", fontSize: 12 }} />
          <Tooltip />
          <Legend verticalAlign="top" height={40} />
          {visibleMetrics.produceLisa && (
            <Bar
              dataKey="produceLisa"
              name="Producción Lisa"
              fill={COLORS.produceLisa}
              radius={[8, 8, 0, 0]}
            />
          )}
          {visibleMetrics.envasesDecorados && (
            <Bar
              dataKey="envasesDecorados"
              name="Envases Decorados"
              fill={COLORS.envasesDecorados}
              radius={[8, 8, 0, 0]}
            />
          )}
          {visibleMetrics.envasesDefectuosos && (
            <Bar
              dataKey="envasesDefectuosos"
              name="Envases con Defectos"
              fill={COLORS.envasesDefectuosos}
              radius={[8, 8, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
