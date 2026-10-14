import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../../../../components/HeaderForm";
import styles from "./crear-pantalla.module.css";

type FormData = {
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: boolean;
};

const API_PANTALLAS = "http://127.0.0.1:8000/api/inventario-pantallas";

export const CrearPantalla = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    tipo: "",
    estado: true,
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    // Validaciones
    if (!formData.nombre.trim()) {
      setError("El nombre de la pantalla es obligatorio.");
      setCargando(false);
      return;
    }
    if (!formData.descripcion.trim()) {
      setError("La descripción es obligatoria.");
      setCargando(false);
      return;
    }
    if (!formData.tipo.trim()) {
      setError("El tipo es obligatorio.");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(API_PANTALLAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          tipo: formData.tipo,
          estado: formData.estado,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al crear pantalla: ${response.status}`,
        );
      }

      alert("¡Pantalla creada exitosamente!");
      navigate("/inventario-pantallas/gestion-pantallas");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al crear la pantalla.",
      );
    } finally {
      setCargando(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      tipo: "",
      estado: true,
    });
    setError("");
  };

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Crear Nueva Pantalla</h3>

      <section className={styles.formData}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos de la Pantalla</legend>

          <div className={styles.row}>
            <div className={styles.inputWrapper}>
              <label htmlFor="tipo">
                Tipo <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                id="tipo"
                name="tipo"
                type="text"
                value={formData.tipo}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="nombre">
                Nombre <span className={styles.requireSymbol}>*</span>
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
              rows={3}
              required
            />
          </div>

          <div className={styles.checkboxWrapper}>
            <input
              id="estado"
              name="estado"
              type="checkbox"
              checked={formData.estado}
              onChange={handleChange}
            />
            <label htmlFor="estado">Pantalla Activa</label>
          </div>
        </fieldset>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonWrapper}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={cargando}
          >
            {cargando ? "Creando..." : "Guardar"}
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
