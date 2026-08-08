import styles from "./SignIn.module.css";
import logo from "../../assets/images/logo-segun-controles.png";

export const SignIn = () => {
  return (
    <section className={styles.signIn}>
      {/* === ENCABEZADO === */}
      <header className={styles.signInHeader}>
        <img
          className={styles.signInHeaderLogo}
          src={logo}
          alt="Logo de Venvidrio"
        />
        <div className={styles.headerInfoWrapper}>
          <h2 className={styles.nameCompany}>Venezolana del Vidrio, C.A</h2>
          <p className={styles.rifComany}>J-090345234</p>
        </div>
      </header>

      <h2 className={styles.signInTitle}>Iniciar Sesión</h2>

      {/* === FORMULARIO === */}
      <form className={styles.signInForm}>
        <div className={styles.signInInputWrapper}>
          <label className={styles.signInLabel} htmlFor="carnet">
            Nro. Carnet
          </label>
          <div className={styles.signInInput}>
            <input type="text" id="carnet" name="carnet" />
          </div>
        </div>

        <div className={styles.signInInputWrapper}>
          <label className={styles.signInLabel} htmlFor="password">
            Contraseña
          </label>
          <div className={styles.signInInput}>
            <input type="password" id="password" name="password" />
          </div>
        </div>

        <button type="submit" className={styles.signInButton}>
          Iniciar Sesión
        </button>
      </form>

      <footer className={styles.signInFooter}>
        <p>Sistema de uso exclusivo para personal autorizado de</p>
        <p>Venezolana del Vidrio C.A</p>
        <p>© Todos los derechos reservados.</p>
      </footer>
    </section>
  );
};
