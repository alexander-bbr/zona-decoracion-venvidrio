import styles from "./Header.module.css";
import isotipo from "../../assets/images/favicon.png";
import { DatosEmpresa } from "../../components/DatosEmpresa";

export const Header = () => {
  return (
    <header className={styles.header} id="header">
      <div className={styles.softwareData}>
        <img
          className={styles.isotipo}
          src={isotipo}
          alt="Logo del Software de Zona de Decoración"
        />
        <div className={styles.softwareNameWrapper}>
          <h1 className={styles.softwareName}>Zona de Decoración</h1>
          <p className={styles.softwareDescription}>
            Aplicación de Gestión Administrativa
          </p>
        </div>
      </div>
      <DatosEmpresa></DatosEmpresa>
    </header>
  );
};
