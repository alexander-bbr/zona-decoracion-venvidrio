import React, { useEffect, useState, type ChangeEvent } from "react";
import styles from "./registrar-produccion-lisa.module.css";
import { HeaderForm } from "../../../components/HeaderForm";

type camposFormulario = {
  fechaRegistro: string;
  modelo: string;
  nuevoModelo: string;
  cantidad: number;
};

type modelos = {
  id_inventariopl: number;
  modelo: string;
  cantidad_actual: number;
};

type ApiResponse = {
  data: modelos[];
};

export const RegistrarProduccionLisa = () => {
  /* === VARIABLES DE ESTADO === */
  const [mostrarNuevoModelo, setMostrarNuevoModelo] = useState(false);
  const [modelos, setModelos] = useState<modelos[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cantidadActualModelo, setCantidadActualModelo] = useState<
    number | null
  >(null);

  const [formData, setFormData] = useState<camposFormulario>({
    fechaRegistro: "",
    modelo: "",
    nuevoModelo: "",
    cantidad: 0,
  });

  const [enviado, setEnviado] = useState(false);
  const [mensajeError, setMensajeError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* === LÓGICA === */

  // Almacenar los datos de los campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cantidad" ? Number(value) : value,
    }));
  };

  // Resetear los campos
  const handleReset = () => {
    setFormData({
      fechaRegistro: "",
      modelo: "",
      nuevoModelo: "",
      cantidad: 0,
    });
    setMostrarNuevoModelo(false);
    setCantidadActualModelo(null);
    setMensajeError("");
  };

  // Buscar los modelos de envase existentes para listarlos en el formulario
  useEffect(() => {
    const fetchModelos = async () => {
      setCargando(true);
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/produccion-lisa/inventario",
        );

        if (!response.ok) {
          throw new Error("Código de Error -> " + response.status);
        }

        const data: ApiResponse = await response.json();
        setModelos(data.data);
      } catch (error) {
        console.error("Error al cargar modelos:", error);
        setMensajeError("Error al cargar los modelos disponibles");
      } finally {
        setCargando(false);
      }
    };

    fetchModelos();
  }, []);

  // Enviar el Formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError("");

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Validar que se haya seleccionado un modelo o ingresado uno nuevo
      if (!formData.modelo && !formData.nuevoModelo) {
        setMensajeError("Debe seleccionar un modelo o ingresar uno nuevo");
        setIsSubmitting(false);
        return;
      }

      // Validar cantidad
      if (formData.cantidad <= 0) {
        setMensajeError("La cantidad debe ser mayor a 0");
        setIsSubmitting(false);
        return;
      }

      // Preparar datos para enviar
      let idInventarioPL = null;
      let nuevoModelo = null;

      if (mostrarNuevoModelo && formData.nuevoModelo) {
        nuevoModelo = formData.nuevoModelo;
      } else if (formData.modelo) {
        const modeloSeleccionado = modelos.find(
          (m) => m.modelo === formData.modelo,
        );
        if (modeloSeleccionado) {
          idInventarioPL = modeloSeleccionado.id_inventariopl;
        } else {
          setMensajeError("El modelo seleccionado no es válido");
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        fecha_registro: formData.fechaRegistro,
        id_inventariopl: idInventarioPL,
        cantidad_registrada: formData.cantidad,
        nuevo_modelo: nuevoModelo,
      };

      console.log("Enviando datos:", payload);

      const response = await fetch(
        "http://127.0.0.1:8000/api/produccion-lisa/registro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || `Error ${response.status}: ${response.statusText}`,
        );
      }

      console.log("Respuesta del servidor:", data);

      setEnviado(true);
      setTimeout(() => {
        setEnviado(false);
      }, 3000);

      setTimeout(() => {
        handleReset();
      }, 3000);
    } catch (error) {
      console.error("Error en el envío:", error);
      setMensajeError(
        error instanceof Error ? error.message : "Error al enviar el registro",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar el campo Nuevo Modelo solo si fue seleccionado la opción de Nuevo Modelo
  const handleNuevoModelo = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "Nuevo Modelo") {
      setMostrarNuevoModelo(true);
      setCantidadActualModelo(null);
      setFormData((prev) => ({
        ...prev,
        modelo: "",
        nuevoModelo: "",
      }));
    } else {
      setMostrarNuevoModelo(false);

      // Buscar la cantidad actual del modelo seleccionado
      const modeloSeleccionado = modelos.find((m) => m.modelo === value);
      setCantidadActualModelo(modeloSeleccionado?.cantidad_actual || null);

      setFormData((prev) => ({
        ...prev,
        modelo: value,
        nuevoModelo: "",
      }));
    }
  };

  /* === RENDERIZADO === */
  return (
    <>
      {/* Notificación de Envío */}
      {enviado && (
        <div className={styles.successMessage}>
          ¡Control registrado con éxito!
        </div>
      )}

      {/* Mensaje de Error */}
      {mensajeError && (
        <div className={styles.errorMessage}>{mensajeError}</div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <HeaderForm />

        {/* === CAMPOS === */}
        <section className={styles.dataWrapper}>
          {/* Fecha de Registro */}
          <div className={styles.inputWrapper}>
            <label htmlFor="fechaRegistro" className={styles.label}>
              Fecha de Registro <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="date"
              id="fechaRegistro"
              name="fechaRegistro"
              value={formData.fechaRegistro}
              onChange={handleChange}
              required
            />
          </div>

          {/* Modelo y Cantidad Actual */}
          <div className={styles.modeloWrapper}>
            <div className={styles.inputWrapper}>
              <label htmlFor="modelo" className={styles.label}>
                Modelo{" "}
                {!mostrarNuevoModelo && (
                  <span className={styles.requireSymbol}>*</span>
                )}
              </label>
              <select
                name="modelo"
                id="modelo"
                className={styles.select}
                onChange={handleNuevoModelo}
                value={formData.modelo}
                disabled={mostrarNuevoModelo}
              >
                <option value="">Seleccione un modelo...</option>
                {cargando ? (
                  <option value="" disabled>
                    Cargando modelos...
                  </option>
                ) : (
                  modelos.map((modelo) => (
                    <option key={modelo.id_inventariopl} value={modelo.modelo}>
                      {modelo.modelo}
                    </option>
                  ))
                )}
                <option value="Nuevo Modelo">+ Nuevo Modelo</option>
              </select>
            </div>

            {/* Mostrar cantidad actual del modelo seleccionado */}
            {!mostrarNuevoModelo && cantidadActualModelo !== null && (
              <div
                className={`${styles.inputWrapper} ${styles.cantidadActualWrapper}`}
              >
                <label className={styles.label}>Stock Actual</label>
                <div className={styles.cantidadActualDisplay}>
                  {cantidadActualModelo.toLocaleString()} unidades
                </div>
              </div>
            )}
          </div>

          {/* Nuevo Modelo */}
          {mostrarNuevoModelo && (
            <div className={styles.inputWrapper}>
              <label htmlFor="nuevoModelo" className={styles.label}>
                Nuevo Modelo <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                name="nuevoModelo"
                id="nuevoModelo"
                className={styles.input}
                onChange={handleChange}
                value={formData.nuevoModelo}
                placeholder="Ingrese el nombre del nuevo modelo"
                required={mostrarNuevoModelo}
              />
            </div>
          )}

          {/* Cantidad a Registrar */}
          <div className={styles.inputWrapper}>
            <label htmlFor="cantidad" className={styles.label}>
              Cantidad a Registrar{" "}
              <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="number"
              id="cantidad"
              name="cantidad"
              value={formData.cantidad || ""}
              onChange={handleChange}
              min="1"
              step="1"
              required
              placeholder="Ingrese la cantidad a registrar"
            />
          </div>
        </section>

        {/* === BOTONES === */}
        <div className={styles.buttonWrapper}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
            disabled={isSubmitting}
          >
            Resetear
          </button>
        </div>
      </form>
    </>
  );
};
