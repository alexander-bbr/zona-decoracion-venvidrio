import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderForm } from "../../../../components/HeaderForm";
import styles from "./editar-insumo.module.css";

type Insumo = {
  idInsumo: number;
  tipo: string;
  articulo: string;
  unidad: string;
  cantidadMinima: number;
  estado: boolean;
};

type FormData = {
  tipo: string;
  articulo: string;
  unidad: string;
  cantidadMinima: string;
  estado: boolean;
};

const API_INSUMOS = "http://127.0.0.1:8000/api/inventario-insumos";

export const EditarInsumo = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p className={styles.error}>ID de insumo inválido.</p>;
  }

  return <CargarInsumo idInsumo={id} />;
};

const CargarInsumo = ({ idInsumo }: { idInsumo: string }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    tipo: "",
    articulo: "",
    unidad: "",
    cantidadMinima: "",
    estado: true,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarInsumo = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(`${API_INSUMOS}/${idInsumo}`);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.detail ??
              (response.status === 404
                ? "El Insumo especificado no existe."
                : `Error al cargar insumo: ${response.status}`),
          );
        }
        const insumo = (await response.json()) as Insumo;
        setFormData({
          tipo: insumo.tipo,
          articulo: insumo.articulo,
          unidad: insumo.unidad,
          cantidadMinima: String(insumo.cantidadMinima),
          estado: insumo.estado,
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar insumo.",
        );
      } finally {
        setCargando(false);
      }
    };
    void cargarInsumo();
  }, [idInsumo]);

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
    setGuardando(true);

    // Validaciones
    if (!formData.tipo.trim()) {
      setError("El tipo de insumo es obligatorio.");
      setGuardando(false);
      return;
    }
    if (!formData.articulo.trim()) {
      setError("El artículo es obligatorio.");
      setGuardando(false);
      return;
    }
    if (!formData.unidad.trim()) {
      setError("La unidad es obligatoria.");
      setGuardando(false);
      return;
    }
    if (!formData.cantidadMinima || Number(formData.cantidadMinima) < 0) {
      setError("La cantidad mínima no puede ser negativa.");
      setGuardando(false);
      return;
    }

    try {
      const response = await fetch(`${API_INSUMOS}/${idInsumo}`, {
        method: "PUT",
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
          data?.detail ?? `Error al actualizar insumo: ${response.status}`,
        );
      }

      navigate("/inventario-insumos/gestion-insumos");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al actualizar insumo.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch(`${API_INSUMOS}/${idInsumo}`);
      if (response.ok) {
        const insumo = (await response.json()) as Insumo;
        setFormData({
          tipo: insumo.tipo,
          articulo: insumo.articulo,
          unidad: insumo.unidad,
          cantidadMinima: String(insumo.cantidadMinima),
          estado: insumo.estado,
        });
      }
    } catch {
      // Ignorar errores en reset
    }
    setError("");
  };

  if (cargando) {
    return <p className={styles.loading}>Cargando insumo...</p>;
  }

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Editar Insumo #{idInsumo}</h3>

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
