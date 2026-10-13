import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../../../../components/HeaderForm";
import styles from "./registrar-meta.module.css";

type FormData = {
  anio: number;
  mes: string;
  deficiencia: string;
  estado: boolean;
};

const API_METAS = "http://127.0.0.1:8000/api/rendimiento/metas";

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

export const RegistrarMeta = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState<FormData>({
    anio: currentYear,
    mes: "enero",
    deficiencia: "",
    estado: false,
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

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
    setCargando(true);

    // Validaciones
    if (formData.anio <= 0) {
      setError("El año debe ser mayor a 0.");
      setCargando(false);
      return;
    }
    if (!formData.mes) {
      setError("Debes seleccionar un mes.");
      setCargando(false);
      return;
    }
    const defNum = Number(formData.deficiencia);
    if (formData.deficiencia === "" || isNaN(defNum)) {
      setError("La deficiencia debe ser un número.");
      setCargando(false);
      return;
    }
    if (defNum < 0 || defNum > 100) {
      setError("La deficiencia debe estar entre 0 y 100.");
      setCargando(false);
      return;
    }

    // Preparar datos para enviar
    const datosEnviar = {
      anio: formData.anio,
      mes: formData.mes,
      deficiencia: String(defNum),
      estado: formData.estado,
    };

    try {
      const response = await fetch(API_METAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEnviar),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al registrar meta: ${response.status}`,
        );
      }

      navigate("/rendimiento/metas");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al registrar meta.",
      );
    } finally {
      setCargando(false);
    }
  };

  const handleReset = () => {
    setFormData({
      anio: currentYear,
      mes: "enero",
      deficiencia: "",
      estado: false,
    });
    setError("");
  };

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Registrar Nueva Meta</h3>

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
                step="1"
                value={formData.deficiencia}
                onChange={handleChange}
                placeholder="Ej: 85"
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
            disabled={cargando}
          >
            {cargando ? "Registrando..." : "Guardar"}
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
