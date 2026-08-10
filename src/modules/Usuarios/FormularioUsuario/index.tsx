//* Formulario tanto para Crear como Editar los usuarios

import { useState, useEffect, useCallback } from "react";
import styles from "./FormularioUsuario.module.css";

// Tipos genéricos
type Usuario = {
  id: string;
  cedula: string;
  carnet: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  rol: string;
  estado: "Activo" | "Inactivo";
  permisos: any; // Cambiamos a any para que sea flexible
};

// Tipo para el catálogo de permisos (genérico)
type PermisoCatalogo = {
  id_permisom: number;
  modulo: string;
  accion: string;
};

// Tipo para la respuesta del usuario por ID
type UsuarioDetailResponse = {
  data: {
    usuario: {
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
    permisos: PermisoCatalogo[];
  };
};

interface FormularioUsuarioProps {
  usuarioId: string | null;
  onGuardar: (usuario: any) => void; // Cambiamos a any para flexibilidad
  onCancelar: () => void;
}

interface FormularioData {
  cedula: string;
  carnet: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  rol: string;
  estado: "Activo" | "Inactivo";
  password: string;
  permisosSeleccionados: number[]; // IDs de permisos seleccionados
}

export const FormularioUsuario = ({
  usuarioId,
  onGuardar,
  onCancelar,
}: FormularioUsuarioProps) => {
  const [formData, setFormData] = useState<FormularioData>({
    cedula: "",
    carnet: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    rol: "",
    estado: "Activo",
    password: "",
    permisosSeleccionados: [],
  });

  const [catalogoPermisos, setCatalogoPermisos] = useState<PermisoCatalogo[]>(
    [],
  );
  const [cargandoPermisos, setCargandoPermisos] = useState(false);
  const [cargandoUsuario, setCargandoUsuario] = useState(false);
  const esEdicion = usuarioId !== null;

  //* Obtener el catálogo de permisos
  const obtenerCatalogoPermisos = useCallback(async () => {
    try {
      setCargandoPermisos(true);
      const response = await fetch(
        "http://127.0.0.1:8000/api/usuarios/permisos/catalogo",
      );
      if (!response.ok)
        throw new Error("Error al obtener el catálogo de permisos");
      const data = await response.json();

      // Extraer el array de permisos sin importar la estructura
      let permisosArray = [];

      if (data.data) {
        if (Array.isArray(data.data)) {
          permisosArray = data.data;
        } else if (data.data.data && Array.isArray(data.data.data)) {
          permisosArray = data.data.data;
        } else {
          permisosArray = [];
        }
      } else if (Array.isArray(data)) {
        permisosArray = data;
      }

      setCatalogoPermisos(permisosArray);
    } catch (err) {
      console.error("Error al obtener catálogo de permisos:", err);
      alert("Error al cargar los permisos disponibles");
      setCatalogoPermisos([]);
    } finally {
      setCargandoPermisos(false);
    }
  }, []);

  //* Obtener datos del usuario por ID (para edición)
  const obtenerUsuarioPorId = useCallback(
    async (id: string) => {
      try {
        setCargandoUsuario(true);
        const response = await fetch(
          `http://127.0.0.1:8000/api/usuarios/${id}`,
        );
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Usuario no encontrado");
          }
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data: UsuarioDetailResponse = await response.json();
        const usuario = data.data.usuario;
        const permisos = data.data.permisos || [];

        // Obtener los IDs de los permisos del usuario
        const idsPermisos = permisos.map((p) => p.id_permisom);

        // Cargar los datos en el formulario
        setFormData({
          cedula: usuario.cedula,
          carnet: usuario.carnet_usuario,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          telefono: usuario.telefono || "",
          correo: usuario.correo,
          rol: usuario.rol,
          estado: usuario.activo_usuario ? "Activo" : "Inactivo",
          password: "", // La contraseña no se edita
          permisosSeleccionados: idsPermisos,
        });
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        alert(
          err instanceof Error ? err.message : "Error al cargar el usuario",
        );
        onCancelar();
      } finally {
        setCargandoUsuario(false);
      }
    },
    [onCancelar],
  );

  //* Cargar datos iniciales
  useEffect(() => {
    obtenerCatalogoPermisos();
  }, [obtenerCatalogoPermisos]);

  //* Cargar usuario si es edición
  useEffect(() => {
    if (esEdicion && usuarioId) {
      obtenerUsuarioPorId(usuarioId);
    }
  }, [usuarioId, esEdicion, obtenerUsuarioPorId]);

  //* Manejo de cambios en los checkboxes de permisos
  const handlePermisoChange = (idPermiso: number, checked: boolean) => {
    setFormData((prev) => {
      let nuevosPermisos = [...prev.permisosSeleccionados];

      if (checked) {
        if (!nuevosPermisos.includes(idPermiso)) {
          nuevosPermisos.push(idPermiso);
        }
      } else {
        nuevosPermisos = nuevosPermisos.filter((id) => id !== idPermiso);
      }

      return {
        ...prev,
        permisosSeleccionados: nuevosPermisos,
      };
    });
  };

  //* Verificar si un permiso está seleccionado
  const isPermisoSeleccionado = (idPermiso: number): boolean => {
    return formData.permisosSeleccionados.includes(idPermiso);
  };

  // Manejo de cambios en inputs de texto y selects
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (
      !formData.cedula ||
      !formData.nombres ||
      !formData.apellidos ||
      !formData.correo ||
      !formData.rol
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Si es creación, la contraseña es obligatoria
    if (!esEdicion && !formData.password) {
      alert("La contraseña es obligatoria para crear un nuevo usuario.");
      return;
    }

    // Construir el objeto a enviar (genérico, sin transformaciones)
    const usuarioData: any = {
      cedula: formData.cedula,
      carnet: formData.carnet,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      telefono: formData.telefono,
      correo: formData.correo,
      rol: formData.rol,
      estado: formData.estado,
      idsPermisos: formData.permisosSeleccionados,
    };

    // Solo agregar password si es creación
    if (!esEdicion) {
      usuarioData.password = formData.password;
    }

    onGuardar(usuarioData);
  };

  // Renderizar grupos de permisos por módulo
  const renderPermisosPorModulo = () => {
    if (!Array.isArray(catalogoPermisos) || catalogoPermisos.length === 0) {
      return <p className={styles.sinPermisos}>No hay permisos disponibles</p>;
    }

    // Agrupar permisos por módulo
    const grupos: { [modulo: string]: PermisoCatalogo[] } = {};

    catalogoPermisos.forEach((permiso) => {
      if (!grupos[permiso.modulo]) {
        grupos[permiso.modulo] = [];
      }
      grupos[permiso.modulo].push(permiso);
    });

    return Object.entries(grupos).map(([modulo, permisos]) => (
      <div key={modulo} className={styles.modulo}>
        <h4 className={styles.moduloTitulo}>{modulo}</h4>
        <div className={styles.permisos}>
          {permisos.map((permiso) => (
            <div key={permiso.id_permisom} className={styles.checkboxGrupo}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isPermisoSeleccionado(permiso.id_permisom)}
                  onChange={(e) =>
                    handlePermisoChange(permiso.id_permisom, e.target.checked)
                  }
                  disabled={cargandoPermisos || cargandoUsuario}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxTexto}>{permiso.accion}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // Renderizar loading
  if (cargandoUsuario) {
    return (
      <section className={styles.formularioContainer}>
        <div className={styles.loadingContainer}>
          <p>Cargando datos del usuario...</p>
        </div>
      </section>
    );
  }

  /* === RENDERIZADO === */
  return (
    <section className={`${styles.formularioContainer} content`}>
      <div className={styles.formularioCard}>
        <h3 className={styles.formularioTitulo}>
          {esEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}
        </h3>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          {/* Información Personal */}
          <fieldset className={styles.datosPersonales}>
            <legend className={styles.legend}>Información Personal</legend>

            {/* Cédula */}
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor="cedula">
                Cédula <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                className={styles.input}
                type="text"
                id="cedula"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                disabled={cargandoUsuario}
                required
              />
            </div>

            {/* Carnet */}
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor="carnet">
                Carnet <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                className={styles.input}
                type="text"
                id="carnet"
                name="carnet"
                value={formData.carnet}
                onChange={handleChange}
                disabled={cargandoUsuario}
                required
              />
            </div>

            {/* Nombres */}
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor="nombres">
                Nombres <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                className={styles.input}
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                disabled={cargandoUsuario}
                required
              />
            </div>

            {/* Apellidos */}
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor="apellidos">
                Apellidos <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                className={styles.input}
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                disabled={cargandoUsuario}
                required
              />
            </div>

            {/* Teléfono */}
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor="telefono">
                Teléfono
              </label>
              <input
                className={styles.input}
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                disabled={cargandoUsuario}
              />
            </div>

            {/* Correo */}
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor="correo">
                Correo <span className={styles.requireSymbol}>*</span>
              </label>
              <input
                className={styles.input}
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                disabled={cargandoUsuario}
                required
              />
            </div>

            {/* Rol */}
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor="rol">
                Rol <span className={styles.requireSymbol}>*</span>
              </label>
              <select
                className={styles.select}
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                disabled={cargandoUsuario}
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="administrador">Administrador</option>
                <option value="operador">Operador</option>
              </select>
            </div>

            {/* Estado del Usuario */}
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor="estado">
                Estado <span className={styles.requireSymbol}>*</span>
              </label>
              <select
                className={styles.select}
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                disabled={cargandoUsuario}
                required
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            {/* Contraseña - SOLO visible en creación */}
            {!esEdicion && (
              <div className={styles.inputWrapper}>
                <label className={styles.label} htmlFor="password">
                  Contraseña <span className={styles.requireSymbol}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={cargandoUsuario}
                />
                <small className={styles.advice}>Mínimo 8 caracteres</small>
              </div>
            )}
          </fieldset>

          {/* Permisología - Dinámica desde el catálogo */}
          <fieldset className={styles.permisologia}>
            <legend className={styles.legend}>Permisología</legend>

            <p className={styles.permisosDescripcion}>
              Selecciona los permisos que tendrá el usuario en el sistema.
            </p>

            {cargandoPermisos ? (
              <div className={styles.loadingPermisos}>
                <div className={styles.spinnerSmall}></div>
                <p>Cargando permisos disponibles...</p>
              </div>
            ) : (
              <div className={styles.modulosContainer}>
                {renderPermisosPorModulo()}
              </div>
            )}
          </fieldset>

          {/* Botones de acción */}
          <div className={styles.buttonWrapper}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={cargandoPermisos || cargandoUsuario}
            >
              {esEdicion ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={onCancelar}
              className={styles.cancelButton}
              disabled={cargandoPermisos || cargandoUsuario}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
