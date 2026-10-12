import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type {
  DashboardDataItem,
  VisibleMetrics,
  Totales,
} from "../../../../types";
import styles from "./torta.module.css";

//* Mismos colores que Barras y Lineal para envases
const COLORS = {
  envasesLisos: "#3562d3",
  envasesDecorados: "#0a9c7d",
  envasesPerdidos: "#f26c4f",
};

type TortaProps = {
  data: DashboardDataItem[];
  visibleMetrics: VisibleMetrics;
  totales: Totales;
};

export const Torta = ({ visibleMetrics, totales }: TortaProps) => {
  //* Usamos los totales del período (no el último registro)
  const slices = [
    {
      name: "Envases Lisos",
      value: visibleMetrics.envasesLisos ? totales.totalEnvasesLisos : 0,
      color: COLORS.envasesLisos,
    },
    {
      name: "Envases Decorados",
      value: visibleMetrics.envasesDecorados
        ? totales.totalEnvasesDecorados
        : 0,
      color: COLORS.envasesDecorados,
    },
    {
      name: "Envases Perdidos",
      value: visibleMetrics.envasesPerdidos ? totales.totalEnvasesPerdidos : 0,
      color: COLORS.envasesPerdidos,
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
        <PieChart margin={{ top: 10, right: 0, bottom: 10, left: 0 }}>
          <Tooltip
            formatter={(value, name) => {
              const numValue =
                typeof value === "number" ? value : Number(value);
              return [numValue.toLocaleString("es-VE"), name];
            }}
          />
          <Legend
            verticalAlign="top"
            height={60}
            wrapperStyle={{ paddingBottom: "20px" }}
          />
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >
            {slices.map((slice, index) => (
              <Cell key={`slice-${index}`} fill={slice.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
