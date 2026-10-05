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
import styles from "./lineal.module.css";

const COLORS = {
  envasesLisos: "#3562d3",
  envasesDecorados: "#0a9c7d",
  envasesPerdidos: "#f26c4f",
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
          {visibleMetrics.envasesLisos && (
            <Line
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
              type="monotone"
              dataKey="envasesPerdidos"
              name="Envases Perdidos"
              stroke={COLORS.envasesPerdidos}
              strokeWidth={3}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
