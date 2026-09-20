import { Link } from "react-router-dom";
import styles from "./Unauthorized.module.css";

export const Unauthorized = () => {
  return (
    <div className={`container content`}>
      <section className={styles.unauthorized}>
        <div className={styles.notificationWrapper}>
          <h2 className={styles.errorMessage}>Acceso Denegado</h2>
        </div>

        <p className={styles.unauthorizedDescription}>
          No tienes permiso para acceder a esta página.
        </p>

        <Link to="/">Volver a Inicio</Link>
      </section>
    </div>
  );
};
