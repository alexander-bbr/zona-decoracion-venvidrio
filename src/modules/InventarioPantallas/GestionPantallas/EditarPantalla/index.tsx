import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderForm } from "../../../../components/HeaderForm";
import styles from "./editar-pantalla.module.css";

type Pantalla = {
  idPantalla: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: boolean;
};

type FormData = {
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: boolean;
};

const API_PANTALLAS = "http://127.0.0.1:8000/api/inventario-pantallas";

export const EditarPantalla = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p className={styles.error}>ID de pantalla inválido.</p>;
  }

  return <CargarPantalla idPantalla={id} />;
};

const CargarPantalla = ({ idPantalla }: { idPantalla: string }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    tipo: "",
    estado: true,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarPantalla = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(`${API_PANTALLAS}/${idPantalla}`);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.detail ??
              (response.status === 404
                ? "La pantalla especificada no existe."
                : `Error al cargar pantalla: ${response.status}`),
          );
        }
        const pantalla = (await response.json()) as Pantalla;
        setFormData({
          nombre: pantalla.nombre,
          descripcion: pantalla.descripcion,
          tipo: pantalla.tipo,
          estado: pantalla.estado,
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar pantalla.",
        );
      } finally {
        setCargando(false);
      }
    };
    void cargarPantalla();
  }, [idPantalla]);

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
    setGuardando(true);

    // Validaciones
    if (!formData.nombre.trim()) {
      setError("El nombre de la pantalla es obligatorio.");
      setGuardando(false);
      return;
    }
    if (!formData.descripcion.trim()) {
      setError("La descripción es obligatoria.");
      setGuardando(false);
      return;
    }
    if (!formData.tipo.trim()) {
      setError("El tipo es obligatorio.");
      setGuardando(false);
      return;
    }

    try {
      const response = await fetch(`${API_PANTALLAS}/${idPantalla}`, {
        method: "PUT",
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
          data?.detail ?? `Error al actualizar pantalla: ${response.status}`,
        );
      }

      alert("¡Pantalla editada exitosamente!");
      navigate("/inventario-pantallas/gestion-pantallas");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al actualizar pantalla.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch(`${API_PANTALLAS}/${idPantalla}`);
      if (response.ok) {
        const pantalla = (await response.json()) as Pantalla;
        setFormData({
          nombre: pantalla.nombre,
          descripcion: pantalla.descripcion,
          tipo: pantalla.tipo,
          estado: pantalla.estado,
        });
      }
    } catch {
      // Ignorar errores en reset
    }
    setError("");
  };

  if (cargando) {
    return <p className={styles.loading}>Cargando pantalla...</p>;
  }

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Editar Pantalla #{idPantalla}</h3>

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
