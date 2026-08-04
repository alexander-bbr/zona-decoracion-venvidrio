import { useState, useEffect } from "react";
import styles from "./Usuarios.module.css";
import { FormularioUsuario } from "./components/FormularioUsuario";

// Tipos para la permisologia (genérico y flexible)
export type PermisosUsuario = {
  [key: string]: boolean; // Cualquier permiso es posible
};

// Tipos para el usuario
export type Usuario = {
  id: string;
  cedula: string;
  carnet: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  rol: string;
  estado: "Activo" | "Inactivo";
  permisos: PermisosUsuario;
};

// Tipo para la respuesta de la API
type UsuarioAPI = {
  id_usuario: number;
  cedula: string;
  carnet_usuario: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  rol: string;
  activo_usuario: boolean;
  contrasena: string;
  creado_en: string;
};

type ApiResponse = {
  data: {
    status: string;
    data: UsuarioAPI[];
  };
};

export const Usuarios = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Obtener los datos del usuarios
  const obtenerUsuarios = async () => {
    try {
      setCargando(true);
      setError(null);

      const response = await fetch("http://127.0.0.1:8000/api/usuarios");

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const responseData: ApiResponse = await response.json();
      const usuariosData = responseData.data.data;

      // Mapear los datos de la API al formato de nuestra interfaz
      const usuariosMapeados: Usuario[] = usuariosData.map((usuarioAPI) => ({
        id: usuarioAPI.id_usuario.toString(),
        cedula: usuarioAPI.cedula,
        carnet: usuarioAPI.carnet_usuario,
        nombres: usuarioAPI.nombres,
        apellidos: usuarioAPI.apellidos,
        telefono: usuarioAPI.telefono || "",
        correo: usuarioAPI.correo,
        rol: usuarioAPI.rol,
        estado: usuarioAPI.activo_usuario ? "Activo" : "Inactivo",
        permisos: {}, //* Los permisos no se muestran en la tabla
      }));

      setUsuarios(usuariosMapeados);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los usuarios",
      );
      console.error("Error al obtener usuarios:", err);
    } finally {
      setCargando(false);
    }
  };

  // Obtener los usuarios al montar el componente
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Abrir formulario para Crear un Usuario
  const handleCrearUsuario = () => {
    setUsuarioEditando(null);
    setMensajeExito(null);
    setError(null);
    setMostrarFormulario(true);
  };

  // Abrir formulario para Editar un Usuario
  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioEditando(usuario.id);
    setMensajeExito(null);
    setError(null);
    setMostrarFormulario(true);
  };

  // Guardar Usuario (Crear o Actualizar)
  const handleGuardarUsuario = async (usuarioData: any) => {
    try {
      setCargando(true);
      setError(null);
      setMensajeExito(null);

      if (usuarioEditando) {
        // Editar Usuario
        const response = await fetch(
          `http://127.0.0.1:8000/api/usuarios/${usuarioEditando}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cedula: usuarioData.cedula,
              carnetUsuario: usuarioData.carnet,
              nombres: usuarioData.nombres,
              apellidos: usuarioData.apellidos,
              telefono: usuarioData.telefono,
              correo: usuarioData.correo,
              rol: usuarioData.rol.toLowerCase(),
              activoUsuario: usuarioData.estado === "Activo",
              idsPermisos: usuarioData.idsPermisos || [],
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Error al actualizar el usuario");
        }

        setMensajeExito(data.mensaje || "Usuario actualizado exitosamente");
      } else {
        // Crear Usuario
        const response = await fetch("http://127.0.0.1:8000/api/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cedula: usuarioData.cedula,
            carnetUsuario: usuarioData.carnet,
            contrasena: usuarioData.password,
            nombres: usuarioData.nombres,
            apellidos: usuarioData.apellidos,
            telefono: usuarioData.telefono,
            correo: usuarioData.correo,
            rol: usuarioData.rol.toLowerCase(),
            activoUsuario: usuarioData.estado === "Activo",
            idsPermisos: usuarioData.idsPermisos || [],
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          let errorMessage = "Error al crear el usuario";
          if (data.detail) {
            errorMessage = data.detail;
          }
          throw new Error(errorMessage);
        }

        setMensajeExito(data.mensaje || "Usuario creado exitosamente");
      }

      // Recargar la lista después de guardar
      await obtenerUsuarios();

      // Cerrar el formulario después de un pequeño delay para mostrar el mensaje
      setTimeout(() => {
        setMostrarFormulario(false);
        setUsuarioEditando(null);
      }, 1500);
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      if (err instanceof Error) {
        setError(err.message);
        alert(`Error: ${err.message}`);
      } else {
        setError("Error al guardar el usuario. Por favor, intenta nuevamente.");
        alert("Error al guardar el usuario. Por favor, intenta nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  };

  // Cancelar formulario
  const handleCancelar = () => {
    setMostrarFormulario(false);
    setUsuarioEditando(null);
    setError(null);
    setMensajeExito(null);
  };

  // Renderizar contenido según el estado
  const renderContenido = () => {
    if (cargando) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando usuarios...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Error al cargar los usuarios</h3>
          <p>{error}</p>
          <button onClick={obtenerUsuarios} className={styles.btnReintentar}>
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <section className={`${styles.gestion} content`}>
        <section className={styles.controls}>
          <h3 className={styles.subtitle}>
            Total de Usuarios Registrados: {usuarios.length}
          </h3>

          <div className={styles.buttons}>
            <button onClick={handleCrearUsuario} className={styles.btnAgregar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Agregar Usuario
            </button>
          </div>
        </section>

        <div className={styles.tableContainer}>
          {usuarios.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No hay usuarios registrados</p>
            </div>
          ) : (
            <table>
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
                    key={usuario.id}
                    onClick={() => handleEditarUsuario(usuario)}
                    className={styles.filaClickable}
                  >
                    <td>{usuario.cedula}</td>
                    <td>{usuario.carnet}</td>
                    <td>{usuario.nombres}</td>
                    <td>{usuario.apellidos}</td>
                    <td>{usuario.telefono}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      <span
                        className={
                          usuario.estado === "Activo"
                            ? styles.estadoActivo
                            : styles.estadoInactivo
                        }
                      >
                        {usuario.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    );
  };

  /* === RENDERIZADO === */
  return (
    <div className={styles.container}>
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Gestión de Usuarios</h2>
        <p className={styles.moduleSubtitle}>
          {mostrarFormulario
            ? usuarioEditando
              ? "Editar usuario"
              : "Crear usuario"
            : "Trabajadores registrados en el sistema"}
        </p>
        {mensajeExito && (
          <div className={styles.mensajeExito}>{mensajeExito}</div>
        )}
      </header>

      {mostrarFormulario ? (
        <FormularioUsuario
          usuarioId={usuarioEditando}
          onGuardar={handleGuardarUsuario}
          onCancelar={handleCancelar}
        />
      ) : (
        renderContenido()
      )}
    </div>
  );
};
