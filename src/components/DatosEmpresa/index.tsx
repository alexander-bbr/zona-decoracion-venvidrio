import styles from "./DatosEmpresa.module.css";
import imagotipo from "../../assets/images/imagotipo.png";

export const DatosEmpresa = () => {
  return (
    <div className={styles.companyNameData}>
      <img
        className={styles.companyImagotype}
        src={imagotipo}
        alt="Imagotipo de Venezolana del Vidrio C.A."
      />
      <p className={styles.companyName}>Venezolana del Vidrio, C.A.</p>
      <p className={styles.rif}>RIF: G-20009820-1</p>
    </div>
  );
};
