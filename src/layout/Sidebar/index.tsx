import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";

export const Sidebar = () => {
  return (
    <nav className={styles.sidebar} id="sidebar">
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/consumo-pintura">Consumo de Pintura</Link>
        </li>
        <li>
          <Link to="/gestion-usuarios">Gestión de Usuarios</Link>
        </li>
      </ul>
    </nav>
  );
};
