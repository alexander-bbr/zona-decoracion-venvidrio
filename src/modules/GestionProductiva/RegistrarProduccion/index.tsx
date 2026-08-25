import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import { ENVASES_POR_GRUESA } from "../../../mocks/modelos";
import type { ProduccionModelo } from "../../../mocks/registrosproduccion";
import styles from "./registrar-produccion.module.css";

type ModeloForm = Omit<ProduccionModelo, "modelo"> & { modelo: string };
type Molde = {
  idMolde: number;
  nombre: string;
  descripcion: string;
  numeroCamadas: number;
  numeroEnvases: number;
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
  const [turno, setTurno] = useState<"A" | "B" | "C">("A");
  const [fecha, setFecha] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [cantidades, setCantidades] = useState<number[]>([0, 0, 0, 0]);
  const [totalPaletas, setTotalPaletas] = useState(0);
  const [modelosForm, setModelosForm] = useState<ModeloForm[]>([
    modeloInicial(),
  ]);
  const [observaciones, setObservaciones] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarMoldes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/produccion/moldes");
        if (!response.ok) {
          throw new Error(`Error al cargar moldes: ${response.status}`);
        }
        setMoldes((await response.json()) as Molde[]);
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

    void cargarMoldes();
  }, []);

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
    setCantidades([0, 0, 0, 0]);
    setTotalPaletas(0);
    setModelosForm([modeloInicial()]);
    setObservaciones("");
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fecha || !tecnico || totalPaletas <= 0) {
      setError("Completa la fecha, el técnico y el total de paletas.");
      return;
    }
    navigate("/gestion-productiva");
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
  const totalEnvasesMaquinas = cantidades.reduce(
    (total, cantidad) => total + cantidad,
    0,
  );
  const totalEnvasesPerdidos = Math.max(
    0,
    totalEnvasesMaquinas -
      resumenProduccion.envasesDecorados -
      resumenProduccion.envasesLisa,
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
        <fieldset className={styles.identifyWrapper}>
          <legend>Datos de Identificación</legend>
          {/* Turno */}
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

        <fieldset>
          <legend>Máquinas de Decorado</legend>

          <div className={styles.fields}>
            {cantidades.map((cantidad, index) => (
              <div className={styles.inputWrapper} key={index}>
                <label
                  style={{ textAlign: "center" }}
                  htmlFor={`cantidadMaquina${index}`}
                >
                  Nro. de Envases{" "}
                  <span className={styles.machine}>(Máquina {index + 1})</span>
                </label>
                <input
                  id={`cantidadMaquina${index}`}
                  type="number"
                  min="0"
                  value={cantidad || ""}
                  onChange={(event) =>
                    setCantidades((actuales) =>
                      actuales.map((actual, actualIndex) =>
                        actualIndex === index
                          ? Math.max(0, Number(event.target.value) || 0)
                          : actual,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>
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
        <fieldset>
          <legend>Total de Paletas</legend>
          {/* Total de Paletas */}
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

        {/* === AÑADIR OTRO MODELO DE ENVASE === */}
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
        <fieldset>
          <legend>Resumen</legend>
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
          </div>
          <div className={styles.productivitySummary}>
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
      </section>

      {/* === MENSAJE DE ERROR === */}
      {error && <p className={styles.error}>{error}</p>}

      {/* === BOTONES PRINCIPALES === */}
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
    <fieldset>
      <legend>
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
          <label>Modelo de Envase</label>
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
            Total de Paletas por Modelo
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
