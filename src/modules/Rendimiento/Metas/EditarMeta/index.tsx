import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderForm } from "../../../../components/HeaderForm";
import styles from "./editar-meta.module.css";

type Meta = {
  idMeta: number;
  anio: number;
  mes: string;
  deficiencia: number;
  estado: boolean;
};

type FormData = {
  anio: number;
  mes: string;
  deficiencia: string;
  estado: boolean;
};

const API_METAS_ITEM = "http://127.0.0.1:8000/api/rendimiento";

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const EditarMeta = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p className={styles.error}>ID de meta inválido.</p>;
  }

  return <CargarMeta idMeta={id} />;
};

const CargarMeta = ({ idMeta }: { idMeta: string }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    anio: 0,
    mes: "enero",
    deficiencia: "",
    estado: false,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarMeta = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(`${API_METAS_ITEM}/${idMeta}`);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.detail ??
              (response.status === 404
                ? "La meta especificada no existe."
                : `Error al cargar meta: ${response.status}`),
          );
        }
        const meta = (await response.json()) as Meta;
        setFormData({
          anio: Number(meta.anio),
          mes: meta.mes,
          deficiencia: String(meta.deficiencia),
          estado: Boolean(meta.estado),
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar meta.",
        );
      } finally {
        setCargando(false);
      }
    };
    void cargarMeta();
  }, [idMeta]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else if (name === "anio") {
      setFormData((prev) => ({
        ...prev,
        anio: value === "" ? 0 : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setGuardando(true);

    // Validaciones
    if (formData.anio <= 0) {
      setError("El año debe ser mayor a 0.");
      setGuardando(false);
      return;
    }
    if (!formData.mes) {
      setError("Debes seleccionar un mes.");
      setGuardando(false);
      return;
    }
    const defNum = Number(formData.deficiencia);
    if (formData.deficiencia === "" || isNaN(defNum)) {
      setError("La deficiencia debe ser un número.");
      setGuardando(false);
      return;
    }
    if (defNum < 0 || defNum > 100) {
      setError("La deficiencia debe estar entre 0 y 100.");
      setGuardando(false);
      return;
    }

    const datosEnviar = {
      anio: formData.anio,
      mes: formData.mes,
      deficiencia: defNum,
      estado: formData.estado,
    };

    try {
      //* Aquí también usamos /rendimiento/{id}, no /rendimiento/metas/{id}
      const response = await fetch(`${API_METAS_ITEM}/${idMeta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEnviar),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al actualizar meta: ${response.status}`,
        );
      }

      navigate("/rendimiento/metas");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al actualizar meta.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleReset = () => {
    const cargarMeta = async () => {
      try {
        const response = await fetch(`${API_METAS_ITEM}/${idMeta}`);
        if (response.ok) {
          const meta = (await response.json()) as Meta;
          setFormData({
            anio: Number(meta.anio),
            mes: meta.mes,
            deficiencia: String(meta.deficiencia),
            estado: Boolean(meta.estado),
          });
        }
      } catch {
        // Ignorar errores en reset
      }
    };
    void cargarMeta();
    setError("");
  };

  if (cargando) {
    return <p className={styles.loading}>Cargando meta...</p>;
  }

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Editar Meta #{idMeta}</h3>

      <section className={styles.formData}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos de la Meta</legend>

          <div className={styles.numbers}>
            <div className={styles.inputWrapper}>
              <label htmlFor="anio">
                Año <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                id="anio"
                name="anio"
                type="number"
                min="2000"
                max="2100"
                value={formData.anio || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="mes">
                Mes <span className={styles.requireSymbol}>*</span>
              </label>
              <select
                id="mes"
                name="mes"
                value={formData.mes}
                onChange={handleChange}
                required
              >
                {MESES.map((mes) => (
                  <option key={mes} value={mes}>
                    {mes.charAt(0).toUpperCase() + mes.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="deficiencia">
                Deficiencia (%) <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                id="deficiencia"
                name="deficiencia"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.deficiencia}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.checkboxWrapper}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
              />
              Marcar como <strong>activa</strong>
            </label>
          </div>
        </fieldset>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonWrapper}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={guardando}
          >
            {guardando ? "Actualizando..." : "Actualizar"}
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
      </section>
    </form>
  );
};
