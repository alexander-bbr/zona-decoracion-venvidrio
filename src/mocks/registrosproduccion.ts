import type { ModeloEnvase } from "./modelos";

export type ProduccionModelo = {
  modelo: ModeloEnvase["descripcion"];
  paletasDecoradas: number;
  produccionLisa: number;
};

export type RegistroProduccion = {
  id_registro: number;
  turno: "A" | "B" | "C";
  fecha: string;
  tecnico: string;
  cantidades: [number, number, number, number];
  totalPaletas: number;
  modelos: ProduccionModelo[];
  perdidas: number;
  observaciones: string;
};

export const registrosProduccion: RegistroProduccion[] = [
  {
    id_registro: 1007,
    turno: "B",
    fecha: "2026-08-22",
    tecnico: "María González",
    cantidades: [12000, 11800, 12100, 11900],
    totalPaletas: 8,
    modelos: [{ modelo: "Pepsi", paletasDecoradas: 5, produccionLisa: 2 }],
    perdidas: 1,
    observaciones: "Rotura de envases durante el cambio de formato.",
  },
  {
    id_registro: 1006,
    turno: "A",
    fecha: "2026-08-21",
    tecnico: "Carlos Rodríguez",
    cantidades: [15000, 14800, 15100, 14900],
    totalPaletas: 10,
    modelos: [{ modelo: "Polarcita", paletasDecoradas: 6, produccionLisa: 3 }],
    perdidas: 1,
    observaciones: "Pérdidas normales del proceso.",
  },
  {
    id_registro: 1005,
    turno: "C",
    fecha: "2026-08-20",
    tecnico: "Ana Pérez",
    cantidades: [9800, 9700, 9900, 9650],
    totalPaletas: 7,
    modelos: [{ modelo: "Valmy", paletasDecoradas: 4, produccionLisa: 2 }],
    perdidas: 1,
    observaciones: "Se retiraron envases con defecto visual.",
  },
  {
    id_registro: 1004,
    turno: "B",
    fecha: "2026-08-19",
    tecnico: "Luis Martínez",
    cantidades: [13200, 13000, 13100, 12900],
    totalPaletas: 9,
    modelos: [{ modelo: "Pepsi", paletasDecoradas: 4, produccionLisa: 4 }],
    perdidas: 1,
    observaciones: "Sin novedades.",
  },
  {
    id_registro: 1003,
    turno: "A",
    fecha: "2026-08-18",
    tecnico: "Sofía Herrera",
    cantidades: [11000, 10900, 11100, 10800],
    totalPaletas: 8,
    modelos: [{ modelo: "Polarcita", paletasDecoradas: 3, produccionLisa: 4 }],
    perdidas: 1,
    observaciones: "Ajuste de máquina al inicio del turno.",
  },
  {
    id_registro: 1002,
    turno: "C",
    fecha: "2026-08-17",
    tecnico: "Diego Torres",
    cantidades: [12500, 12300, 12400, 12200],
    totalPaletas: 9,
    modelos: [{ modelo: "Valmy", paletasDecoradas: 5, produccionLisa: 3 }],
    perdidas: 1,
    observaciones: "Sin novedades.",
  },
  {
    id_registro: 1001,
    turno: "B",
    fecha: "2026-08-16",
    tecnico: "Elena Silva",
    cantidades: [14000, 13800, 13900, 13700],
    totalPaletas: 10,
    modelos: [{ modelo: "Pepsi", paletasDecoradas: 6, produccionLisa: 3 }],
    perdidas: 1,
    observaciones: "Envases descartados por control de calidad.",
  },
];
