// src/modules/Unauthorized/index.tsx
import { Link } from "react-router-dom";

export const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>🚫 Acceso Denegado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <Link to="/">Volver a Inicio</Link>
    </div>
  );
};
