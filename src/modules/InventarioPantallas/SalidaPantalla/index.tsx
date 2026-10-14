import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import styles from "./salida-pantalla.module.css";

type Pantalla = {
  idPantalla: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  cantidad: number;
};

type FormData = {
  idPantalla: string;
  encargado: string;
  turno: string;
  grupo: string;
  cantidad: string;
};

const API_PANTALLAS = "http://127.0.0.1:8000/api/inventario-pantallas";
const API_SALIDAS = "http://127.0.0.1:8000/api/inventario-pantallas/salidas";

const TURNOS = ["Turno 1", "Turno 2", "Turno 3"];
const GRUPOS = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"];

export const SalidaPantalla = () => {
  const navigate = useNavigate();

  const [pantallas, setPantallas] = useState<Pantalla[]>([]);
  const [cargandoPantallas, setCargandoPantallas] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    idPantalla: "",
    encargado: "",
    turno: "",
    grupo: "",
    cantidad: "",
  });

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Cargar las pantallas disponibles para el select
  useEffect(() => {
    const cargarPantallas = async () => {
      setCargandoPantallas(true);
      try {
        const response = await fetch(API_PANTALLAS);
        if (!response.ok) {
          throw new Error(`Error al cargar pantallas: ${response.status}`);
        }
        const data = (await response.json()) as Pantalla[];
        const ordenados = [...data].sort(
          (a, b) =>
            a.tipo.localeCompare(b.tipo) || a.nombre.localeCompare(b.nombre),
        );
        setPantallas(ordenados);
      } catch {
        setError("No se pudieron cargar las pantallas.");
      } finally {
        setCargandoPantallas(false);
      }
    };
    void cargarPantallas();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Pantalla seleccionada actualmente (para mostrar stock disponible)
  const pantallaSeleccionada = pantallas.find(
    (p) => p.idPantalla === Number(formData.idPantalla),
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    // Validaciones
    if (!formData.idPantalla) {
      setError("Debes seleccionar una pantalla.");
      setCargando(false);
      return;
    }
    if (!formData.encargado.trim()) {
      setError("El encargado es obligatorio.");
      setCargando(false);
      return;
    }
    if (!formData.turno) {
      setError("Debes seleccionar un turno.");
      setCargando(false);
      return;
    }
    if (!formData.grupo) {
      setError("Debes seleccionar un grupo.");
      setCargando(false);
      return;
    }
    if (!formData.cantidad || Number(formData.cantidad) <= 0) {
      setError("La cantidad debe ser mayor a 0.");
      setCargando(false);
      return;
    }
    if (!Number.isInteger(Number(formData.cantidad))) {
      setError("La cantidad debe ser un número entero.");
      setCargando(false);
      return;
    }
    if (
      pantallaSeleccionada &&
      Number(formData.cantidad) > pantallaSeleccionada.cantidad
    ) {
      setError(
        `La cantidad supera el stock disponible (${pantallaSeleccionada.cantidad}).`,
      );
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(API_SALIDAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPantalla: Number(formData.idPantalla),
          encargado: formData.encargado,
          turno: formData.turno,
          grupo: formData.grupo,
          cantidad: Number(formData.cantidad),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.detail ?? `Error al registrar salida: ${response.status}`,
        );
      }

      alert("¡Salida de pantalla registrada exitosamente!");
      navigate("/inventario-pantallas");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al registrar la salida.",
      );
    } finally {
      setCargando(false);
    }
  };

  const handleReset = () => {
    setFormData({
      idPantalla: "",
      encargado: "",
      turno: "",
      grupo: "",
      cantidad: "",
    });
    setError("");
  };

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Registro de Salida de Pantalla</h3>

      <section className={styles.formData}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Datos del Movimiento</legend>

          <div className={styles.inputWrapper}>
            <label htmlFor="idPantalla">
              Pantalla <span className={styles.requireSymbol}>*</span>
            </label>
            <select
              id="idPantalla"
              name="idPantalla"
              value={formData.idPantalla}
              onChange={handleChange}
              disabled={cargandoPantallas}
              required
            >
              <option value="">
                {cargandoPantallas ? "Cargando pantallas..." : "..."}
              </option>
              {pantallas.map((pantalla) => (
                <option key={pantalla.idPantalla} value={pantalla.idPantalla}>
                  ({pantalla.tipo}) - {pantalla.nombre} --&gt;{" "}
                  {pantalla.cantidad}
                </option>
              ))}
            </select>
          </div>

          {pantallaSeleccionada && (
            <p className={styles.stockInfo}>
              Stock disponible: <strong>{pantallaSeleccionada.cantidad}</strong>
            </p>
          )}

          <div className={styles.inputWrapper}>
            <label htmlFor="encargado">
              Encargado <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="encargado"
              name="encargado"
              type="text"
              value={formData.encargado}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputWrapper}>
              <label htmlFor="turno">
                Turno <span className={styles.requireSymbol}>*</span>
              </label>
              <select
                id="turno"
                name="turno"
                value={formData.turno}
                onChange={handleChange}
                required
              >
                <option value="">...</option>
                {TURNOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="grupo">
                Grupo <span className={styles.requireSymbol}>*</span>
              </label>
              <select
                id="grupo"
                name="grupo"
                value={formData.grupo}
                onChange={handleChange}
                required
              >
                <option value="">...</option>
                {GRUPOS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="cantidad">
              Cantidad <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              step="1"
              min="1"
              value={formData.cantidad}
              onChange={handleChange}
              required
            />
          </div>
        </fieldset>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonWrapper}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Guardar"}
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
