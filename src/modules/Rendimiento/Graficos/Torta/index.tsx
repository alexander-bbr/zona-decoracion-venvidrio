import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DashboardDataItem, VisibleMetrics } from "../../../../types";
import styles from "./torta.module.css";

const COLORS = ["#3562d3", "#0a9c7d", "#f26c4f"];

type TortaProps = {
  data: DashboardDataItem[];
  visibleMetrics: VisibleMetrics;
};

export const Torta = ({ data, visibleMetrics }: TortaProps) => {
  const latest = data[data.length - 1];

  const slices = [
    {
      name: "Envases Lisos",
      value: visibleMetrics.envasesLisos ? (latest?.envasesLisos ?? 0) : 0,
    },
    {
      name: "Envases Decorados",
      value: visibleMetrics.envasesDecorados
        ? (latest?.envasesDecorados ?? 0)
        : 0,
    },
    {
      name: "Envases Perdidos",
      value: visibleMetrics.envasesPerdidos
        ? (latest?.envasesPerdidos ?? 0)
        : 0,
    },
  ].filter((item) => item.value > 0);

  if (slices.length === 0) {
    return (
      <div className={styles.noData}>
        Activa al menos una variable para ver este gráfico.
      </div>
    );
  }

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Tooltip />
          <Legend verticalAlign="top" height={40} />
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={120}
            label
          />
          {slices.map((_, index) => (
            <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
