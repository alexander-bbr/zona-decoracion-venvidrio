import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import { ENVASES_POR_GRUESA } from "../../../../constants";
import styles from "./registrar-molde.module.css";

type FormData = {
  nombre: string;
  descripcion: string;
  numeroCamadas: number;
  numeroEnvases: number;
  numeroGruesas: number;
};

const API_MOLDES = "http://127.0.0.1:8000/api/gestion-moldes";

export const RegistrarMolde = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    numeroCamadas: 0,
    numeroEnvases: 0,
    numeroGruesas: 0,
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (name === "numeroEnvases") {
      const envases = value === "" ? 0 : Number(value);
      const gruesas = envases / ENVASES_POR_GRUESA;
      setFormData((prev) => ({
        ...prev,
        numeroEnvases: envases,
        numeroGruesas: Number(gruesas.toFixed(2)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    // Validaciones
    if (!formData.nombre.trim()) {
      setError("El nombre del molde es obligatorio.");
      setCargando(false);
      return;
    }
    if (formData.numeroCamadas <= 0) {
      setError("El número de camadas debe ser mayor a 0.");
      setCargando(false);
      return;
    }
    if (formData.numeroEnvases <= 0) {
      setError("El número de envases debe ser mayor a 0.");
      setCargando(false);
      return;
    }

    // Preparar datos para enviar (incluyendo numeroGruesas calculado)
    const datosEnviar = {
      ...formData,
      numeroGruesas: formData.numeroEnvases / ENVASES_POR_GRUESA,
    };

    try {
      const response = await fetch(API_MOLDES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEnviar),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al registrar molde: ${response.status}`,
        );
      }

      alert("¡Molde registrado exitosamente!");
      navigate("/gestion-moldes");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al registrar molde.",
      );
    } finally {
      setCargando(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      numeroCamadas: 0,
      numeroEnvases: 0,
      numeroGruesas: 0,
    });
    setError("");
  };

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Registrar Nuevo Molde</h3>

      <section className={styles.formData}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos del Molde</legend>

          <div className={styles.inputWrapper}>
            <label htmlFor="nombre">
              Nombre del Molde <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
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
              rows={6}
              required
            />
          </div>

          <div className={styles.numbers}>
            <div className={styles.inputWrapper}>
              <label htmlFor="numeroCamadas">
                Número de Camadas{" "}
                <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                id="numeroCamadas"
                name="numeroCamadas"
                type="number"
                min="1"
                value={formData.numeroCamadas || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="numeroEnvases">
                Número de Envases{" "}
                <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                id="numeroEnvases"
                name="numeroEnvases"
                type="number"
                min="1"
                value={formData.numeroEnvases || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="numeroGruesas">
                Número de Gruesas{" "}
                <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                id="numeroGruesas"
                name="numeroGruesas"
                type="text"
                value={formData.numeroGruesas || ""}
                readOnly
                className={styles.readonlyInput}
              />
            </div>
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
