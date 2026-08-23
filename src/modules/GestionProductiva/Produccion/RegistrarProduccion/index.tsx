import styles from "./registrar-produccion.module.css";

export const RegistrarProduccion = () => {
  return (
    <form className={styles.form}>
      <header className={styles.headerForm}>
        <div className={styles.logoWrapper}>
          <img
            src={headerLogo}
            alt="Logo de Venvidrio"
            className={styles.headerLogo}
          />
        </div>
        <h2 className={styles.headerTitle}>
          GERENCIA DE ZONA FRÍA Y PROCESOS FINALES
        </h2>
        <div className={styles.codeWrapper}>
          <p className={styles.headerCode}>Sin Código</p>
        </div>
      </header>
    </form>
  );
};
