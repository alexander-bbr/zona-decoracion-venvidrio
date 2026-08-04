import React, { useState } from "react";
import styles from "./registrar-produccion-lisa.module.css";
import headerLogo from "../../../assets/images/logo-segun-controles.png";

type registrarProduccionLisaProps = {
  fechaRegistro: string;
  modelo: string;
  nuevoModelo: string;
  cantidad: number;
};

export const RegistrarProduccionLisa = () => {
  const [formData, setFormData] = useState<registrarProduccionLisaProps>({
    fechaRegistro: "",
    modelo: "",
    nuevoModelo: "",
    cantidad: 0,
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
      modelo: "",
      nuevoModelo: "",
      cantidad: 0,
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

          {/* Cantidad */}
          <div className={styles.inputWrapper}>
            <label htmlFor="cantidadRegistrada" className={styles.label}>
              Cantidad <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              className={styles.input}
              type="number"
              id="cantidadRegistrada"
              name="cantidadRegistrada"
              value={formData.cantidad}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* === BOTONES === */}
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
