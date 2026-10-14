import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../../../../components/HeaderForm";
import styles from "./crear-insumo.module.css";

type FormData = {
  tipo: string;
  articulo: string;
  unidad: string;
  cantidadMinima: string;
  estado: boolean;
};

const API_INSUMOS = "http://127.0.0.1:8000/api/inventario-insumos";

export const CrearInsumo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    tipo: "",
    articulo: "",
    unidad: "",
    cantidadMinima: "",
    estado: true,
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
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    // Validaciones
    if (!formData.tipo.trim()) {
      setError("El tipo de insumo es obligatorio.");
      setCargando(false);
      return;
    }
    if (!formData.articulo.trim()) {
      setError("El artículo es obligatorio.");
      setCargando(false);
      return;
    }
    if (!formData.unidad.trim()) {
      setError("La unidad es obligatoria.");
      setCargando(false);
      return;
    }
    if (!formData.cantidadMinima || Number(formData.cantidadMinima) < 0) {
      setError("La cantidad mínima no puede ser negativa.");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(API_INSUMOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: formData.tipo,
          articulo: formData.articulo,
          unidad: formData.unidad,
          cantidadMinima: Number(formData.cantidadMinima),
          estado: formData.estado,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al crear insumo: ${response.status}`,
        );
      }

      alert("¡Insumo creado exitosamente!");
      navigate("/inventario-insumos/gestion-insumos");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al crear el insumo.",
      );
    } finally {
      setCargando(false);
    }
  };

  const handleReset = () => {
    setFormData({
      tipo: "",
      articulo: "",
      unidad: "",
      cantidadMinima: "",
      estado: true,
    });
    setError("");
  };

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Crear Nuevo Insumo</h3>

      <section className={styles.formData}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos del Insumo</legend>

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
              <label htmlFor="unidad">
                Unidad <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                id="unidad"
                name="unidad"
                type="text"
                value={formData.unidad}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="articulo">
              Artículo <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="articulo"
              name="articulo"
              type="text"
              value={formData.articulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="cantidadMinima">
              Cantidad Mínima <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="cantidadMinima"
              name="cantidadMinima"
              type="number"
              step="0.01"
              min="0"
              value={formData.cantidadMinima}
              onChange={handleChange}
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
            <label htmlFor="estado">Insumo Activo</label>
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
