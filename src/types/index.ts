export type DashboardDataItem = {
  date: string;
  envasesLisos: number;
  envasesDecorados: number;
  envasesPerdidos: number;
  pantallasFabricadas: number;
  pantallasConsumidas: number;
  eficiencia: number;
  deficiencia: number;
};

export type VisibleMetrics = {
  envasesLisos: boolean;
  envasesDecorados: boolean;
  envasesPerdidos: boolean;
  pantallasFabricadas: boolean;
  pantallasConsumidas: boolean;
  eficiencia: boolean;
  deficiencia: boolean;
  meta: boolean;
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

export type PantallasRegistro = {
  fecha: string;
  totalFabricadas: number;
  totalConsumidas: number;
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

export type PantallasResponse = {
  registrosPantallas: PantallasRegistro[];
  totalFabricadas: number;
  totalConsumidas: number;
};

//* Meta individual (para el listado y para la línea de referencia)
export type Meta = {
  idMeta: number;
  anio: number;
  mes: string;
  deficiencia: string;
  estado: boolean;
};

//* Meta activa lista para pasarla al gráfico
export type MetaActiva = {
  valor: number;
  mes: string;
};

export type Totales = {
  totalEnvasesLisos: number;
  totalGruesasLisas: string;
  totalEnvasesDecorados: number;
  totalGruesasDecoradas: string;
  totalEnvasesPerdidos: number;
  totalGruesasPerdidas: string;
  totalPantallasFabricadas: number;
  totalPantallasConsumidas: number;
  eficienciaGeneral: number;
  deficienciaGeneral: number;
};

export type MoldeRendimiento = {
  item: string;
  nombre: string;
  descripcion: string;
  gruesasLisas: number;
  entradasGruesas: number;
  gruesasDecoradas: number;
  gruesasDefectuosas: number;
  eficiencia: number;
  deficiencia: number;
};
