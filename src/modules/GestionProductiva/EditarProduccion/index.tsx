import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import { ENVASES_POR_GRUESA } from "../../../mocks/modelos";
import { registrosProduccion } from "../../../mocks/registrosproduccion";
import type {
  ProduccionModelo,
  RegistroProduccion,
} from "../../../mocks/registrosproduccion";
import styles from "./editar-produccion.module.css";

type Molde = {
  idMolde: number;
  nombre: string;
  descripcion: string;
  numeroCamadas: number;
  numeroEnvases: number;
};
type ModeloForm = Omit<ProduccionModelo, "modelo"> & { modelo: string };
type Resumen = { camadas: number; envases: number; gruesas: number };
const formatNumber = (value: number) =>
  value.toLocaleString("es-VE", { maximumFractionDigits: 2 });

export const EditarProduccion = () => {
  const { id_registro: idRegistro } = useParams<{ id_registro: string }>();
  const registro = registrosProduccion.find(
    (item) => item.id_registro === Number(idRegistro),
  );
  return registro ? (
    <FormularioEdicion registro={registro} />
  ) : (
    <p>El registro de producción no existe.</p>
  );
};

const FormularioEdicion = ({ registro }: { registro: RegistroProduccion }) => {
  const navigate = useNavigate();
  const [moldes, setMoldes] = useState<Molde[]>([]);
  const [cargandoMoldes, setCargandoMoldes] = useState(true);
  const [turno, setTurno] = useState(registro.turno);
  const [fecha, setFecha] = useState(registro.fecha);
  const [tecnico, setTecnico] = useState(registro.tecnico);
  const [cantidades, setCantidades] = useState<number[]>([
    ...registro.cantidades,
  ]);
  const [totalPaletas, setTotalPaletas] = useState(registro.totalPaletas);
  const [modelosForm, setModelosForm] = useState<ModeloForm[]>([
    ...registro.modelos,
  ]);
  const [observaciones, setObservaciones] = useState(registro.observaciones);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarMoldes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/produccion/moldes");
        if (!response.ok)
          throw new Error(`Error al cargar moldes: ${response.status}`);
        const moldesCargados = (await response.json()) as Molde[];
        setMoldes(moldesCargados);
        setModelosForm((actuales) =>
          actuales.map((modelo) => {
            const molde = moldesCargados.find(
              (item) =>
                item.nombre === modelo.modelo ||
                item.descripcion === modelo.modelo,
            );
            return molde ? { ...modelo, modelo: molde.nombre } : modelo;
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
  const handleReset = () => {
    setTurno(registro.turno);
    setFecha(registro.fecha);
    setTecnico(registro.tecnico);
    setCantidades([...registro.cantidades]);
    setTotalPaletas(registro.totalPaletas);
    setModelosForm([...registro.modelos]);
    setObservaciones(registro.observaciones);
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
  const deficienciaProductiva = gruesasMaquinas
    ? (totalEnvasesPerdidos / ENVASES_POR_GRUESA / gruesasMaquinas) * 100
    : 0;

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />
      <h3 className={styles.title}>Editar Registro #{registro.id_registro}</h3>
      <section className={styles.formData}>
        <fieldset className={styles.identifyWrapper}>
          <legend>Datos de Identificación</legend>
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
        <fieldset>
          <legend>Máquinas de Decorado</legend>
          <div className={styles.fields}>
            {cantidades.map((cantidad, index) => (
              <Campo
                key={index}
                label={`Nro. de Envases (Máquina ${index + 1})`}
                id={`cantidadMaquina${index}`}
              >
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
              </Campo>
            ))}
          </div>
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
        <fieldset>
          <legend>Total de Paletas</legend>
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
                paletasDecoradas: 0,
                produccionLisa: 0,
              },
            ])
          }
        >
          + Añadir Otro Modelo
        </button>
        <fieldset>
          <legend>Resumen</legend>
          <div className={styles.summaryGrid}>
            <ResumenColumn
              label="Total de Envases Decorados"
              total={resumenProduccion.envasesDecorados}
              gruesas={resumenProduccion.envasesDecorados / ENVASES_POR_GRUESA}
            />
            <ResumenColumn
              label="Total de Envases en Producción Lisa"
              total={resumenProduccion.envasesLisa}
              gruesas={resumenProduccion.envasesLisa / ENVASES_POR_GRUESA}
            />
            <ResumenColumn
              label="Total de Envases Perdidos"
              total={totalEnvasesPerdidos}
              gruesas={totalEnvasesPerdidos / ENVASES_POR_GRUESA}
            />
          </div>
          <div className={styles.productivitySummary}>
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
  label: string;
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
  const molde = moldes.find((item) => item.nombre === modelo.modelo);
  const resumen = (paletas: number): Resumen => ({
    camadas: paletas * (molde?.numeroCamadas ?? 0),
    envases: paletas * (molde?.numeroEnvases ?? 0),
    gruesas: (paletas * (molde?.numeroEnvases ?? 0)) / ENVASES_POR_GRUESA,
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
          <label htmlFor={`modelo${index}`}>Modelo de Envase</label>
          <select
            id={`modelo${index}`}
            value={modelo.modelo}
            disabled={cargandoMoldes || moldes.length === 0}
            onChange={(event) =>
              actualizarModelo(index, { modelo: event.target.value })
            }
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
