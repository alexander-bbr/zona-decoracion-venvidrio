import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./SignIn.module.css";
import logo from "../../assets/images/logo-segun-controles.png";

export const SignIn = () => {
  const [carnet, setCarnet] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(carnet, contrasena);
      navigate("/"); // Redirige a Home (público)
    } catch (err: any) {
      console.error("Error en el login:", err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.signIn}>
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

      <form className={styles.signInForm} onSubmit={handleSubmit}>
        <div className={styles.signInInputWrapper}>
          <label className={styles.signInLabel} htmlFor="carnet">
            Nro. Carnet
          </label>
          <div className={styles.signInInput}>
            <input
              type="text"
              id="carnet"
              name="carnet"
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              required
              disabled={loading}
              placeholder="Ingrese su carnet"
              autoComplete="username"
            />
          </div>
        </div>

        <div className={styles.signInInputWrapper}>
          <label className={styles.signInLabel} htmlFor="password">
            Contraseña
          </label>
          <div className={styles.signInInput}>
            <input
              type="password"
              id="password"
              name="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              disabled={loading}
              placeholder="Ingrese su contraseña"
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button
          type="submit"
          className={styles.signInButton}
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
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
