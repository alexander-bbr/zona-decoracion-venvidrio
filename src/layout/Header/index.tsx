import logo from "../../assets/images/logo-segun-controles.png";
import styles from "./header.module.css";

export const Header = () => {
  return (
    <header className={styles.header} id="header">
      <img className={styles.logo} src={logo} alt="Logo de Venvidrio" />
      <h1 className={styles.title}>Zona de Decoración</h1>
    </header>
  );
};
