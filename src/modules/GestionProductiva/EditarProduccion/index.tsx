import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import { ENVASES_POR_GRUESA, modelos } from "../../../mocks/modelos";
import { registrosProduccion } from "../../../mocks/registrosproduccion";
import type {
  ProduccionModelo,
  RegistroProduccion,
} from "../../../mocks/registrosproduccion";
import styles from "./editar-produccion.module.css";

type ModeloForm = ProduccionModelo;
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
      [campo]: Math.max(
        0,
        Math.min(Number(value) || 0, obtenerMaximoPaletas(index, campo)),
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
      const definicion =
        modelos.find((item) => item.descripcion === modelo.modelo) ??
        modelos[0];
      resumen.envasesDecorados += modelo.paletasDecoradas * definicion.envases;
      resumen.envasesLisa += modelo.produccionLisa * definicion.envases;
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

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />
      <h3 className={styles.title}>Editar Registro #{registro.id_registro}</h3>
      <section className={styles.formData}>
        <fieldset className={styles.identifyWrapper}>
          <legend>Datos de Identificación</legend>
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
        <fieldset>
          <legend>Máquinas de Decorado</legend>
          <div className={styles.fields}>
            {cantidades.map((cantidad, index) => (
              <div className={styles.inputWrapper} key={index}>
                <label htmlFor={`cantidadMaquina${index}`}>
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
        <fieldset>
          <legend>Total de Paletas</legend>
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
        {modelosForm.map((modelo, index) => (
          <ModeloProduccion
            key={index}
            modelo={modelo}
            index={index}
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
              { modelo: "Pepsi", paletasDecoradas: 0, produccionLisa: 0 },
            ])
          }
        >
          + Añadir Otro Modelo
        </button>
        <fieldset>
          <legend>Resumen</legend>
          <div className={styles.summaryGrid}>
            <ResumenColumn
              totalId="totalEnvasesDecorados"
              totalLabel="Total de Envases Decorados"
              total={resumenProduccion.envasesDecorados}
              gruesasId="cantidadGruesasDecoradas"
              gruesas={resumenProduccion.envasesDecorados / ENVASES_POR_GRUESA}
            />
            <ResumenColumn
              totalId="totalEnvasesLisa"
              totalLabel="Total de Envases en Producción Lisa"
              total={resumenProduccion.envasesLisa}
              gruesasId="cantidadGruesasLisa"
              gruesas={resumenProduccion.envasesLisa / ENVASES_POR_GRUESA}
            />
            <ResumenColumn
              totalId="totalEnvasesPerdidos"
              totalLabel="Total de Envases Perdidos"
              total={totalEnvasesPerdidos}
              gruesasId="cantidadGruesasPerdidas"
              gruesas={totalEnvasesPerdidos / ENVASES_POR_GRUESA}
            />
          </div>
        </fieldset>
        <div className={styles.inputWrapper}>
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(event) => setObservaciones(event.target.value)}
            rows={8}
          />
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
  maximoDecoradas,
  maximoLisa,
  actualizarModelo,
  cambiarPaletas,
  onEliminar,
}: ModeloProduccionProps) => {
  const definicion =
    modelos.find((item) => item.descripcion === modelo.modelo) ?? modelos[0];
  const resumen = (paletas: number) => ({
    camadas: paletas * definicion.camadas,
    envases: paletas * definicion.envases,
    gruesas: (paletas * definicion.envases) / ENVASES_POR_GRUESA,
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
            value={modelo.modelo}
            onChange={(event) =>
              actualizarModelo(index, {
                modelo: event.target.value as ModeloForm["modelo"],
              })
            }
          >
            {[...new Set(modelos.map((item) => item.descripcion))].map(
              (nombre) => (
                <option key={nombre}>{nombre}</option>
              ),
            )}
          </select>
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
      <input type="text" readOnly value={formatNumber(resumen.gruesas)} />
    </div>
  </div>
);
type ResumenColumnProps = {
  totalId: string;
  totalLabel: string;
  total: number;
  gruesasId: string;
  gruesas: number;
};
const ResumenColumn = ({
  totalId,
  totalLabel,
  total,
  gruesasId,
  gruesas,
}: ResumenColumnProps) => (
  <div className={styles.summaryColumn}>
    <div className={styles.inputWrapper}>
      <label htmlFor={totalId}>{totalLabel}</label>
      <input id={totalId} type="text" readOnly value={formatNumber(total)} />
    </div>
    <div className={styles.inputWrapper}>
      <label htmlFor={gruesasId}>Cantidad en Gruesas</label>
      <input
        id={gruesasId}
        type="text"
        readOnly
        value={formatNumber(gruesas)}
      />
    </div>
  </div>
);
