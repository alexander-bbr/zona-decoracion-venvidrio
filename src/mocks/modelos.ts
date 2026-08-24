export type ModeloEnvase = {
  nombre: string;
  descripcion: "Polarcita" | "Valmy" | "Pepsi";
  camadas: number;
  envases: number;
};

export const modelos: ModeloEnvase[] = [
  { nombre: "G200", descripcion: "Pepsi", camadas: 10, envases: 5000 },
  { nombre: "G180", descripcion: "Polarcita", camadas: 12, envases: 4500 },
  { nombre: "G150", descripcion: "Valmy", camadas: 14, envases: 4200 },
  { nombre: "G120", descripcion: "Pepsi", camadas: 16, envases: 3840 },
];

export const ENVASES_POR_GRUESA = 144;
