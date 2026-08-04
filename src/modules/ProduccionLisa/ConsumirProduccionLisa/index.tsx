import React, { useState } from "react";
import styles from "./consumir-produccion-lisa.module.css";
import headerLogo from "../../../assets/images/logo-segun-controles.png";

// Tipado para los campos del formulario
type consumirProduccionLisaProps = {
  fechaInicio: string;
  proveedor: string;
  idPinturaInventario: string;
  numeroDeLote: string;
  cantidadConsumida: string;
  unidadDeMedida: string;
  fechaDeFinalizacion: string;
  revisadoPor: string;
  observaciones: string;
};

// Tipado para el estado del mensaje de envío
type MessageState = {
  text: string;
  isSuccess: boolean;
};

export const ConsumirProduccionLisa = () => {
  /* Variables de estado para los campos del formulario */
  const [formData, setFormData] = useState<consumirProduccionLisaProps>({
    fechaInicio: "",
    proveedor: "",
    idPinturaInventario: "",
    numeroDeLote: "",
    cantidadConsumida: "",
    unidadDeMedida: "Litros",
    fechaDeFinalizacion: "",
    revisadoPor: "",
    observaciones: "",
  });

  const [enviado, setEnviado] = useState(false);
  const [message, setMessage] = useState<MessageState>({
    text: "",
    isSuccess: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Almacenar los datos de los campos
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Resetear los campos
  const handleReset = () => {
    setFormData({
      fechaInicio: "",
      proveedor: "",
      idPinturaInventario: "",
      numeroDeLote: "",
      cantidadConsumida: "",
      unidadDeMedida: "Litros",
      fechaDeFinalizacion: "",
      revisadoPor: "",
      observaciones: "",
    });
  };

  // Cerrar la notificación de envío
  const closeModal = () => {
    setEnviado(false);
  };

  // Enviar el Formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/pintura/consumo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.detail || data.mensaje || `Error ${response.status}`;
        setMessage({
          text: errorMsg,
          isSuccess: false,
        });
        setEnviado(true);
        throw new Error(errorMsg);
      }

      setMessage({
        text: data.mensaje || "Consumo realizado con éxito",
        isSuccess: true,
      });

      setEnviado(true);
    } catch (err) {
      console.error("Error en el envío:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Notificación de Envío - Modal */}
      {enviado && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={`${styles.modalContent} ${
              message.isSuccess ? styles.successful : styles.failed
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              onClick={closeModal}
              className={styles.closeButton}
              aria-label="Cerrar modal"
            >
              ×
            </button>

            {/* Ícono según éxito/error */}
            {message.isSuccess ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.1"
                stroke="currentColor"
                width="120"
                height="120"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.1"
                stroke="currentColor"
                width="110"
                height="110"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}

            {/* Mensaje */}
            <p className={styles.modalMessage}>{message.text}</p>
          </div>
        </div>
      )}

      {/* Formulario */}
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
            FINALES
          </h2>
          <div className={styles.codeWrapper}>
            <p className={styles.headerCode}>Sin Código</p>
          </div>
        </header>

        <section className={styles.dataWrapper}>
          {/* Fecha de Inicio */}
          <div className={styles.inputWrapper}>
            <label htmlFor="fechaInicio" className={styles.label}>
              Fecha de Inicio <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              required
            />
          </div>

          {/* Proveedor */}
          <div className={styles.inputWrapper}>
            <label htmlFor="proveedor" className={styles.label}>
              Proveedor <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              id="proveedor"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              required
            />
          </div>

          {/* Color */}
          <div className={styles.inputWrapper}>
            <label htmlFor="idPinturaInventario" className={styles.label}>
              Color <span className={styles.requireSymbol}>*</span>
            </label>
            <select
              className={styles.select}
              id="idPinturaInventario"
              name="idPinturaInventario"
              value={formData.idPinturaInventario}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un color</option>
              <option value="1">Blanco</option>
              <option value="2">Azul</option>
              <option value="3">Rojo</option>
              <option value="4">Amarillo</option>
              <option value="5">Verde</option>
            </select>
          </div>

          {/* Número de Lote */}
          <div className={styles.inputWrapper}>
            <label htmlFor="numeroDeLote" className={styles.label}>
              Número de Lote <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              id="numeroDeLote"
              name="numeroDeLote"
              value={formData.numeroDeLote}
              onChange={handleChange}
              required
            />
          </div>

          {/* Cantidad Recibida */}
          <div className={styles.inputWrapper}>
            <label htmlFor="cantidadConsumida" className={styles.label}>
              Cantidad Recibida <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              id="cantidadConsumida"
              name="cantidadConsumida"
              value={formData.cantidadConsumida}
              onChange={handleChange}
              required
            />
          </div>

          {/* Unidad de Medida */}
          <div className={styles.inputWrapper}>
            <label htmlFor="unidadDeMedida" className={styles.label}>
              Unidad de Medida <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              id="unidadDeMedida"
              name="unidadDeMedida"
              value={formData.unidadDeMedida}
              onChange={handleChange}
              required
              readOnly
            />
          </div>

          {/* Fecha de Finalización */}
          <div className={styles.inputWrapper}>
            <label htmlFor="fechaDeFinalizacion" className={styles.label}>
              Fecha de Finalización{" "}
              <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="date"
              id="fechaDeFinalizacion"
              name="fechaDeFinalizacion"
              value={formData.fechaDeFinalizacion}
              onChange={handleChange}
              required
            />
          </div>

          {/* Revisado por */}
          <div className={styles.inputWrapper}>
            <label htmlFor="revisadoPor" className={styles.label}>
              Revisado Por <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              id="revisadoPor"
              name="revisadoPor"
              value={formData.revisadoPor}
              onChange={handleChange}
              required
            />
          </div>

          {/* Observaciones */}
          <div className={styles.inputWrapper}>
            <label htmlFor="observaciones" className={styles.label}>
              Observaciones (opcional)
            </label>
            <textarea
              className={styles.textarea}
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={8}
              placeholder="Describe cualquier información relevante"
            />
          </div>
        </section>

        <div className={styles.buttonWrapper}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
          >
            Resetear
          </button>
        </div>
      </form>
    </>
  );
};
