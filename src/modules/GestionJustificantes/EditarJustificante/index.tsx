import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import {
  getJustificanteById,
  updateJustificante,
} from "../../../mocks/justificantes";
import styles from "./editar-justificante.module.css";

type FormData = {
  etiqueta: string;
  descripcion: string;
};

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
        const justificante = await getJustificanteById(Number(idJustificante));
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
      await updateJustificante(Number(idJustificante), {
        etiqueta: formData.etiqueta,
        descripcion: formData.descripcion || null,
      });

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
      const justificante = await getJustificanteById(Number(idJustificante));
      setFormData({
        etiqueta: justificante.etiqueta,
        descripcion: justificante.descripcion || "",
      });
      setError("");
    } catch {
      // Ignorar errores en reset
    }
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
