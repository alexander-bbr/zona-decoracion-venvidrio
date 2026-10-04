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
  horaEntrada: string;
};

type MaquinaProduccion = {
  entradas: EntradaMaquina[];
};

type SalidaApi = {
  modeloMolde: number;
  totalPaletasMolde: number;
  cantPaletasLisas: number;
  cantCamadasLisas: number;
  cantEnvasesLisas: number;
  cantGruesasLisas: string;
  cantPaletasDecoradas: number;
  cantCamadasDecoradas: number;
  cantEnvasesDecoradas: number;
  cantGruesasDecoradas: string;
  idEficiencia?: number;
};

type JustificantePorMoldeApi = {
  modeloMolde: number;
  justificaciones: number[];
};

type RegistroDetalleApi = {
  idCabecera: number;
  fecha: string;
  tipoTurno: string;
  turno: number;
  grupo: string;
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
  totalGruesas: string;
  salidas: SalidaApi[];
  resultado?: { observaciones?: string };
  justificantes?: JustificantePorMoldeApi[];
};

type ModeloForm = {
  idMolde: number;
  nombre: string;
  paletasDecoradas: number;
  produccionLisa: number;
  justificantes: number[];
};

type Resumen = { camadas: number; envases: number; gruesas: number };

const formatNumber = (value: number) =>
  value.toLocaleString("es-VE", { maximumFractionDigits: 2 });

export const EditarProduccion = () => {
  const { id: idRegistro } = useParams<{ id: string }>();
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

  // Datos de Identificación
  const tipoTurnoInicial: "2" | "3" = (() => {
    if (registro.tipoTurno) {
      if (registro.tipoTurno.includes("3")) return "3";
      if (registro.tipoTurno.includes("2")) return "2";
    }
    return registro.turno === 3 ? "3" : "2";
  })();

  const [tipoTurno, setTipoTurno] = useState<"2" | "3">(tipoTurnoInicial);
  const [turno, setTurno] = useState<number>(registro.turno);
  const [grupo, setGrupo] = useState(registro.grupo);
  const [fecha, setFecha] = useState(registro.fecha);
  const [tecnico, setTecnico] = useState(registro.tecnico);

  // Inicializar máquinas con los datos del registro
  const [maquinas, setMaquinas] = useState<MaquinaProduccion[]>([
    {
      entradas: registro.maquina1?.length
        ? registro.maquina1
        : [{ idMolde: 0, cantEnvases: 0, horaEntrada: "" }],
    },
    {
      entradas: registro.maquina2?.length
        ? registro.maquina2
        : [{ idMolde: 0, cantEnvases: 0, horaEntrada: "" }],
    },
    {
      entradas: registro.maquina3?.length
        ? registro.maquina3
        : [{ idMolde: 0, cantEnvases: 0, horaEntrada: "" }],
    },
    {
      entradas: registro.maquina4?.length
        ? registro.maquina4
        : [{ idMolde: 0, cantEnvases: 0, horaEntrada: "" }],
    },
  ]);

  // Ahora solo cuenta las paletas decoradas
  const [totalPaletasDecoradas, setTotalPaletasDecoradas] = useState(
    registro.salidas.reduce(
      (total, salida) => total + Number(salida.cantPaletasDecoradas),
      0,
    ),
  );

  // Inicializar modelos con los datos del registro
  const [modelosForm, setModelosForm] = useState<ModeloForm[]>([]);

  const [observaciones, setObservaciones] = useState(
    registro.resultado?.observaciones ?? "",
  );
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

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

        const modelosIniciales: ModeloForm[] = registro.salidas.map(
          (salida) => {
            const moldeEncontrado = moldesCargados.find(
              (m) => m.idMolde === salida.modeloMolde,
            );
            const justificantesMolde =
              registro.justificantes?.find(
                (j) => j.modeloMolde === salida.modeloMolde,
              )?.justificaciones || [];

            return {
              idMolde: salida.modeloMolde,
              nombre: moldeEncontrado?.nombre || String(salida.modeloMolde),
              paletasDecoradas: Number(salida.cantPaletasDecoradas),
              produccionLisa: Number(salida.cantPaletasLisas),
              justificantes: justificantesMolde,
            };
          },
        );

        setModelosForm(modelosIniciales);
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
  }, [registro]);

  // Actualizar modelosForm cuando cambian las máquinas
  useEffect(() => {
    const moldesUsados = new Map<
      number,
      {
        nombre: string;
        paletasDecoradas: number;
        produccionLisa: number;
        justificantes: number[];
      }
    >();

    maquinas.forEach((maquina) => {
      maquina.entradas.forEach((entrada) => {
        if (entrada.idMolde > 0) {
          const molde = moldes.find((m) => m.idMolde === entrada.idMolde);
          if (molde && !moldesUsados.has(entrada.idMolde)) {
            const modeloExistente = modelosForm.find(
              (m) => m.idMolde === entrada.idMolde,
            );
            moldesUsados.set(entrada.idMolde, {
              nombre: molde.nombre,
              paletasDecoradas: modeloExistente?.paletasDecoradas || 0,
              produccionLisa: modeloExistente?.produccionLisa || 0,
              justificantes: modeloExistente?.justificantes || [],
            });
          }
        }
      });
    });

    modelosForm.forEach((modelo) => {
      if (!moldesUsados.has(modelo.idMolde)) {
        const molde = moldes.find((m) => m.idMolde === modelo.idMolde);
        if (molde) {
          moldesUsados.set(modelo.idMolde, {
            nombre: molde.nombre,
            paletasDecoradas: modelo.paletasDecoradas,
            produccionLisa: modelo.produccionLisa,
            justificantes: modelo.justificantes,
          });
        }
      }
    });

    const nuevosModelos = Array.from(moldesUsados.entries()).map(
      ([idMolde, data]) => ({
        idMolde,
        nombre: data.nombre,
        paletasDecoradas: data.paletasDecoradas,
        produccionLisa: data.produccionLisa,
        justificantes: data.justificantes,
      }),
    );

    setModelosForm(nuevosModelos);
  }, [maquinas, moldes]);

  const agregarEntradaMaquina = (maquinaIndex: number) => {
    setMaquinas((actuales) =>
      actuales.map((maquina, index) =>
        index === maquinaIndex
          ? {
              ...maquina,
              entradas: [
                ...maquina.entradas,
                { idMolde: 0, cantEnvases: 0, horaEntrada: "" },
              ],
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
    valor: number | string,
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

  const actualizarModelo = (index: number, changes: Partial<ModeloForm>) => {
    setModelosForm((actuales) =>
      actuales.map((modelo, modeloIndex) =>
        modeloIndex === index ? { ...modelo, ...changes } : modelo,
      ),
    );
  };

  const agregarJustificante = (modeloIndex: number) => {
    setModelosForm((actuales) =>
      actuales.map((modelo, index) =>
        index === modeloIndex
          ? { ...modelo, justificantes: [...modelo.justificantes, 0] }
          : modelo,
      ),
    );
  };

  const eliminarJustificante = (
    modeloIndex: number,
    justificanteIndex: number,
  ) => {
    setModelosForm((actuales) =>
      actuales.map((modelo, index) =>
        index === modeloIndex
          ? {
              ...modelo,
              justificantes: modelo.justificantes.filter(
                (_, i) => i !== justificanteIndex,
              ),
            }
          : modelo,
      ),
    );
  };

  const actualizarJustificante = (
    modeloIndex: number,
    justificanteIndex: number,
    idJustificante: number,
  ) => {
    setModelosForm((actuales) =>
      actuales.map((modelo, index) =>
        index === modeloIndex
          ? {
              ...modelo,
              justificantes: modelo.justificantes.map((id, i) =>
                i === justificanteIndex ? idJustificante : id,
              ),
            }
          : modelo,
      ),
    );
  };

  // Solo se limita la producción decorada
  const limitarModelos = (actuales: ModeloForm[], limite: number) => {
    let restantes = limite;
    return actuales.map((modelo) => {
      const paletasDecoradas = Math.min(modelo.paletasDecoradas, restantes);
      restantes -= paletasDecoradas;
      // produccionLisa NO se limita
      return { ...modelo, paletasDecoradas };
    });
  };

  const actualizarTotalPaletasDecoradas = (value: string) => {
    const limite = Math.max(0, Number(value) || 0);
    setTotalPaletasDecoradas(limite);
    setModelosForm((actuales) => limitarModelos(actuales, limite));
  };

  // Solo considera paletas decoradas de los otros moldes
  const obtenerMaximoPaletasDecoradas = (index: number) => {
    const otrasPaletasDecoradas = modelosForm.reduce(
      (total, modelo, modeloIndex) =>
        total + (modeloIndex === index ? 0 : modelo.paletasDecoradas),
      0,
    );
    return Math.max(0, totalPaletasDecoradas - otrasPaletasDecoradas);
  };

  const cambiarPaletasDecoradas = (index: number, value: string) => {
    const cantidad = Math.max(
      0,
      Math.min(Number(value) || 0, obtenerMaximoPaletasDecoradas(index)),
    );
    actualizarModelo(index, { paletasDecoradas: cantidad });
  };

  // La producción lisa no tiene límite superior
  const cambiarProduccionLisa = (index: number, value: string) => {
    const cantidad = Math.max(0, Number(value) || 0);
    actualizarModelo(index, { produccionLisa: cantidad });
  };

  const handleReset = () => {
    setTipoTurno(tipoTurnoInicial);
    setTurno(registro.turno);
    setGrupo(registro.grupo);
    setFecha(registro.fecha);
    setTecnico(registro.tecnico);
    setMaquinas([
      {
        entradas: registro.maquina1?.length
          ? registro.maquina1
          : [{ idMolde: 0, cantEnvases: 0, horaEntrada: "" }],
      },
      {
        entradas: registro.maquina2?.length
          ? registro.maquina2
          : [{ idMolde: 0, cantEnvases: 0, horaEntrada: "" }],
      },
      {
        entradas: registro.maquina3?.length
          ? registro.maquina3
          : [{ idMolde: 0, cantEnvases: 0, horaEntrada: "" }],
      },
      {
        entradas: registro.maquina4?.length
          ? registro.maquina4
          : [{ idMolde: 0, cantEnvases: 0, horaEntrada: "" }],
      },
    ]);
    setTotalPaletasDecoradas(
      registro.salidas.reduce(
        (total, salida) => total + Number(salida.cantPaletasDecoradas),
        0,
      ),
    );
    const modelosIniciales: ModeloForm[] = registro.salidas.map((salida) => {
      const moldeEncontrado = moldes.find(
        (m) => m.idMolde === salida.modeloMolde,
      );
      const justificantesMolde =
        registro.justificantes?.find(
          (j) => j.modeloMolde === salida.modeloMolde,
        )?.justificaciones || [];

      return {
        idMolde: salida.modeloMolde,
        nombre: moldeEncontrado?.nombre || String(salida.modeloMolde),
        paletasDecoradas: Number(salida.cantPaletasDecoradas),
        produccionLisa: Number(salida.cantPaletasLisas),
        justificantes: justificantesMolde,
      };
    });
    setModelosForm(modelosIniciales);
    setObservaciones(registro.resultado?.observaciones ?? "");
    setError("");
  };

  // Calcular total de envases de todas las máquinas
  const totalEnvasesMaquinas = maquinas.reduce(
    (total, maquina) =>
      total +
      maquina.entradas.reduce((sum, entrada) => sum + entrada.cantEnvases, 0),
    0,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (guardando) return;

    if (
      !fecha ||
      !tecnico ||
      !turno ||
      !grupo ||
      !tipoTurno ||
      totalPaletasDecoradas <= 0
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    const maquinasParaEnviar = maquinas.map((maquina) =>
      maquina.entradas
        .filter((entrada) => entrada.idMolde > 0 && entrada.cantEnvases > 0)
        .map((entrada) => ({
          idMolde: entrada.idMolde,
          cantEnvases: entrada.cantEnvases,
          horaEntrada: entrada.horaEntrada || "00:00",
        })),
    );

    const [maquina1, maquina2, maquina3, maquina4] = maquinasParaEnviar;

    const salidas = modelosForm.flatMap((modelo) => {
      const molde = moldes.find((item) => item.idMolde === modelo.idMolde);
      if (!molde) {
        console.warn("No se encontró molde para el modelo:", modelo.idMolde);
        return [];
      }

      if (modelo.paletasDecoradas === 0 && modelo.produccionLisa === 0)
        return [];

      const envasesDecoradas = modelo.paletasDecoradas * molde.numeroEnvases;
      const envasesLisas = modelo.produccionLisa * molde.numeroEnvases;
      return [
        {
          modeloMolde: molde.idMolde,
          totalPaletasMolde: modelo.paletasDecoradas + modelo.produccionLisa,
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

    const justificantesPorMolde = modelosForm
      .filter(
        (modelo) => modelo.justificantes && modelo.justificantes.length > 0,
      )
      .map((modelo) => ({
        modeloMolde: modelo.idMolde,
        justificaciones: modelo.justificantes.filter((id) => id > 0),
      }))
      .filter((item) => item.justificaciones.length > 0);

    const gruesasMaquinas = totalEnvasesMaquinas / ENVASES_POR_GRUESA;

    const resumenProduccion = modelosForm.reduce(
      (resumen, modelo) => {
        const molde = moldes.find((item) => item.idMolde === modelo.idMolde);
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
      setGuardando(true);
      const response = await fetch(
        `http://127.0.0.1:8000/produccion/${registro.idCabecera}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fecha,
            tipoTurno: tipoTurno === "2" ? "2 Turnos" : "3 Turnos",
            turno: Number(turno),
            grupo,
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
            justificantes: justificantesPorMolde,
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
    } finally {
      setGuardando(false);
    }
  };

  const resumenProduccion = modelosForm.reduce(
    (resumen, modelo) => {
      const molde = moldes.find((item) => item.idMolde === modelo.idMolde);
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
        {/* === IDENTIFICACIÓN DEL REGISTRO === */}
        <fieldset className={`${styles.fieldset} ${styles.identifyWrapper}`}>
          <legend className={styles.legend}>Datos de Identificación</legend>

          {/* Tipo de Turno */}
          <div className={styles.inputWrapper}>
            <label htmlFor="tipoTurno">
              Tipo de Turno <span className={styles.requireSymbol}>*</span>
            </label>
            <select
              id="tipoTurno"
              value={tipoTurno}
              onChange={(event) => {
                setTipoTurno(event.target.value as "2" | "3");
                setTurno(1);
              }}
              required
            >
              <option value="2">2 Turnos</option>
              <option value="3">3 Turnos</option>
            </select>
          </div>

          {/* Turno */}
          <div className={styles.inputWrapper}>
            <label htmlFor="turno">
              Turno <span className={styles.requireSymbol}>*</span>
            </label>
            <select
              id="turno"
              value={turno}
              onChange={(event) => setTurno(Number(event.target.value))}
              required
            >
              {tipoTurno === "2" && (
                <>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </>
              )}
              {tipoTurno === "3" && (
                <>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </>
              )}
            </select>
          </div>

          {/* Grupo */}
          <div className={styles.inputWrapper}>
            <label htmlFor="grupo">
              Grupo <span className={styles.requireSymbol}>*</span>
            </label>
            <select
              id="grupo"
              value={grupo}
              onChange={(event) => setGrupo(event.target.value)}
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {/* Fecha */}
          <div className={styles.inputWrapper}>
            <label htmlFor="fecha">
              Fecha <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
              required
            />
          </div>

          {/* Técnico */}
          <div className={styles.inputWrapper}>
            <label htmlFor="tecnico">
              Técnico <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="tecnico"
              type="text"
              value={tecnico}
              onChange={(event) => setTecnico(event.target.value)}
              required
            />
          </div>
        </fieldset>

        {/* === MÁQUINAS DE DECORADO === */}
        <fieldset className={`${styles.fieldset} ${styles.maquinas}`}>
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
                      Código del Molde
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
                      <option value={0}>...</option>
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

                  <div className={styles.inputWrapper}>
                    <label
                      htmlFor={`maquina-${maquinaIndex}-hora-${entradaIndex}`}
                    >
                      Hora de Entrada
                    </label>
                    <input
                      id={`maquina-${maquinaIndex}-hora-${entradaIndex}`}
                      type="time"
                      value={entrada.horaEntrada || ""}
                      onChange={(event) =>
                        actualizarEntradaMaquina(
                          maquinaIndex,
                          entradaIndex,
                          "horaEntrada",
                          event.target.value,
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

        {/* === TOTAL DE PALETAS DECORADAS === */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Total de Paletas Decoradas</legend>
          <Campo
            label="Número Total de Paletas Decoradas"
            id="totalPaletasDecoradas"
          >
            <input
              id="totalPaletasDecoradas"
              type="number"
              min="0"
              value={totalPaletasDecoradas || ""}
              onChange={(event) =>
                actualizarTotalPaletasDecoradas(event.target.value)
              }
              required
            />
          </Campo>
        </fieldset>

        {/* === MODELOS DE ENVASE (MOLDES) === */}
        {modelosForm.map((modelo, index) => (
          <ModeloProduccion
            key={index}
            modelo={modelo}
            index={index}
            moldes={moldes}
            justificantes={justificantes}
            cargandoMoldes={cargandoMoldes}
            cargandoJustificantes={cargandoJustificantes}
            maximoDecoradas={obtenerMaximoPaletasDecoradas(index)}
            cambiarPaletasDecoradas={cambiarPaletasDecoradas}
            cambiarProduccionLisa={cambiarProduccionLisa}
            agregarJustificante={agregarJustificante}
            eliminarJustificante={eliminarJustificante}
            actualizarJustificante={actualizarJustificante}
          />
        ))}

        {/* === RESUMEN === */}
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

            <div className={styles.warning}>
              <p>
                ⚠️ <strong>IMPORTANTE:</strong> Los envases de Producción Lisa
                no se toman en consideración para el cáculo de la Eficiencia y
                Deficiencia Productiva de la Decoración.
              </p>
            </div>
          </div>

          {/* Paletas por Molde - Resumen */}
          <div className={styles.paletasPorMolde}>
            <h4 className={styles.paletasPorMoldeTitle}>
              Total de Paletas por cada Molde
            </h4>
            <div className={styles.paletasPorMoldeGrid}>
              {modelosForm.map((modelo, index) => {
                const molde = moldes.find((m) => m.idMolde === modelo.idMolde);
                return molde ? (
                  <div key={index} className={styles.paletasPorMoldeItem}>
                    <span className={styles.paletasPorMoldeLabel}>
                      Molde {molde.nombre}:
                    </span>
                    <span className={styles.paletasPorMoldeValue}>
                      {modelo.paletasDecoradas + modelo.produccionLisa}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
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

        {/* === OBSERVACIONES === */}
        <Campo label="Observaciones" id="observaciones">
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(event) => setObservaciones(event.target.value)}
            rows={8}
          />
        </Campo>
      </section>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttonWrapper}>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}
          disabled={guardando}
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
  justificantes: Justificante[];
  cargandoMoldes: boolean;
  cargandoJustificantes: boolean;
  maximoDecoradas: number;
  cambiarPaletasDecoradas: (index: number, value: string) => void;
  cambiarProduccionLisa: (index: number, value: string) => void;
  agregarJustificante: (modeloIndex: number) => void;
  eliminarJustificante: (
    modeloIndex: number,
    justificanteIndex: number,
  ) => void;
  actualizarJustificante: (
    modeloIndex: number,
    justificanteIndex: number,
    idJustificante: number,
  ) => void;
};

const ModeloProduccion = ({
  modelo,
  index,
  moldes,
  justificantes,
  cargandoMoldes,
  cargandoJustificantes,
  maximoDecoradas,
  cambiarPaletasDecoradas,
  cambiarProduccionLisa,
  agregarJustificante,
  eliminarJustificante,
  actualizarJustificante,
}: ModeloProps) => {
  const molde = moldes.find((item) => item.idMolde === modelo.idMolde);

  const resumen = (paletas: number): Resumen => ({
    camadas: paletas * (molde?.numeroCamadas ?? 0),
    envases: paletas * (molde?.numeroEnvases ?? 0),
    gruesas: (paletas * (molde?.numeroEnvases ?? 0)) / ENVASES_POR_GRUESA,
  });

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        Molde <span className={styles.numberModel}>( {index + 1} )</span>
      </legend>

      <div className={styles.modelHeader}>
        <div className={styles.inputWrapper}>
          <label>Código del Molde</label>
          <input
            type="text"
            readOnly
            value={molde?.nombre ?? modelo.idMolde}
            disabled={cargandoMoldes || moldes.length === 0}
          />
        </div>
        <div className={styles.inputWrapper}>
          <label>Descripción</label>
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
      </div>

      <div className={styles.productionGrid}>
        <GrupoProduccion
          title="Paletas Decoradas"
          value={modelo.paletasDecoradas}
          max={maximoDecoradas}
          onChange={(value) => cambiarPaletasDecoradas(index, value)}
          resumen={resumen(modelo.paletasDecoradas)}
        />
        <GrupoProduccion
          title="Producción Lisa"
          value={modelo.produccionLisa}
          max={undefined}
          onChange={(value) => cambiarProduccionLisa(index, value)}
          resumen={resumen(modelo.produccionLisa)}
        />
      </div>

      <div className={styles.modelTotal}>
        <Campo
          label="Total de Paletas por este Molde"
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

      {/* Justificantes para este molde */}
      <div className={styles.justificantesContainer}>
        <h5 className={styles.justificantesTitle}>Justificantes</h5>
        {modelo.justificantes.map((idJustificante, justificanteIndex) => (
          <div key={justificanteIndex} className={styles.justificanteRow}>
            <div className={styles.inputWrapper}>
              <label htmlFor={`justificante-${index}-${justificanteIndex}`}>
                Justificante
              </label>
              <select
                id={`justificante-${index}-${justificanteIndex}`}
                value={idJustificante || ""}
                onChange={(event) =>
                  actualizarJustificante(
                    index,
                    justificanteIndex,
                    Number(event.target.value),
                  )
                }
                disabled={cargandoJustificantes}
              >
                <option value="">...</option>
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
              onClick={() => eliminarJustificante(index, justificanteIndex)}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.addJustificanteButton}
          onClick={() => agregarJustificante(index)}
        >
          + Agregar Justificante
        </button>
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
  max: number | undefined;
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
        max={max !== undefined ? Math.max(0, max) : undefined}
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
