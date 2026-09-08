import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import { ENVASES_POR_GRUESA } from "../../../../constants";
import styles from "./registrar-produccion.module.css";

type ModeloForm = {
  modelo: string;
  paletasDecoradas: number;
  produccionLisa: number;
};

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

const modeloInicial = (nombre = ""): ModeloForm => ({
  modelo: nombre,
  paletasDecoradas: 0,
  produccionLisa: 0,
});

const formatNumber = (value: number) =>
  value.toLocaleString("es-VE", { maximumFractionDigits: 2 });

export const RegistrarProduccion = () => {
  const navigate = useNavigate();
  const [moldes, setMoldes] = useState<Molde[]>([]);
  const [cargandoMoldes, setCargandoMoldes] = useState(true);
  const [justificantes, setJustificantes] = useState<Justificante[]>([]);
  const [cargandoJustificantes, setCargandoJustificantes] = useState(true);
  const [turno, setTurno] = useState<"A" | "B" | "C">("A");
  const [fecha, setFecha] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [maquinas, setMaquinas] = useState<MaquinaProduccion[]>([
    { entradas: [{ idMolde: 0, cantEnvases: 0 }] },
    { entradas: [{ idMolde: 0, cantEnvases: 0 }] },
    { entradas: [{ idMolde: 0, cantEnvases: 0 }] },
    { entradas: [{ idMolde: 0, cantEnvases: 0 }] },
  ]);
  const [totalPaletas, setTotalPaletas] = useState(0);
  const [modelosForm, setModelosForm] = useState<ModeloForm[]>([
    modeloInicial(),
  ]);
  const [observaciones, setObservaciones] = useState("");
  const [justificantesSeleccionados, setJustificantesSeleccionados] = useState<
    number[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarMoldes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/produccion/moldes");
        if (!response.ok) {
          throw new Error(`Error al cargar moldes: ${response.status}`);
        }
        const moldesCargados = ((await response.json()) as Molde[]).map(
          (molde) => ({
            ...molde,
            numeroCamadas: Number(molde.numeroCamadas),
            numeroEnvases: Number(molde.numeroEnvases),
          }),
        );
        setMoldes(moldesCargados);
        // Actualizar el primer modelo con el primer molde disponible
        setModelosForm((actuales) =>
          actuales.map((modelo, index) =>
            index === 0 && !modelo.modelo && moldesCargados.length > 0
              ? { ...modelo, modelo: moldesCargados[0].nombre }
              : modelo,
          ),
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

  const actualizarModelo = (index: number, changes: Partial<ModeloForm>) => {
    setModelosForm((actuales) =>
      actuales.map((modelo, modeloIndex) =>
        modeloIndex === index ? { ...modelo, ...changes } : modelo,
      ),
    );
  };

  const obtenerMaximoPaletas = (
    index: number,
    campo: "paletasDecoradas" | "produccionLisa",
  ) => {
    const otrasPaletas = modelosForm.reduce(
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
    );
    return Math.max(0, totalPaletas - otrasPaletas);
  };

  const cambiarPaletas = (
    index: number,
    campo: "paletasDecoradas" | "produccionLisa",
    value: string,
  ) => {
    const cantidad = Math.max(
      0,
      Math.min(Number(value) || 0, obtenerMaximoPaletas(index, campo)),
    );
    actualizarModelo(index, { [campo]: cantidad });
  };

  const handleReset = () => {
    setTurno("A");
    setFecha("");
    setTecnico("");
    setMaquinas([
      { entradas: [{ idMolde: 0, cantEnvases: 0 }] },
      { entradas: [{ idMolde: 0, cantEnvases: 0 }] },
      { entradas: [{ idMolde: 0, cantEnvases: 0 }] },
      { entradas: [{ idMolde: 0, cantEnvases: 0 }] },
    ]);
    setTotalPaletas(0);
    setModelosForm([modeloInicial()]);
    setObservaciones("");
    setJustificantesSeleccionados([]);
    setError("");
  };

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

    // Construir salidas
    const salidas = modelosForm.flatMap((modelo) => {
      const molde = moldes.find((item) => item.nombre === modelo.modelo);
      if (!molde) {
        console.warn("No se encontró molde para el modelo:", modelo.modelo);
        return [];
      }
      const camadasDecoradas = modelo.paletasDecoradas * molde.numeroCamadas;
      const envasesDecoradas = modelo.paletasDecoradas * molde.numeroEnvases;
      const camadasLisas = modelo.produccionLisa * molde.numeroCamadas;
      const envasesLisas = modelo.produccionLisa * molde.numeroEnvases;

      if (modelo.paletasDecoradas === 0 && modelo.produccionLisa === 0)
        return [];

      return [
        {
          modeloMolde: molde.idMolde,
          totalPaletas: modelo.paletasDecoradas + modelo.produccionLisa,
          cantPaletasLisas: modelo.produccionLisa,
          cantCamadasLisas: camadasLisas,
          cantEnvasesLisas: envasesLisas,
          cantGruesasLisas: envasesLisas / ENVASES_POR_GRUESA,
          cantPaletasDecoradas: modelo.paletasDecoradas,
          cantCamadasDecoradas: camadasDecoradas,
          cantEnvasesDecoradas: envasesDecoradas,
          cantGruesasDecoradas: envasesDecoradas / ENVASES_POR_GRUESA,
        },
      ];
    });

    if (salidas.length === 0) {
      setError(
        "No se encontraron moldes válidos para los modelos seleccionados. Verifica que hayas seleccionado un molde.",
      );
      return;
    }

    const justificantesValidos = justificantesSeleccionados.filter(
      (id) => id > 0,
    );
    const gruesasMaquinas = totalEnvasesMaquinas / ENVASES_POR_GRUESA;

    const resumenProduccion = modelosForm.reduce(
      (resumen, modelo) => {
        const molde = moldes.find(
          (item) => item.nombre === (modelo.modelo || moldes[0]?.nombre),
        );
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
    const eficienciaProductiva = 100 - deficienciaProductiva;

    try {
      const response = await fetch("http://127.0.0.1:8000/produccion/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
            eficienciaProductiva,
            deficienciaProductiva,
            observaciones,
          },
          justificantes: justificantesValidos,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al registrar producción: ${response.status}`,
        );
      }
      navigate("/gestion-productiva");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al registrar producción.",
      );
    }
  };

  const resumenProduccion = modelosForm.reduce(
    (resumen, modelo) => {
      const molde = moldes.find(
        (item) => item.nombre === (modelo.modelo || moldes[0]?.nombre),
      );
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
  const gruesasPerdidas = totalEnvasesPerdidos / ENVASES_POR_GRUESA;
  const deficienciaProductiva = gruesasMaquinas
    ? (gruesasPerdidas / gruesasMaquinas) * 100
    : 0;
  const eficienciaProductiva = 100 - deficienciaProductiva;

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Registrar Producción</h3>

      <section className={styles.formData}>
        {/* === IDENTIFICACIÓN DEL REGISTRO === */}
        <fieldset className={`${styles.fieldset} ${styles.identifyWrapper}`}>
          <legend className={styles.legend}>Datos de Identificación</legend>
          <div className={styles.inputWrapper}>
            <label htmlFor="turno">
              Turno <span className={styles.requireSymbol}>*</span>
            </label>
            <select
              id="turno"
              value={turno}
              onChange={(event) =>
                setTurno(event.target.value as "A" | "B" | "C")
              }
              required
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </div>

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
            <div className={styles.inputWrapper}>
              <label htmlFor="totalEnvasesMaquinas">Total de Envases</label>
              <input
                id="totalEnvasesMaquinas"
                type="text"
                readOnly
                value={formatNumber(totalEnvasesMaquinas)}
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="cantidadGruesasMaquinas">
                Cantidad en Gruesas
              </label>
              <input
                id="cantidadGruesasMaquinas"
                type="text"
                readOnly
                value={formatNumber(totalEnvasesMaquinas / ENVASES_POR_GRUESA)}
              />
            </div>
          </div>
        </fieldset>

        {/* === TOTAL DE PALETAS === */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Total de Paletas</legend>
          <div className={styles.inputWrapper}>
            <label htmlFor="totalPaletas">
              Número Total de Paletas{" "}
              <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="totalPaletas"
              type="number"
              min="0"
              value={totalPaletas || ""}
              onChange={(event) => actualizarTotalPaletas(event.target.value)}
              required
            />
          </div>
        </fieldset>

        {/* === MODELOS DE ENVASE === */}
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
              modeloInicial(moldes[0]?.nombre),
            ])
          }
        >
          + Añadir Otro Modelo
        </button>

        {/* === RESUMEN === */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Resumen</legend>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryColumn}>
              <div className={styles.inputWrapper}>
                <label htmlFor="totalEnvasesDecorados">
                  Total de Envases Decorados
                </label>
                <input
                  id="totalEnvasesDecorados"
                  readOnly
                  value={formatNumber(resumenProduccion.envasesDecorados)}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="cantidadGruesasDecoradas">
                  Cantidad en Gruesas
                </label>
                <input
                  id="cantidadGruesasDecoradas"
                  readOnly
                  value={formatNumber(
                    resumenProduccion.envasesDecorados / ENVASES_POR_GRUESA,
                  )}
                />
              </div>
            </div>

            <div className={styles.summaryColumn}>
              <div className={styles.inputWrapper}>
                <label htmlFor="totalEnvasesPerdidos">
                  Total de Envases Perdidos
                </label>
                <input
                  id="totalEnvasesPerdidos"
                  type="text"
                  readOnly
                  value={formatNumber(totalEnvasesPerdidos)}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="cantidadGruesasPerdidas">
                  Cantidad en Gruesas
                </label>
                <input
                  id="cantidadGruesasPerdidas"
                  type="text"
                  readOnly
                  value={formatNumber(
                    totalEnvasesPerdidos / ENVASES_POR_GRUESA,
                  )}
                />
              </div>
            </div>

            <div className={styles.summaryColumn}>
              <div className={styles.inputWrapper}>
                <label htmlFor="totalEnvasesLisa">
                  Total de Envases en Producción Lisa
                </label>
                <input
                  id="totalEnvasesLisa"
                  readOnly
                  value={formatNumber(resumenProduccion.envasesLisa)}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="cantidadGruesasLisa">Cantidad en Gruesas</label>
                <input
                  id="cantidadGruesasLisa"
                  readOnly
                  value={formatNumber(
                    resumenProduccion.envasesLisa / ENVASES_POR_GRUESA,
                  )}
                />
              </div>
            </div>
          </div>
          <div className={styles.productivitySummary}>
            <div className={styles.inputWrapper}>
              <label htmlFor="eficienciaProductiva">
                Eficiencia Productiva
              </label>
              <div className={styles.percentageInput}>
                <input
                  id="eficienciaProductiva"
                  type="number"
                  step="0.01"
                  readOnly
                  value={Number(eficienciaProductiva.toFixed(2))}
                />
                <span>%</span>
              </div>
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="deficienciaProductiva">
                Deficiencia Productiva
              </label>
              <div className={styles.percentageInput}>
                <input
                  id="deficienciaProductiva"
                  type="number"
                  step="0.01"
                  readOnly
                  value={Number(deficienciaProductiva.toFixed(2))}
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </fieldset>

        {/* === OBSERVACIONES === */}
        <div className={styles.inputWrapper}>
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(event) => setObservaciones(event.target.value)}
            placeholder="Describe el motivo de las pérdidas o cualquier información de interés."
            rows={8}
          />
        </div>

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

type ModeloProduccionProps = {
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
}: ModeloProduccionProps) => {
  const definicion = moldes.find(
    (item) => item.nombre === (modelo.modelo || moldes[0]?.nombre),
  );
  const resumen = (paletas: number) => ({
    camadas: paletas * (definicion?.numeroCamadas ?? 0),
    envases: paletas * (definicion?.numeroEnvases ?? 0),
    gruesas: (paletas * (definicion?.numeroEnvases ?? 0)) / ENVASES_POR_GRUESA,
  });
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        Molde <span className={styles.numberModel}>( {index + 1} )</span>
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
          <label>Código del Molde</label>
          <select
            value={modelo.modelo || moldes[0]?.nombre || ""}
            disabled={cargandoMoldes || moldes.length === 0}
            onChange={(event) =>
              actualizarModelo(index, {
                modelo: event.target.value,
              })
            }
          >
            {moldes.map((molde) => (
              <option key={molde.idMolde} value={molde.nombre}>
                {molde.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.inputWrapper}>
          <label>Descripción</label>
          <input
            className={styles.descriptionInput}
            type="text"
            readOnly
            value={definicion?.descripcion ?? ""}
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
        <div className={styles.inputWrapper}>
          <label htmlFor={`totalPaletasModelo${index}`}>
            Total de Paletas por este Molde
          </label>
          <input
            id={`totalPaletasModelo${index}`}
            type="number"
            readOnly
            value={modelo.paletasDecoradas + modelo.produccionLisa}
          />
        </div>
      </div>
    </fieldset>
  );
};

type GrupoProduccionProps = {
  title: string;
  value: number;
  max: number;
  onChange: (value: string) => void;
  resumen: { camadas: number; envases: number; gruesas: number };
};

const GrupoProduccion = ({
  title,
  value,
  max,
  onChange,
  resumen,
}: GrupoProduccionProps) => (
  <div className={styles.productionGroup}>
    <h4>{title}</h4>

    <div className={styles.inputWrapper}>
      <label>Número de Paletas</label>
      <input
        type="number"
        min="0"
        max={Math.max(0, max)}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>

    <div className={styles.inputWrapper}>
      <label>Total de Camadas</label>
      <input readOnly value={formatNumber(resumen.camadas)} />
    </div>

    <div className={styles.inputWrapper}>
      <label>Total de Envases</label>
      <input readOnly value={formatNumber(resumen.envases)} />
    </div>

    <div className={styles.inputWrapper}>
      <label>Total de Gruesas</label>
      <input readOnly value={formatNumber(resumen.gruesas)} />
    </div>
  </div>
);
