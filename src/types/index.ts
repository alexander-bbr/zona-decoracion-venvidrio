export type DashboardDataItem = {
  date: string;
  produceLisa: number;
  envasesDecorados: number;
  envasesDefectuosos: number;
};

export type VisibleMetrics = {
  produceLisa: boolean;
  envasesDecorados: boolean;
  envasesDefectuosos: boolean;
};

export type ChartType = "lineal" | "barras" | "torta";
