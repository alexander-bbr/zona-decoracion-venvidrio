// ConsumirProduccionLisa.tsx
import React, { useEffect, useState, type ChangeEvent } from "react";
import styles from "./consumir-produccion-lisa.module.css";
import headerLogo from "../../../assets/images/logo-segun-controles.png";

type camposFormulario = {
  fechaSalida: string;
  modelo: string;
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

export const ConsumirProduccionLisa = () => {
  /* === VARIABLES DE ESTADO === */
  const [modelos, setModelos] = useState<modelos[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cantidadActualModelo, setCantidadActualModelo] = useState<
    number | null
  >(null);
  const [modeloSeleccionadoId, setModeloSeleccionadoId] = useState<
    number | null
  >(null);

  const [formData, setFormData] = useState<camposFormulario>({
    fechaSalida: "",
    modelo: "",
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
      fechaSalida: "",
      modelo: "",
      cantidad: 0,
    });
    setCantidadActualModelo(null);
    setModeloSeleccionadoId(null);
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
      // Validar que se haya seleccionado un modelo
      if (!formData.modelo) {
        setMensajeError("Debe seleccionar un modelo");
        setIsSubmitting(false);
        return;
      }

      // Validar cantidad
      if (formData.cantidad <= 0) {
        setMensajeError("La cantidad debe ser mayor a 0");
        setIsSubmitting(false);
        return;
      }

      // Validar que no se quiera sacar más de lo que hay en stock
      if (
        cantidadActualModelo !== null &&
        formData.cantidad > cantidadActualModelo
      ) {
        setMensajeError(
          `Stock insuficiente. Disponible: ${cantidadActualModelo.toLocaleString()} unidades`,
        );
        setIsSubmitting(false);
        return;
      }

      // Preparar datos para enviar
      if (!modeloSeleccionadoId) {
        setMensajeError("El modelo seleccionado no es válido");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        fecha_salida: formData.fechaSalida,
        id_inventariopl: modeloSeleccionadoId,
        cantidad_sacada: formData.cantidad,
      };

      console.log("Enviando datos de salida:", payload);

      const response = await fetch(
        "http://127.0.0.1:8000/api/produccion-lisa/salida",
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

      // Mostrar mensaje de éxito
      setEnviado(true);
      setTimeout(() => {
        setEnviado(false);
      }, 3000);

      // Resetear formulario después del envío exitoso
      setTimeout(() => {
        handleReset();
        // Recargar los modelos para actualizar el stock
        fetchModelos();
      }, 3000);
    } catch (error) {
      console.error("Error en el envío:", error);

      // Manejar específicamente el error de stock insuficiente
      if (
        error instanceof Error &&
        error.message.includes("Stock insuficiente")
      ) {
        setMensajeError(error.message);
      } else {
        setMensajeError(
          error instanceof Error
            ? error.message
            : "Error al registrar la salida",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para recargar los modelos (usada después de una salida exitosa)
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

      // Si hay un modelo seleccionado, actualizar su cantidad actual
      if (formData.modelo) {
        const modeloActualizado = data.data.find(
          (m) => m.modelo === formData.modelo,
        );
        if (modeloActualizado) {
          setCantidadActualModelo(modeloActualizado.cantidad_actual);
          setModeloSeleccionadoId(modeloActualizado.id_inventariopl);
        }
      }
    } catch (error) {
      console.error("Error al cargar modelos:", error);
    } finally {
      setCargando(false);
    }
  };

  // Manejar selección de modelo
  const handleModeloChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    // Buscar la cantidad actual del modelo seleccionado
    const modeloSeleccionado = modelos.find((m) => m.modelo === value);

    if (modeloSeleccionado) {
      setCantidadActualModelo(modeloSeleccionado.cantidad_actual);
      setModeloSeleccionadoId(modeloSeleccionado.id_inventariopl);
    } else {
      setCantidadActualModelo(null);
      setModeloSeleccionadoId(null);
    }

    setFormData((prev) => ({
      ...prev,
      modelo: value,
    }));
  };

  /* === RENDERIZADO === */
  return (
    <>
      {/* Notificación de Éxito */}
      {enviado && (
        <div className={styles.successMessage}>
          ¡Salida de producción registrada con éxito!
        </div>
      )}

      {/* Mensaje de Error */}
      {mensajeError && (
        <div className={styles.errorMessage}>{mensajeError}</div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <header className={styles.headerForm}>
          <div className={styles.logoWrapper}>
            <img
              src={headerLogo}
              alt="Logo de Venvidrio"
              className={styles.headerLogo}
            />
          </div>
          <h2 className={styles.headerTitle}>
            GERENCIA DE ZONA FRÍA Y PROCESOS FINALES INTENDENCIA DE PROCESOS
            FINALES - SALIDA DE PRODUCCIÓN
          </h2>
          <div className={styles.codeWrapper}>
            <p className={styles.headerCode}>Sin Código</p>
          </div>
        </header>

        {/* === CAMPOS === */}
        <section className={styles.dataWrapper}>
          {/* Fecha de Salida */}
          <div className={styles.inputWrapper}>
            <label htmlFor="fechaSalida" className={styles.label}>
              Fecha de Salida <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="date"
              id="fechaSalida"
              name="fechaSalida"
              value={formData.fechaSalida}
              onChange={handleChange}
              required
            />
          </div>

          {/* Modelo y Cantidad Actual */}
          <div className={styles.modeloWrapper}>
            <div className={styles.inputWrapper}>
              <label htmlFor="modelo" className={styles.label}>
                Modelo <span className={styles.requireSymbol}>*</span>
              </label>
              <select
                name="modelo"
                id="modelo"
                className={styles.select}
                onChange={handleModeloChange}
                value={formData.modelo}
                disabled={cargando}
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
              </select>
            </div>

            {/* Mostrar cantidad actual del modelo seleccionado */}
            {cantidadActualModelo !== null && (
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

          {/* Cantidad a Sacar */}
          <div className={styles.inputWrapper}>
            <label htmlFor="cantidad" className={styles.label}>
              Cantidad a Sacar <span className={styles.requireSymbol}>*</span>
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
              placeholder="Ingrese la cantidad a sacar"
              disabled={!modeloSeleccionadoId}
            />
            {cantidadActualModelo !== null && (
              <div className={styles.stockHint}>
                Stock disponible: {cantidadActualModelo.toLocaleString()}{" "}
                unidades
              </div>
            )}
          </div>
        </section>

        {/* === BOTONES === */}
        <div className={styles.buttonWrapper}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSubmitting || !modeloSeleccionadoId}
          >
            {isSubmitting ? "Registrando salida..." : "Registrar Salida"}
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
