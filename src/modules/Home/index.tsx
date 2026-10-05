import { useAuth } from "../../contexts/AuthContext";
import styles from "./home.module.css";

export const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="container">
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Zona de Decoración</h2>
        <p className={styles.moduleSubtitle}>
          Aplicación Administrativa para la Zona de Decoración en Venezolana del
          Vidrio C.A (Venvidrio)
        </p>
      </header>

      {isAuthenticated ? (
        <div className={`${styles.home} content`}>
          <h3>
            ¡Bienvenido {user?.nombres} {user?.apellidos}!
          </h3>

          <p className={styles.userRol}>{user?.rol}</p>

          <div className={styles.notificationWrapper}>
            <p className={styles.successMessage}>
              Has iniciado sesión correctamente.
            </p>
          </div>

          <p className={styles.homeDescription}>
            Puedes acceder a los módulos de la aplicación desde el menú lateral.
          </p>
        </div>
      ) : (
        <div className={`${styles.home} content`}>
          <h3>¡Bienvenido!</h3>

          <p className={styles.homeDescription}>
            Por favor, inicia sesión para acceder a nuestra aplicación.
          </p>
          <a href="/sign-in">Iniciar Sesión</a>
        </div>
      )}
    </section>
  );
};
