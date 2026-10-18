import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import styles from "./registrar-justificante.module.css";

type FormData = {
  etiqueta: string;
  descripcion: string;
  estado: boolean;
};

const API_JUSTIFICANTES = "http://127.0.0.1:8000/api/gestion-justificantes";

export const RegistrarJustificante = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    etiqueta: "",
    descripcion: "",
    estado: true,
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    // Validaciones
    if (!formData.etiqueta.trim()) {
      setError("La etiqueta del justificante es obligatoria.");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(API_JUSTIFICANTES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al registrar justificante: ${response.status}`,
        );
      }

      navigate("/gestion-justificantes");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al registrar justificante.",
      );
    } finally {
      setCargando(false);
    }
  };

  const handleReset = () => {
    setFormData({
      etiqueta: "",
      descripcion: "",
      estado: true,
    });
    setError("");
  };

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Registrar Nuevo Justificante</h3>

      <section className={styles.formData}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos del Justificante</legend>

          <div className={styles.inputWrapper}>
            <label htmlFor="etiqueta">
              Etiqueta <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="etiqueta"
              name="etiqueta"
              type="text"
              value={formData.etiqueta}
              onChange={handleChange}
              placeholder="Ej: Desperfecto en el Decorado"
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="descripcion">
              Descripción <span className={styles.requireSymbol}>*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción detallada del justificante"
              rows={6}
              required
            />
          </div>

          <div className={styles.checkboxWrapper}>
            <label htmlFor="estado" className={styles.checkboxLabel}>
              <input
                id="estado"
                name="estado"
                type="checkbox"
                checked={formData.estado}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <span>Justificante Activo</span>
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
