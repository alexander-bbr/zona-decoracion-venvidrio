import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./gestion-usuarios.module.css";

type Usuario = {
  id_usuario: number;
  cedula: string;
  carnet_usuario: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  rol: string;
  activo_usuario: boolean;
};

type ApiResponse = {
  data: {
    status: string;
    data: Usuario[];
  };
};

const API_USUARIOS = "http://127.0.0.1:8000/api/usuarios";

export const GestionUsuarios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Verificar permisos
  const puedeVerUsuarios = hasPermission("gestion_usuarios", "ver_usuarios");
  const puedeCrearEditar = hasPermission("gestion_usuarios", "crear_editar");

  const cargarUsuarios = async () => {
    setCargando(true);
    setError("");
    try {
      const response = await fetch(API_USUARIOS);
      if (!response.ok) {
        throw new Error(`Error al cargar usuarios: ${response.status}`);
      }
      const responseData: ApiResponse = await response.json();
      const usuariosData = responseData.data.data || [];

      // Ordenar usuarios por ID de forma ascendente
      const usuariosOrdenados = usuariosData.sort(
        (a, b) => a.id_usuario - b.id_usuario,
      );
      setUsuarios(usuariosOrdenados);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Error al cargar usuarios.",
      );
    } finally {
      setCargando(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (puedeVerUsuarios) {
      cargarUsuarios();
    } else {
      setCargando(false);
      setError("No tienes permiso para ver los usuarios");
    }
  }, [puedeVerUsuarios]);

  // Recargar cuando la ruta cambie a la raíz (cuando volvemos de registrar/editar)
  useEffect(() => {
    if (location.pathname === "/gestion-usuarios" && puedeVerUsuarios) {
      cargarUsuarios();
    }
  }, [location.pathname, puedeVerUsuarios]);

  const isRoot = location.pathname === "/gestion-usuarios";

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("registrar-usuario")) return "Registrar Usuario";
    if (path.includes("editar-usuario")) return "Editar Usuario";
    return "";
  };

  const handleRegistrarClick = () => {
    if (!puedeCrearEditar) {
      alert("No tienes permiso para crear usuarios");
      return;
    }
    navigate("registrar-usuario");
  };

  const handleEditarClick = (id: number) => {
    if (!puedeCrearEditar) {
      alert("No tienes permiso para editar usuarios");
      return;
    }
    navigate(`editar-usuario/${id}`);
  };

  return (
    <section className={styles.container}>
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Gestión de Usuarios</h2>
        <p className={styles.moduleSubtitle}>
          Trabajadores registrados en el sistema
        </p>
      </header>

      {!isRoot ? (
        <nav className={`${styles.subNav} content`} id="subNav">
          <NavLink
            to="/gestion-usuarios"
            className={({ isActive }) =>
              isActive
                ? `${styles.subNavLink} ${styles.active}`
                : styles.subNavLink
            }
          >
            ← Volver
          </NavLink>
          <span className={styles.subNavTitle}>{getTitle()}</span>
        </nav>
      ) : null}

      {isRoot ? (
        <section className={`${styles.gestionUsuarios} content`}>
          <section className={styles.controlPanel}>
            <h2 className={styles.title}>
              Listado de Usuarios ({usuarios.length})
            </h2>
            {puedeCrearEditar && (
              <button
                className={styles.registerButton}
                onClick={handleRegistrarClick}
              >
                + Registrar Usuario
              </button>
            )}
          </section>

          {cargando && <p className={styles.loading}>Cargando usuarios...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!cargando && !error && (
            <div className={styles.tableContainer}>
              {usuarios.length === 0 ? (
                <p className={styles.emptyMessage}>
                  No hay usuarios registrados.
                </p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Cédula</th>
                      <th>Carnet</th>
                      <th>Nombres</th>
                      <th>Apellidos</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr
                        key={usuario.id_usuario}
                        onClick={() =>
                          puedeCrearEditar
                            ? handleEditarClick(usuario.id_usuario)
                            : null
                        }
                        className={`${styles.clickableRow} ${
                          puedeCrearEditar
                            ? styles.rowEditable
                            : styles.rowReadOnly
                        }`}
                        style={{
                          cursor: puedeCrearEditar ? "pointer" : "default",
                          opacity: puedeCrearEditar ? 1 : 0.8,
                        }}
                      >
                        <td>{usuario.cedula}</td>
                        <td>{usuario.carnet_usuario}</td>
                        <td>{usuario.nombres}</td>
                        <td>{usuario.apellidos}</td>
                        <td>{usuario.telefono || "—"}</td>
                        <td>{usuario.correo}</td>
                        <td>
                          <span className={styles.rolBadge}>{usuario.rol}</span>
                        </td>
                        <td>
                          <span
                            className={
                              usuario.activo_usuario
                                ? styles.estadoActivo
                                : styles.estadoInactivo
                            }
                          >
                            {usuario.activo_usuario ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      ) : (
        <Outlet />
      )}
    </section>
  );
};
