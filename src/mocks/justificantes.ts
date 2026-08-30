export type Justificante = {
  idJustificante: number;
  etiqueta: string;
  descripcion: string | null;
};

// Datos mock iniciales
let justificantesMock: Justificante[] = [
  {
    idJustificante: 1,
    etiqueta: "Desperfecto en el Decorado",
    descripcion:
      "Desperfecto en los envases producto de un mal decorado de la máquina",
  },
  {
    idJustificante: 2,
    etiqueta: "Rotura por malcocido del envase",
    descripcion: null,
  },
  {
    idJustificante: 3,
    etiqueta: "Falla en el etiquetado",
    descripcion: "Las etiquetas no se adhieren correctamente al envase",
  },
];

let nextId = 4;

// Simular delay de red
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// GET - Obtener todos los justificantes
export const getJustificantes = async (): Promise<Justificante[]> => {
  await delay();
  return [...justificantesMock];
};

// GET - Obtener un justificante por ID
export const getJustificanteById = async (
  id: number,
): Promise<Justificante> => {
  await delay();
  const justificante = justificantesMock.find((j) => j.idJustificante === id);
  if (!justificante) {
    throw new Error("El Justificante especificado no existe.");
  }
  return { ...justificante };
};

// POST - Crear nuevo justificante
export const createJustificante = async (
  data: Omit<Justificante, "idJustificante">,
): Promise<{ status: string; id: number }> => {
  await delay();

  // Validaciones simuladas
  if (!data.etiqueta || data.etiqueta.trim() === "") {
    throw new Error("La etiqueta es obligatoria");
  }

  const nuevoJustificante: Justificante = {
    idJustificante: nextId++,
    etiqueta: data.etiqueta,
    descripcion: data.descripcion || null,
  };

  justificantesMock.push(nuevoJustificante);
  return {
    status: "Registro insertado con éxito",
    id: nuevoJustificante.idJustificante,
  };
};

// PUT - Actualizar justificante
export const updateJustificante = async (
  id: number,
  data: Omit<Justificante, "idJustificante">,
): Promise<{ status: string; id: number }> => {
  await delay();

  const index = justificantesMock.findIndex((j) => j.idJustificante === id);
  if (index === -1) {
    throw new Error(
      "No se pudo actualizar porque el Justificante no fue encontrado.",
    );
  }

  // Validaciones simuladas
  if (!data.etiqueta || data.etiqueta.trim() === "") {
    throw new Error("La etiqueta es obligatoria");
  }

  justificantesMock[index] = {
    ...justificantesMock[index],
    etiqueta: data.etiqueta,
    descripcion: data.descripcion || null,
  };

  return {
    status: "Registro actualizado con éxito",
    id: id,
  };
};

// DELETE - Eliminar justificante (opcional, para completar el CRUD)
export const deleteJustificante = async (
  id: number,
): Promise<{ status: string }> => {
  await delay();

  const index = justificantesMock.findIndex((j) => j.idJustificante === id);
  if (index === -1) {
    throw new Error("El Justificante especificado no existe.");
  }

  justificantesMock.splice(index, 1);
  return {
    status: "Registro eliminado con éxito",
  };
};
