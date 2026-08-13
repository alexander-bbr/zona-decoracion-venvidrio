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

  // Comprobar credenciales
  const handleSubmit = async () => {
    // Validar que los campos no estén vacíos
    if (!carnet.trim() || !contrasena.trim()) {
      setError("Por favor complete todos los campos");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(carnet.trim(), contrasena);
      navigate("/");
    } catch (err: any) {
      console.error("Error en el login:", err);
      setError(err.message || "Nro. Carnet o Contraseña incorrecta");
      setLoading(false);
    }
  };

  // Manejar la tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /* === RENDERIZADO === */
  return (
    <section className={`${styles.signIn} content`}>
      <header className={styles.signInHeader}>
        <img
          className={styles.signInHeaderLogo}
          src={logo}
          alt="Logo de Venvidrio"
        />
        <div className={styles.headerInfoWrapper}>
          <h2 className={styles.nameCompany}>Venezolana del Vidrio C.A</h2>
          <p className={styles.rifCompany}>RIF: G-20009820-1</p>
        </div>
      </header>

      <h2 className={styles.signInTitle}>Iniciar Sesión</h2>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* === FORMULARIO == */}
      <form className={styles.signInForm}>
        <div className={styles.signInInputWrapper}>
          <label className={styles.signInLabel} htmlFor="carnet">
            Nro. Carnet
          </label>
          <input
            type="text"
            id="carnet"
            name="carnet"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            onKeyPress={handleKeyPress}
            required
            disabled={loading}
            autoComplete="username"
            placeholder="Ingrese su carnet"
          />
        </div>

        <div className={styles.signInInputWrapper}>
          <label className={styles.signInLabel} htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            onKeyPress={handleKeyPress}
            required
            disabled={loading}
            autoComplete="current-password"
            placeholder="Ingrese su contraseña"
          />
        </div>

        <button
          type="button"
          className={styles.signInButton}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      <footer className={styles.signInFooter}>
        <p>Aplicación de uso exclusivo para personal autorizado</p>
      </footer>
    </section>
  );
};
