import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import { ENVASES_POR_GRUESA } from "../../../../constants";
import styles from "./editar-produccion.module.css";

type Molde = {
  idMolde: number;
  nombre: string;
  descripcion: string;
  numeroCamadas: number;
  numeroEnvases: number;
};

type Justificante = {
  idJustificante: number;
  etiqueta: string;
  descripcion: string;
};

type EntradaMaquina = {
  idMolde: number;
  cantEnvases: number;
};

type MaquinaProduccion = {
  entradas: EntradaMaquina[];
};

type SalidaApi = {
  modeloMolde: number;
  totalPaletas: number;
  cantPaletasLisas: number;
  cantCamadasLisas: number;
  cantEnvasesLisas: number;
  cantGruesasLisas: number;
  cantPaletasDecoradas: number;
  cantCamadasDecoradas: number;
  cantEnvasesDecoradas: number;
  cantGruesasDecoradas: number;
};

type RegistroDetalleApi = {
  idCabecera: number;
  fecha: string;
  turno: string;
  tecnico: string;
  maquina1: EntradaMaquina[];
  maquina2: EntradaMaquina[];
  maquina3: EntradaMaquina[];
  maquina4: EntradaMaquina[];
  cantEnvasesD1: number;
  cantEnvasesD2: number;
  cantEnvasesD3: number;
  cantEnvasesD4: number;
  totalEnvases: number;
  salidas: SalidaApi[];
  resultado?: { observaciones?: string };
  justificantes?: number[];
};

type ModeloForm = {
  modelo: string;
  idMolde?: number; // Agregar campo opcional para guardar el ID
  paletasDecoradas: number;
  produccionLisa: number;
};

type Resumen = { camadas: number; envases: number; gruesas: number };

const formatNumber = (value: number) =>
  value.toLocaleString("es-VE", { maximumFractionDigits: 2 });

export const EditarProduccion = () => {
  const { id_registro: idRegistro } = useParams<{ id_registro: string }>();
  return idRegistro ? (
    <CargarProduccion idRegistro={idRegistro} />
  ) : (
    <p>Registro inválido.</p>
  );
};

const CargarProduccion = ({ idRegistro }: { idRegistro: string }) => {
  const [registro, setRegistro] = useState<RegistroDetalleApi | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarRegistro = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/produccion/${idRegistro}`,
        );
        if (!response.ok)
          throw new Error(
            response.status === 404
              ? "El registro no existe."
              : `Error al cargar registro: ${response.status}`,
          );
        const data = await response.json();
        setRegistro(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar registro.",
        );
      }
    };
    void cargarRegistro();
  }, [idRegistro]);

  if (error) return <p>{error}</p>;
  if (!registro) return <p>Cargando registro de producción...</p>;
  return <FormularioEdicion registro={registro} />;
};

const FormularioEdicion = ({ registro }: { registro: RegistroDetalleApi }) => {
  const navigate = useNavigate();
  const [moldes, setMoldes] = useState<Molde[]>([]);
  const [cargandoMoldes, setCargandoMoldes] = useState(true);
  const [justificantes, setJustificantes] = useState<Justificante[]>([]);
  const [cargandoJustificantes, setCargandoJustificantes] = useState(true);
  const [turno, setTurno] = useState(registro.turno);
  const [fecha, setFecha] = useState(registro.fecha);
  const [tecnico, setTecnico] = useState(registro.tecnico);

  // Inicializar máquinas con los datos del registro
  const [maquinas, setMaquinas] = useState<MaquinaProduccion[]>([
    {
      entradas: registro.maquina1?.length
        ? registro.maquina1
        : [{ idMolde: 0, cantEnvases: 0 }],
    },
    {
      entradas: registro.maquina2?.length
        ? registro.maquina2
        : [{ idMolde: 0, cantEnvases: 0 }],
    },
    {
      entradas: registro.maquina3?.length
        ? registro.maquina3
        : [{ idMolde: 0, cantEnvases: 0 }],
    },
    {
      entradas: registro.maquina4?.length
        ? registro.maquina4
        : [{ idMolde: 0, cantEnvases: 0 }],
    },
  ]);

  const [totalPaletas, setTotalPaletas] = useState(
    registro.salidas.reduce(
      (total, salida) =>
        total +
        Number(salida.cantPaletasDecoradas) +
        Number(salida.cantPaletasLisas),
      0,
    ),
  );

  // CORRECCIÓN: Inicializar con el ID del molde
  const [modelosForm, setModelosForm] = useState<ModeloForm[]>([
    ...registro.salidas.map((salida) => ({
      modelo: "", // Se llenará con el nombre después de cargar moldes
      idMolde: Number(salida.modeloMolde), // Guardar el ID del molde
      paletasDecoradas: Number(salida.cantPaletasDecoradas),
      produccionLisa: Number(salida.cantPaletasLisas),
    })),
  ]);

  const [observaciones, setObservaciones] = useState(
    registro.resultado?.observaciones ?? "",
  );
  const [justificantesSeleccionados, setJustificantesSeleccionados] = useState<
    number[]
  >(registro.justificantes || []);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarMoldes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/produccion/moldes");
        if (!response.ok)
          throw new Error(`Error al cargar moldes: ${response.status}`);
        const moldesCargados = ((await response.json()) as Molde[]).map(
          (molde) => ({
            ...molde,
            numeroCamadas: Number(molde.numeroCamadas),
            numeroEnvases: Number(molde.numeroEnvases),
          }),
        );
        setMoldes(moldesCargados);

        // CORRECCIÓN: Buscar por ID y asignar el nombre
        setModelosForm((actuales) =>
          actuales.map((modelo) => {
            // Buscar por ID (usando idMolde si existe, o buscando por string)
            const moldeEncontrado = moldesCargados.find(
              (item) =>
                item.idMolde === modelo.idMolde || // Buscar por ID numérico
                String(item.idMolde) === modelo.modelo || // Buscar por ID como string
                item.nombre === modelo.modelo, // Buscar por nombre
            );
            return moldeEncontrado
              ? {
                  ...modelo,
                  modelo: moldeEncontrado.nombre,
                  idMolde: moldeEncontrado.idMolde,
                }
              : modelo;
          }),
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar los moldes.",
        );
      } finally {
        setCargandoMoldes(false);
      }
    };

    const cargarJustificantes = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/produccion/justificantes",
        );
        if (!response.ok) {
          throw new Error(`Error al cargar justificantes: ${response.status}`);
        }
        const justificantesCargados = (await response.json()) as Justificante[];
        setJustificantes(justificantesCargados);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar los justificantes.",
        );
      } finally {
        setCargandoJustificantes(false);
      }
    };

    void cargarMoldes();
    void cargarJustificantes();
  }, []);

  const agregarEntradaMaquina = (maquinaIndex: number) => {
    setMaquinas((actuales) =>
      actuales.map((maquina, index) =>
        index === maquinaIndex
          ? {
              ...maquina,
              entradas: [...maquina.entradas, { idMolde: 0, cantEnvases: 0 }],
            }
          : maquina,
      ),
    );
  };

  const eliminarEntradaMaquina = (
    maquinaIndex: number,
    entradaIndex: number,
  ) => {
    setMaquinas((actuales) =>
      actuales.map((maquina, index) =>
        index === maquinaIndex
          ? {
              ...maquina,
              entradas: maquina.entradas.filter((_, i) => i !== entradaIndex),
            }
          : maquina,
      ),
    );
  };

  const actualizarEntradaMaquina = (
    maquinaIndex: number,
    entradaIndex: number,
    campo: keyof EntradaMaquina,
    valor: number,
  ) => {
    setMaquinas((actuales) =>
      actuales.map((maquina, index) =>
        index === maquinaIndex
          ? {
              ...maquina,
              entradas: maquina.entradas.map((entrada, i) =>
                i === entradaIndex ? { ...entrada, [campo]: valor } : entrada,
              ),
            }
          : maquina,
      ),
    );
  };

  const limitarModelos = (actuales: ModeloForm[], limite: number) => {
    let restantes = limite;
    return actuales.map((modelo) => {
      const paletasDecoradas = Math.min(modelo.paletasDecoradas, restantes);
      restantes -= paletasDecoradas;
      const produccionLisa = Math.min(modelo.produccionLisa, restantes);
      restantes -= produccionLisa;
      return { ...modelo, paletasDecoradas, produccionLisa };
    });
  };

  const actualizarTotalPaletas = (value: string) => {
    const limite = Math.max(0, Number(value) || 0);
    setTotalPaletas(limite);
    setModelosForm((actuales) => limitarModelos(actuales, limite));
  };

  const actualizarModelo = (index: number, changes: Partial<ModeloForm>) =>
    setModelosForm((actuales) =>
      actuales.map((modelo, modeloIndex) =>
        modeloIndex === index ? { ...modelo, ...changes } : modelo,
      ),
    );

  const obtenerMaximoPaletas = (
    index: number,
    campo: "paletasDecoradas" | "produccionLisa",
  ) =>
    Math.max(
      0,
      totalPaletas -
        modelosForm.reduce(
          (total, modelo, modeloIndex) =>
            total +
            (modeloIndex === index
              ? modelo[
                  campo === "paletasDecoradas"
                    ? "produccionLisa"
                    : "paletasDecoradas"
                ]
              : modelo.paletasDecoradas + modelo.produccionLisa),
          0,
        ),
    );

  const cambiarPaletas = (
    index: number,
    campo: "paletasDecoradas" | "produccionLisa",
    value: string,
  ) =>
    actualizarModelo(index, {
      [campo]: Math.min(
        Math.max(0, Number(value) || 0),
        obtenerMaximoPaletas(index, campo),
      ),
    });

  const agregarJustificante = () => {
    setJustificantesSeleccionados((actuales) => [...actuales, 0]);
  };

  const eliminarJustificante = (index: number) => {
    setJustificantesSeleccionados((actuales) =>
      actuales.filter((_, i) => i !== index),
    );
  };

  const actualizarJustificante = (index: number, idJustificante: number) => {
    setJustificantesSeleccionados((actuales) =>
      actuales.map((actual, i) => (i === index ? idJustificante : actual)),
    );
  };

  // Calcular total de envases de todas las máquinas
  const totalEnvasesMaquinas = maquinas.reduce(
    (total, maquina) =>
      total +
      maquina.entradas.reduce((sum, entrada) => sum + entrada.cantEnvases, 0),
    0,
  );

  const handleReset = () => {
    setTurno(registro.turno);
    setFecha(registro.fecha);
    setTecnico(registro.tecnico);
    setMaquinas([
      {
        entradas: registro.maquina1?.length
          ? registro.maquina1
          : [{ idMolde: 0, cantEnvases: 0 }],
      },
      {
        entradas: registro.maquina2?.length
          ? registro.maquina2
          : [{ idMolde: 0, cantEnvases: 0 }],
      },
      {
        entradas: registro.maquina3?.length
          ? registro.maquina3
          : [{ idMolde: 0, cantEnvases: 0 }],
      },
      {
        entradas: registro.maquina4?.length
          ? registro.maquina4
          : [{ idMolde: 0, cantEnvases: 0 }],
      },
    ]);
    setTotalPaletas(
      registro.salidas.reduce(
        (total, salida) =>
          total +
          Number(salida.cantPaletasDecoradas) +
          Number(salida.cantPaletasLisas),
        0,
      ),
    );
    setModelosForm(
      registro.salidas.map((salida) => ({
        modelo: "",
        idMolde: Number(salida.modeloMolde),
        paletasDecoradas: Number(salida.cantPaletasDecoradas),
        produccionLisa: Number(salida.cantPaletasLisas),
      })),
    );
    setObservaciones(registro.resultado?.observaciones ?? "");
    setJustificantesSeleccionados(registro.justificantes || []);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fecha || !tecnico || totalPaletas <= 0) {
      setError("Completa la fecha, el técnico y el total de paletas.");
      return;
    }

    // Construir maquina1, maquina2, maquina3, maquina4
    const maquinasParaEnviar = maquinas.map((maquina) =>
      maquina.entradas
        .filter((entrada) => entrada.idMolde > 0 && entrada.cantEnvases > 0)
        .map((entrada) => ({
          idMolde: entrada.idMolde,
          cantEnvases: entrada.cantEnvases,
        })),
    );

    const [maquina1, maquina2, maquina3, maquina4] = maquinasParaEnviar;

    const salidas = modelosForm.flatMap((modelo) => {
      const molde = moldes.find((item) => item.nombre === modelo.modelo);
      if (!molde) {
        console.warn("No se encontró molde para el modelo:", modelo.modelo);
        return [];
      }

      if (modelo.paletasDecoradas === 0 && modelo.produccionLisa === 0)
        return [];

      const envasesDecoradas = modelo.paletasDecoradas * molde.numeroEnvases;
      const envasesLisas = modelo.produccionLisa * molde.numeroEnvases;
      return [
        {
          modeloMolde: molde.idMolde,
          totalPaletas: modelo.paletasDecoradas + modelo.produccionLisa,
          cantPaletasLisas: modelo.produccionLisa,
          cantCamadasLisas: modelo.produccionLisa * molde.numeroCamadas,
          cantEnvasesLisas: envasesLisas,
          cantGruesasLisas: envasesLisas / ENVASES_POR_GRUESA,
          cantPaletasDecoradas: modelo.paletasDecoradas,
          cantCamadasDecoradas: modelo.paletasDecoradas * molde.numeroCamadas,
          cantEnvasesDecoradas: envasesDecoradas,
          cantGruesasDecoradas: envasesDecoradas / ENVASES_POR_GRUESA,
        },
      ];
    });

    if (salidas.length === 0) {
      setError(
        "No se encontraron moldes válidos para los modelos seleccionados.",
      );
      return;
    }

    const justificantesValidos = justificantesSeleccionados.filter(
      (id) => id > 0,
    );
    const gruesasMaquinas = totalEnvasesMaquinas / ENVASES_POR_GRUESA;

    const resumenProduccion = modelosForm.reduce(
      (resumen, modelo) => {
        const molde = moldes.find((item) => item.nombre === modelo.modelo);
        if (molde) {
          resumen.envasesDecorados +=
            modelo.paletasDecoradas * molde.numeroEnvases;
          resumen.envasesLisa += modelo.produccionLisa * molde.numeroEnvases;
        }
        return resumen;
      },
      { envasesDecorados: 0, envasesLisa: 0 },
    );

    const totalEnvasesPerdidos = Math.max(
      0,
      totalEnvasesMaquinas - resumenProduccion.envasesDecorados,
    );
    const gruesasPerdidas = totalEnvasesPerdidos / ENVASES_POR_GRUESA;
    const deficienciaProductiva = gruesasMaquinas
      ? (gruesasPerdidas / gruesasMaquinas) * 100
      : 0;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/produccion/${registro.idCabecera}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idCabecera: registro.idCabecera,
            fecha,
            turno,
            tecnico,
            maquina1,
            maquina2,
            maquina3,
            maquina4,
            cantEnvasesD1: maquina1.reduce((sum, e) => sum + e.cantEnvases, 0),
            cantEnvasesD2: maquina2.reduce((sum, e) => sum + e.cantEnvases, 0),
            cantEnvasesD3: maquina3.reduce((sum, e) => sum + e.cantEnvases, 0),
            cantEnvasesD4: maquina4.reduce((sum, e) => sum + e.cantEnvases, 0),
            totalEnvases: totalEnvasesMaquinas,
            totalGruesas: gruesasMaquinas,
            salidas,
            resultado: {
              totalGruesasLisas:
                resumenProduccion.envasesLisa / ENVASES_POR_GRUESA,
              totalGruesasDecoradas:
                resumenProduccion.envasesDecorados / ENVASES_POR_GRUESA,
              eficienciaProductiva: 100 - deficienciaProductiva,
              deficienciaProductiva,
              observaciones,
            },
            justificantes: justificantesValidos,
          }),
        },
      );
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al actualizar producción: ${response.status}`,
        );
      }
      navigate("/gestion-productiva");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al actualizar producción.",
      );
    }
  };

  const resumenProduccion = modelosForm.reduce(
    (resumen, modelo) => {
      const molde = moldes.find((item) => item.nombre === modelo.modelo);
      if (molde) {
        resumen.envasesDecorados +=
          modelo.paletasDecoradas * molde.numeroEnvases;
        resumen.envasesLisa += modelo.produccionLisa * molde.numeroEnvases;
      }
      return resumen;
    },
    { envasesDecorados: 0, envasesLisa: 0 },
  );

  const totalEnvasesPerdidos = Math.max(
    0,
    totalEnvasesMaquinas - resumenProduccion.envasesDecorados,
  );
  const gruesasMaquinas = totalEnvasesMaquinas / ENVASES_POR_GRUESA;
  const deficienciaProductiva = gruesasMaquinas
    ? (totalEnvasesPerdidos / ENVASES_POR_GRUESA / gruesasMaquinas) * 100
    : 0;

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />
      <h3 className={styles.title}>Editar Registro #{registro.idCabecera}</h3>
      <section className={styles.formData}>
        <fieldset className={`${styles.fieldset} ${styles.identifyWrapper}`}>
          <legend className={styles.legend}>Datos de Identificación</legend>
          <Campo label="Turno" id="turno">
            <select
              id="turno"
              value={turno}
              onChange={(event) =>
                setTurno(event.target.value as "A" | "B" | "C")
              }
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </Campo>
          <Campo label="Fecha" id="fecha">
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
              required
            />
          </Campo>
          <Campo label="Técnico" id="tecnico">
            <input
              id="tecnico"
              value={tecnico}
              onChange={(event) => setTecnico(event.target.value)}
              required
            />
          </Campo>
        </fieldset>

        {/* === MÁQUINAS DE DECORADO === */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Máquinas de Decorado</legend>

          {maquinas.map((maquina, maquinaIndex) => (
            <div key={maquinaIndex} className={styles.maquinaContainer}>
              <h4 className={styles.maquinaTitle}>
                Máquina {maquinaIndex + 1}
              </h4>
              {maquina.entradas.map((entrada, entradaIndex) => (
                <div key={entradaIndex} className={styles.entradaMaquina}>
                  <div className={styles.inputWrapper}>
                    <label
                      htmlFor={`maquina-${maquinaIndex}-molde-${entradaIndex}`}
                    >
                      Molde
                    </label>
                    <select
                      id={`maquina-${maquinaIndex}-molde-${entradaIndex}`}
                      value={entrada.idMolde}
                      onChange={(event) =>
                        actualizarEntradaMaquina(
                          maquinaIndex,
                          entradaIndex,
                          "idMolde",
                          Number(event.target.value),
                        )
                      }
                      disabled={cargandoMoldes}
                    >
                      <option value={0}>Selecciona un molde...</option>
                      {moldes.map((molde) => (
                        <option key={molde.idMolde} value={molde.idMolde}>
                          {molde.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.inputWrapper}>
                    <label
                      htmlFor={`maquina-${maquinaIndex}-cant-${entradaIndex}`}
                    >
                      Nro. de Envases
                    </label>
                    <input
                      id={`maquina-${maquinaIndex}-cant-${entradaIndex}`}
                      type="number"
                      min="0"
                      value={entrada.cantEnvases || ""}
                      onChange={(event) =>
                        actualizarEntradaMaquina(
                          maquinaIndex,
                          entradaIndex,
                          "cantEnvases",
                          Math.max(0, Number(event.target.value) || 0),
                        )
                      }
                    />
                  </div>

                  {maquina.entradas.length > 1 && (
                    <button
                      type="button"
                      className={styles.deleteEntradaButton}
                      onClick={() =>
                        eliminarEntradaMaquina(maquinaIndex, entradaIndex)
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className={styles.addEntradaButton}
                onClick={() => agregarEntradaMaquina(maquinaIndex)}
              >
                + Agregar Otro Molde para la Máquina {maquinaIndex + 1}
              </button>

              <div className={styles.maquinaTotal}>
                <div className={styles.inputWrapper}>
                  <label>Total de Envases (Máquina {maquinaIndex + 1})</label>
                  <input
                    type="text"
                    readOnly
                    value={formatNumber(
                      maquina.entradas.reduce(
                        (sum, e) => sum + e.cantEnvases,
                        0,
                      ),
                    )}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className={styles.machineSummary}>
            <Campo label="Total de Envases" id="totalEnvasesMaquinas">
              <input
                id="totalEnvasesMaquinas"
                type="text"
                readOnly
                value={formatNumber(totalEnvasesMaquinas)}
              />
            </Campo>
            <Campo label="Cantidad en Gruesas" id="cantidadGruesasMaquinas">
              <input
                id="cantidadGruesasMaquinas"
                type="text"
                readOnly
                value={formatNumber(gruesasMaquinas)}
              />
            </Campo>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Total de Paletas</legend>
          <Campo label="Número Total de Paletas" id="totalPaletas">
            <input
              id="totalPaletas"
              type="number"
              min="0"
              value={totalPaletas || ""}
              onChange={(event) => actualizarTotalPaletas(event.target.value)}
              required
            />
          </Campo>
        </fieldset>

        {modelosForm.map((modelo, index) => (
          <ModeloProduccion
            key={index}
            modelo={modelo}
            index={index}
            moldes={moldes}
            cargandoMoldes={cargandoMoldes}
            maximoDecoradas={obtenerMaximoPaletas(index, "paletasDecoradas")}
            maximoLisa={obtenerMaximoPaletas(index, "produccionLisa")}
            actualizarModelo={actualizarModelo}
            cambiarPaletas={cambiarPaletas}
            onEliminar={() =>
              setModelosForm((actuales) =>
                actuales.filter((_, modeloIndex) => modeloIndex !== index),
              )
            }
          />
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={() =>
            setModelosForm((actuales) => [
              ...actuales,
              {
                modelo: moldes[0]?.nombre ?? "",
                idMolde: moldes[0]?.idMolde ?? 0,
                paletasDecoradas: 0,
                produccionLisa: 0,
              },
            ])
          }
        >
          + Añadir Otro Modelo
        </button>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Resumen</legend>
          <div className={styles.summaryGrid}>
            <ResumenColumn
              label="Total de Envases Decorados"
              total={resumenProduccion.envasesDecorados}
              gruesas={resumenProduccion.envasesDecorados / ENVASES_POR_GRUESA}
            />

            <ResumenColumn
              label="Total de Envases Perdidos"
              total={totalEnvasesPerdidos}
              gruesas={totalEnvasesPerdidos / ENVASES_POR_GRUESA}
            />

            <ResumenColumn
              label="Total de Envases en Producción Lisa"
              total={resumenProduccion.envasesLisa}
              gruesas={resumenProduccion.envasesLisa / ENVASES_POR_GRUESA}
            />
          </div>
          <div className={styles.productivitySummary}>
            <Campo label="Eficiencia Productiva" id="eficienciaProductiva">
              <div className={styles.percentageInput}>
                <input
                  id="eficienciaProductiva"
                  type="number"
                  readOnly
                  value={Number((100 - deficienciaProductiva).toFixed(2))}
                />
                <span>%</span>
              </div>
            </Campo>

            <Campo label="Deficiencia Productiva" id="deficienciaProductiva">
              <div className={styles.percentageInput}>
                <input
                  id="deficienciaProductiva"
                  type="number"
                  readOnly
                  value={Number(deficienciaProductiva.toFixed(2))}
                />
                <span>%</span>
              </div>
            </Campo>
          </div>
        </fieldset>

        <Campo label="Observaciones" id="observaciones">
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(event) => setObservaciones(event.target.value)}
            rows={8}
          />
        </Campo>

        {/* === JUSTIFICANTES === */}
        <div className={styles.justificantesContainer}>
          {justificantesSeleccionados.map((idJustificante, index) => (
            <fieldset key={index} className={styles.fieldset}>
              <legend className={styles.legend}>
                Justificante ({index + 1})
              </legend>
              <div className={styles.justificanteRow}>
                <div className={styles.inputWrapper}>
                  <label htmlFor={`justificante-${index}`}>Justificante</label>
                  <select
                    id={`justificante-${index}`}
                    value={idJustificante || ""}
                    onChange={(event) =>
                      actualizarJustificante(index, Number(event.target.value))
                    }
                    disabled={cargandoJustificantes}
                  >
                    <option value="">Selecciona un justificante...</option>
                    {justificantes.map((justificante) => (
                      <option
                        key={justificante.idJustificante}
                        value={justificante.idJustificante}
                      >
                        {justificante.etiqueta}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className={styles.deleteJustificanteButton}
                  onClick={() => eliminarJustificante(index)}
                >
                  ✕
                </button>
              </div>
              {idJustificante > 0 && (
                <div className={styles.justificanteDescripcion}>
                  {
                    justificantes.find(
                      (j) => j.idJustificante === idJustificante,
                    )?.descripcion
                  }
                </div>
              )}
            </fieldset>
          ))}

          <button
            type="button"
            className={styles.addJustificanteButton}
            onClick={agregarJustificante}
          >
            + Agregar Justificante
          </button>
        </div>
      </section>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttonWrapper}>
        <button type="submit" className={styles.saveButton}>
          Guardar
        </button>
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}
        >
          Resetear
        </button>
      </div>
    </form>
  );
};

const Campo = ({
  label,
  id,
  children,
}: {
  label: ReactNode;
  id: string;
  children: ReactNode;
}) => (
  <div className={styles.inputWrapper}>
    <label htmlFor={id}>{label}</label>
    {children}
  </div>
);

type ModeloProps = {
  modelo: ModeloForm;
  index: number;
  moldes: Molde[];
  cargandoMoldes: boolean;
  maximoDecoradas: number;
  maximoLisa: number;
  actualizarModelo: (index: number, changes: Partial<ModeloForm>) => void;
  cambiarPaletas: (
    index: number,
    campo: "paletasDecoradas" | "produccionLisa",
    value: string,
  ) => void;
  onEliminar: () => void;
};

const ModeloProduccion = ({
  modelo,
  index,
  moldes,
  cargandoMoldes,
  maximoDecoradas,
  maximoLisa,
  actualizarModelo,
  cambiarPaletas,
  onEliminar,
}: ModeloProps) => {
  // Buscar el molde por nombre o por ID
  const molde = moldes.find(
    (item) => item.nombre === modelo.modelo || item.idMolde === modelo.idMolde,
  );

  const resumen = (paletas: number): Resumen => ({
    camadas: paletas * (molde?.numeroCamadas ?? 0),
    envases: paletas * (molde?.numeroEnvases ?? 0),
    gruesas: (paletas * (molde?.numeroEnvases ?? 0)) / ENVASES_POR_GRUESA,
  });

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        Modelo de envase{" "}
        <span className={styles.numberModel}>( {index + 1} )</span>
      </legend>
      {index > 0 && (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={onEliminar}
        >
          Eliminar modelo
        </button>
      )}
      <div className={styles.modelHeader}>
        <div className={styles.inputWrapper}>
          <label htmlFor={`modelo${index}`}>Modelo de Envase</label>
          <select
            id={`modelo${index}`}
            value={molde?.nombre ?? modelo.modelo}
            disabled={cargandoMoldes || moldes.length === 0}
            onChange={(event) => {
              const moldeSeleccionado = moldes.find(
                (item) => item.nombre === event.target.value,
              );
              actualizarModelo(index, {
                modelo: event.target.value,
                idMolde: moldeSeleccionado?.idMolde ?? 0,
              });
            }}
          >
            {moldes.map((item) => (
              <option key={item.idMolde} value={item.nombre}>
                {item.nombre}
              </option>
            ))}
          </select>
        </div>
        <input
          className={styles.descriptionInput}
          type="text"
          readOnly
          value={molde?.descripcion ?? ""}
          placeholder={
            cargandoMoldes ? "Cargando descripción..." : "Descripción"
          }
        />
      </div>
      <div className={styles.productionGrid}>
        <GrupoProduccion
          title="Paletas Decoradas"
          value={modelo.paletasDecoradas}
          max={maximoDecoradas}
          onChange={(value) => cambiarPaletas(index, "paletasDecoradas", value)}
          resumen={resumen(modelo.paletasDecoradas)}
        />
        <GrupoProduccion
          title="Producción Lisa"
          value={modelo.produccionLisa}
          max={maximoLisa}
          onChange={(value) => cambiarPaletas(index, "produccionLisa", value)}
          resumen={resumen(modelo.produccionLisa)}
        />
      </div>
      <div className={styles.modelTotal}>
        <Campo
          label="Total de Paletas por Modelo"
          id={`totalPaletasModelo${index}`}
        >
          <input
            id={`totalPaletasModelo${index}`}
            type="number"
            readOnly
            value={modelo.paletasDecoradas + modelo.produccionLisa}
          />
        </Campo>
      </div>
    </fieldset>
  );
};

const GrupoProduccion = ({
  title,
  value,
  max,
  onChange,
  resumen,
}: {
  title: string;
  value: number;
  max: number;
  onChange: (value: string) => void;
  resumen: Resumen;
}) => (
  <div className={styles.productionGroup}>
    <h4>{title}</h4>
    <Campo label="Número de Paletas" id={`${title}-paletas`}>
      <input
        id={`${title}-paletas`}
        type="number"
        min="0"
        max={Math.max(0, max)}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </Campo>
    <Campo label="Total de Camadas" id={`${title}-camadas`}>
      <input
        id={`${title}-camadas`}
        readOnly
        value={formatNumber(resumen.camadas)}
      />
    </Campo>
    <Campo label="Total de Envases" id={`${title}-envases`}>
      <input
        id={`${title}-envases`}
        readOnly
        value={formatNumber(resumen.envases)}
      />
    </Campo>
    <Campo label="Total de Gruesas" id={`${title}-gruesas`}>
      <input
        id={`${title}-gruesas`}
        type="text"
        readOnly
        value={formatNumber(resumen.gruesas)}
      />
    </Campo>
  </div>
);

const ResumenColumn = ({
  label,
  total,
  gruesas,
}: {
  label: string;
  total: number;
  gruesas: number;
}) => (
  <div className={styles.summaryColumn}>
    <Campo label={label} id={label.replace(/\s/g, "-")}>
      <input type="text" readOnly value={formatNumber(total)} />
    </Campo>
    <Campo label="Cantidad en Gruesas" id={`${label}-gruesas`}>
      <input type="text" readOnly value={formatNumber(gruesas)} />
    </Campo>
  </div>
);
