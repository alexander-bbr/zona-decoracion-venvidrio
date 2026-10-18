import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import { ENVASES_POR_GRUESA } from "../../../../constants";
import styles from "./editar-molde.module.css";

type Molde = {
  item: string;
  nombre: string;
  descripcion: string | null;
  numeroCamadas: number;
  numeroEnvases: number;
  numeroGruesas: number;
  estado: boolean;
};

type FormData = {
  item: string;
  nombre: string;
  descripcion: string;
  numeroCamadas: number;
  numeroEnvases: number;
  numeroGruesas: number;
  estado: boolean;
};

const API_MOLDES = "http://127.0.0.1:8000/api/gestion-moldes";

export const EditarMolde = () => {
  const { item } = useParams<{ item: string }>();

  if (!item) {
    return <p className={styles.error}>Item de molde inválido.</p>;
  }

  return <CargarMolde itemMolde={item} />;
};

const CargarMolde = ({ itemMolde }: { itemMolde: string }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    item: "",
    nombre: "",
    descripcion: "",
    numeroCamadas: 0,
    numeroEnvases: 0,
    numeroGruesas: 0,
    estado: true,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  // Guardamos el item original para saber si el usuario lo cambió
  const [itemOriginal, setItemOriginal] = useState("");

  useEffect(() => {
    const cargarMolde = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await fetch(
          `${API_MOLDES}/${encodeURIComponent(itemMolde)}`,
        );
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.detail ??
              (response.status === 404
                ? "El molde especificado no existe."
                : `Error al cargar molde: ${response.status}`),
          );
        }
        const molde = (await response.json()) as Molde;
        setFormData({
          item: molde.item,
          nombre: molde.nombre,
          descripcion: molde.descripcion || "",
          numeroCamadas: Number(molde.numeroCamadas),
          numeroEnvases: Number(molde.numeroEnvases),
          numeroGruesas: Number(
            (Number(molde.numeroEnvases) / ENVASES_POR_GRUESA).toFixed(2),
          ),
          estado: Boolean(molde.estado),
        });
        setItemOriginal(molde.item);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Error al cargar molde.",
        );
      } finally {
        setCargando(false);
      }
    };
    void cargarMolde();
  }, [itemMolde]);

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

  const handleEstadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, estado: e.target.checked }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setGuardando(true);

    // Validaciones
    if (!formData.item.trim()) {
      setError("El item del molde es obligatorio.");
      setGuardando(false);
      return;
    }
    if (!formData.nombre.trim()) {
      setError("El nombre del molde es obligatorio.");
      setGuardando(false);
      return;
    }
    if (formData.numeroCamadas <= 0) {
      setError("El número de camadas debe ser mayor a 0.");
      setGuardando(false);
      return;
    }
    if (formData.numeroEnvases <= 0) {
      setError("El número de envases debe ser mayor a 0.");
      setGuardando(false);
      return;
    }

    // Preparar datos para enviar
    const datosEnviar = {
      item: formData.item.trim(),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      numeroCamadas: formData.numeroCamadas,
      numeroEnvases: formData.numeroEnvases,
      numeroGruesas: formData.numeroEnvases / ENVASES_POR_GRUESA,
      estado: formData.estado,
    };

    try {
      const response = await fetch(
        `${API_MOLDES}/${encodeURIComponent(itemOriginal)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosEnviar),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al actualizar molde: ${response.status}`,
        );
      }

      alert("¡Molde editado exitosamente!");
      navigate("/gestion-moldes");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al actualizar molde.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleReset = () => {
    const cargarMolde = async () => {
      try {
        const response = await fetch(
          `${API_MOLDES}/${encodeURIComponent(itemOriginal)}`,
        );
        if (response.ok) {
          const molde = (await response.json()) as Molde;
          setFormData({
            item: molde.item,
            nombre: molde.nombre,
            descripcion: molde.descripcion || "",
            numeroCamadas: Number(molde.numeroCamadas),
            numeroEnvases: Number(molde.numeroEnvases),
            numeroGruesas: Number(
              (Number(molde.numeroEnvases) / ENVASES_POR_GRUESA).toFixed(2),
            ),
            estado: Boolean(molde.estado),
          });
        }
      } catch {
        // Ignorar errores en reset
      }
    };
    void cargarMolde();
    setError("");
  };

  if (cargando) {
    return <p className={styles.loading}>Cargando molde...</p>;
  }

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Editar Molde {itemOriginal}</h3>

      <section className={styles.formData}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos del Molde</legend>

          <div className={styles.inputWrapper}>
            <label htmlFor="item">
              Item <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="item"
              name="item"
              type="text"
              value={formData.item}
              onChange={handleChange}
              placeholder="Ej: THXI"
              required
            />
          </div>

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
              placeholder="Ej: Molde A"
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
              placeholder="Descripción del molde"
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

          <div className={styles.checkboxWrapper}>
            <input
              id="estado"
              name="estado"
              type="checkbox"
              checked={formData.estado}
              onChange={handleEstadoChange}
            />
            <label htmlFor="estado">Molde Activo</label>
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
