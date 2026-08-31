import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import styles from "./editar-justificante.module.css";

type Justificante = {
  idJustificante: number;
  etiqueta: string;
  descripcion: string | null;
};

type FormData = {
  etiqueta: string;
  descripcion: string;
};

const API_JUSTIFICANTES = "http://127.0.0.1:8000/api/gestion-justificantes";

export const EditarJustificante = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p className={styles.error}>ID de justificante inválido.</p>;
  }

  return <CargarJustificante idJustificante={id} />;
};

const CargarJustificante = ({ idJustificante }: { idJustificante: string }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    etiqueta: "",
    descripcion: "",
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarJustificante = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(`${API_JUSTIFICANTES}/${idJustificante}`);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.detail ??
              (response.status === 404
                ? "El Justificante especificado no existe."
                : `Error al cargar justificante: ${response.status}`),
          );
        }
        const justificante = (await response.json()) as Justificante;
        setFormData({
          etiqueta: justificante.etiqueta,
          descripcion: justificante.descripcion || "",
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar justificante.",
        );
      } finally {
        setCargando(false);
      }
    };
    void cargarJustificante();
  }, [idJustificante]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setGuardando(true);

    // Validaciones
    if (!formData.etiqueta.trim()) {
      setError("La etiqueta del justificante es obligatoria.");
      setGuardando(false);
      return;
    }

    try {
      const response = await fetch(`${API_JUSTIFICANTES}/${idJustificante}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ??
            `Error al actualizar justificante: ${response.status}`,
        );
      }

      navigate("/gestion-justificantes");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al actualizar justificante.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch(`${API_JUSTIFICANTES}/${idJustificante}`);
      if (response.ok) {
        const justificante = (await response.json()) as Justificante;
        setFormData({
          etiqueta: justificante.etiqueta,
          descripcion: justificante.descripcion || "",
        });
      }
    } catch {
      // Ignorar errores en reset
    }
    setError("");
  };

  if (cargando) {
    return <p className={styles.loading}>Cargando justificante...</p>;
  }

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Editar Justificante #{idJustificante}</h3>

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
