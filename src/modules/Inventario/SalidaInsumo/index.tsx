import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import styles from "./salida-insumo.module.css";

type Insumo = {
  idInsumo: number;
  tipo: string;
  articulo: string;
  unidad: string;
  cantidadActual: number;
  cantidadMinima: number;
};

type FormData = {
  idInsumo: string;
  encargado: string;
  turno: string;
  grupo: string;
  cantidad: string;
};

const API_INSUMOS = "http://127.0.0.1:8000/api/inventario-insumos";
const API_SALIDAS = "http://127.0.0.1:8000/api/inventario-insumos/salidas";

const TURNOS = ["Turno 1", "Turno 2", "Turno 3"];
const GRUPOS = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"];

export const SalidaInsumo = () => {
  const navigate = useNavigate();

  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [cargandoInsumos, setCargandoInsumos] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    idInsumo: "",
    encargado: "",
    turno: "",
    grupo: "",
    cantidad: "",
  });

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Cargar los insumos disponibles para el select
  useEffect(() => {
    const cargarInsumos = async () => {
      setCargandoInsumos(true);
      try {
        const response = await fetch(API_INSUMOS);
        if (!response.ok) {
          throw new Error(`Error al cargar insumos: ${response.status}`);
        }
        const data = (await response.json()) as Insumo[];
        const ordenados = [...data].sort(
          (a, b) =>
            a.tipo.localeCompare(b.tipo) ||
            a.articulo.localeCompare(b.articulo),
        );
        setInsumos(ordenados);
      } catch {
        setError("No se pudieron cargar los insumos.");
      } finally {
        setCargandoInsumos(false);
      }
    };
    void cargarInsumos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Insumo seleccionado actualmente (para mostrar stock disponible)
  const insumoSeleccionado = insumos.find(
    (i) => i.idInsumo === Number(formData.idInsumo),
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    // Validaciones
    if (!formData.idInsumo) {
      setError("Debes seleccionar un insumo.");
      setCargando(false);
      return;
    }
    if (!formData.encargado.trim()) {
      setError("El encargado es obligatorio.");
      setCargando(false);
      return;
    }
    if (!formData.turno) {
      setError("Debes seleccionar un turno.");
      setCargando(false);
      return;
    }
    if (!formData.grupo) {
      setError("Debes seleccionar un grupo.");
      setCargando(false);
      return;
    }
    if (!formData.cantidad || Number(formData.cantidad) <= 0) {
      setError("La cantidad debe ser mayor a 0.");
      setCargando(false);
      return;
    }
    if (
      insumoSeleccionado &&
      Number(formData.cantidad) > insumoSeleccionado.cantidadActual
    ) {
      setError(
        `La cantidad supera el stock disponible (${insumoSeleccionado.cantidadActual} ${insumoSeleccionado.unidad}).`,
      );
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(API_SALIDAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idInsumo: Number(formData.idInsumo),
          encargado: formData.encargado,
          turno: formData.turno,
          grupo: formData.grupo,
          cantidad: Number(formData.cantidad),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al registrar salida: ${response.status}`,
        );
      }

      navigate("/inventario");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al registrar la salida.",
      );
    } finally {
      setCargando(false);
    }
  };

  const handleReset = () => {
    setFormData({
      idInsumo: "",
      encargado: "",
      turno: "",
      grupo: "",
      cantidad: "",
    });
    setError("");
  };

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Registro de Salida de Insumo</h3>

      <section className={styles.formData}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos del Movimiento</legend>

          <div className={styles.inputWrapper}>
            <label htmlFor="idInsumo">
              Insumo <span className={styles.requireSymbol}>*</span>
            </label>
            <select
              id="idInsumo"
              name="idInsumo"
              value={formData.idInsumo}
              onChange={handleChange}
              disabled={cargandoInsumos}
              required
            >
              <option value="">
                {cargandoInsumos ? "Cargando insumos..." : "..."}
              </option>
              {insumos.map((insumo) => (
                <option key={insumo.idInsumo} value={insumo.idInsumo}>
                  ({insumo.tipo}) - {insumo.articulo} --&gt;{" "}
                  {insumo.cantidadActual} {insumo.unidad}
                </option>
              ))}
            </select>
          </div>

          {insumoSeleccionado && (
            <p className={styles.stockInfo}>
              Stock disponible:{" "}
              <strong>
                {insumoSeleccionado.cantidadActual} {insumoSeleccionado.unidad}
              </strong>
            </p>
          )}

          <div className={styles.inputWrapper}>
            <label htmlFor="encargado">
              Encargado <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="encargado"
              name="encargado"
              type="text"
              value={formData.encargado}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputWrapper}>
              <label htmlFor="turno">
                Turno <span className={styles.requireSymbol}>*</span>
              </label>
              <select
                id="turno"
                name="turno"
                value={formData.turno}
                onChange={handleChange}
                required
              >
                <option value="">...</option>
                {TURNOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="grupo">
                Grupo <span className={styles.requireSymbol}>*</span>
              </label>
              <select
                id="grupo"
                name="grupo"
                value={formData.grupo}
                onChange={handleChange}
                required
              >
                <option value="">...</option>
                {GRUPOS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="cantidad">
              Cantidad <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.cantidad}
              onChange={handleChange}
              required
            />
          </div>
        </fieldset>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonWrapper}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
            disabled={cargando}
          >
            Resetear
          </button>
        </div>
      </section>
    </form>
  );
};
