import styles from "./header.module.css";
import isotipo from "../../assets/images/favicon.png";
import { DatosEmpresa } from "../../components/DatosEmpresa";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ isSidebarOpen, onToggleSidebar }: HeaderProps) => {
  return (
    <header className={styles.header} id="header">
      {/* === BOTON HAMBURGUESA === */}
      <button
        type="button"
        className={`${styles.sidebarToggle} ${
          isSidebarOpen ? styles.sidebarToggleOpen : ""
        }`}
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div className={styles.infoWrapper}>
        {/* === DATOS DEL SOFTWARE === */}
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

        {/* === DATOS DEL SOFTWARE === */}
        <DatosEmpresa></DatosEmpresa>
      </div>
    </header>
  );
};
