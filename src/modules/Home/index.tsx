import { useAuth } from "../../contexts/AuthContext";

export const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <h1>Bienvenido a Venezolana del Vidrio, C.A</h1>

      {isAuthenticated ? (
        <div>
          <p>
            Hola {user?.nombres} {user?.apellidos}
          </p>
          <p>Has iniciado sesión correctamente.</p>
          <p>Rol: {user?.rol}</p>
          <p>Puedes acceder a los módulos desde el menú lateral.</p>
        </div>
      ) : (
        <div>
          <p>Bienvenido al sistema de gestión de Venezolana del Vidrio, C.A</p>
          <p>
            Por favor, inicia sesión para acceder a los módulos del sistema.
          </p>
          <a href="/sign-in">Iniciar Sesión</a>
        </div>
      )}
    </div>
  );
};
