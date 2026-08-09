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
import type { DashboardDataItem, VisibleMetrics } from "../../../../types";
import styles from "./Lineal.module.css";

const COLORS = {
  produceLisa: "#3562d3",
  envasesDecorados: "#0a9c7d",
  envasesDefectuosos: "#f26c4f",
};

type LinealProps = {
  data: DashboardDataItem[];
  visibleMetrics: VisibleMetrics;
};

export const Lineal = ({ data, visibleMetrics }: LinealProps) => {
  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
          <XAxis dataKey="date" tick={{ fill: "#5a6777", fontSize: 12 }} />
          <YAxis tick={{ fill: "#5a6777", fontSize: 12 }} />
          <Tooltip />
          <Legend verticalAlign="top" height={40} />
          {visibleMetrics.produceLisa && (
            <Line
              type="monotone"
              dataKey="produceLisa"
              name="Producción Lisa"
              stroke={COLORS.produceLisa}
              strokeWidth={3}
              dot={false}
            />
          )}
          {visibleMetrics.envasesDecorados && (
            <Line
              type="monotone"
              dataKey="envasesDecorados"
              name="Envases Decorados"
              stroke={COLORS.envasesDecorados}
              strokeWidth={3}
              dot={false}
            />
          )}
          {visibleMetrics.envasesDefectuosos && (
            <Line
              type="monotone"
              dataKey="envasesDefectuosos"
              name="Envases con Defectos"
              stroke={COLORS.envasesDefectuosos}
              strokeWidth={3}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
