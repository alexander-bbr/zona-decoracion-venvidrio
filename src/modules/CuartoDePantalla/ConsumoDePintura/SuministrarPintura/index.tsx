import React, { useState } from "react";
import styles from "./suministrar-pintura.module.css";
import headerLogo from "../../../../assets/images/logo-segun-controles.png";

type registroDePinturaProps = {
  fechaRegistro: string;
  proveedor: string;
  idPinturaInventario: string;
  unidadDeMedida: string;
  cantidadRegistrada: string;
  registradoPor: string;
  observaciones: string;
};

export const SuministrarPintura: React.FC = () => {
  const [formData, setFormData] = useState<registroDePinturaProps>({
    fechaRegistro: "",
    proveedor: "",
    idPinturaInventario: "",
    unidadDeMedida: "Litros",
    cantidadRegistrada: "",
    registradoPor: "",
    observaciones: "",
  });

  const [enviado, setEnviado] = useState(false);
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
      fechaRegistro: "",
      proveedor: "",
      idPinturaInventario: "",
      unidadDeMedida: "Litros",
      cantidadRegistrada: "",
      registradoPor: "",
      observaciones: "",
    });
  };

  // Enviar el Formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; //* Previene que el usuario haga doble click
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/pintura/registro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.mensaje ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();

      console.log("Respuesta del servidor:", data);

      // Mostrar mensaje de éxito
      setEnviado(true);
      setInterval(() => {
        setEnviado(false);
      }, 3000);

      // Resetear formulario después del envío exitoso
      setTimeout(() => {
        handleReset();
      }, 3000);

      /*  */
    } catch (err) {
      console.error("Error en el envío:", err);

      /*  */
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Notificación de Envío */}
      {enviado && (
        <div className={styles.successMessage}>
          ¡Control registrado con éxito!
        </div>
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
            FINALES
          </h2>
          <div className={styles.codeWrapper}>
            <p className={styles.headerCode}>Sin Código</p>
          </div>
        </header>

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

          {/* Unidad de Medida */}
          <div className={styles.inputWrapper}>
            <label htmlFor="unidadDeMedida" className={styles.label}>
              Unidad de Medida <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              id="unidadDeMedida"
              name="unidadDeMedida"
              value={formData.unidadDeMedida}
              onChange={handleChange}
              required
              readOnly
            />
          </div>

          {/* Cantidad */}
          <div className={styles.inputWrapper}>
            <label htmlFor="cantidadRegistrada" className={styles.label}>
              Cantidad <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              id="cantidadRegistrada"
              name="cantidadRegistrada"
              value={formData.cantidadRegistrada}
              onChange={handleChange}
              required
            />
          </div>

          {/* Registrado Por */}
          <div className={styles.inputWrapper}>
            <label htmlFor="registradoPor" className={styles.label}>
              Registrado Por <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              id="registradoPor"
              name="registradoPor"
              value={formData.registradoPor}
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
          <button type="submit" className={styles.saveButton}>
            Guardar
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
