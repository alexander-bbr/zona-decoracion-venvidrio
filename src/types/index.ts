export type DashboardDataItem = {
  date: string;
  envasesLisos: number;
  envasesDecorados: number;
  envasesPerdidos: number;
  eficiencia: number;
  deficiencia: number;
};

export type VisibleMetrics = {
  envasesLisos: boolean;
  envasesDecorados: boolean;
  envasesPerdidos: boolean;
  eficiencia: boolean;
  deficiencia: boolean;
};

export type ChartType = "lineal" | "barras" | "torta";

// Tipos para las respuestas de la API
export type LisosRegistro = {
  fecha: string;
  totalEnvasesLisos: number;
  totalGruesasLisas: string;
};

export type DecoradosRegistro = {
  fecha: string;
  totalEnvasesDecorados: number;
  totalGruesasDecoradas: string;
};

export type PerdidosRegistro = {
  fecha: string;
  totalEnvasesPerdidos: number;
  totalGruesasPerdidas: string;
};

export type RendimientoRegistro = {
  fecha: string;
  eficiencia: number;
  deficiencia: string;
};

export type LisosResponse = {
  registrosLisos: LisosRegistro[];
  totalEnvasesLisos: number;
  totalGruesasLisas: string;
};

export type DecoradosResponse = {
  registrosDecorados: DecoradosRegistro[];
  totalEnvasesDecorados: number;
  totalGruesasDecoradas: string;
};

export type PerdidosResponse = {
  registrosPerdidos: PerdidosRegistro[];
  totalEnvasesPerdidos: number;
  totalGruesasPerdidas: string;
};

export type RendimientoResponse = {
  rendimiento: RendimientoRegistro[];
  eficienciaGeneral: number;
  deficienciaGeneral: number;
};

export type Totales = {
  totalEnvasesLisos: number;
  totalGruesasLisas: string;
  totalEnvasesDecorados: number;
  totalGruesasDecoradas: string;
  totalEnvasesPerdidos: number;
  totalGruesasPerdidas: string;
  eficienciaGeneral: number;
  deficienciaGeneral: number;
};
