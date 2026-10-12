import styles from "./header-form.module.css";
import imagotipo from "../../assets/images/imagotipo.png";

export const HeaderForm = () => {
  return (
    <header className={styles.headerForm}>
      <div className={styles.logoWrapper}>
        <img
          src={imagotipo}
          alt="Logo de Venvidrio"
          className={styles.headerLogo}
        />
      </div>
      <h2 className={styles.headerTitle}>
        GERENCIA DE ZONA FRÍA Y PROCESOS FINALES
      </h2>
      <div className={styles.rifWrapper}>
        <h3>RIF:</h3>
        <p>G-20009820-1</p>
      </div>
    </header>
  );
};
