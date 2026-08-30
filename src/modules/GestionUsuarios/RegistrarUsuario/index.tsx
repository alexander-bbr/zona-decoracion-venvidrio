import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderForm } from "../../../components/HeaderForm";
import styles from "./registrar-usuario.module.css";

type PermisoCatalogo = {
  id_permisom: number;
  modulo: string;
  accion: string;
};

type FormData = {
  cedula: string;
  carnetUsuario: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  rol: string;
  activoUsuario: boolean;
  contrasena: string;
  idsPermisos: number[];
};

const API_USUARIOS = "http://127.0.0.1:8000/api/usuarios";
const API_CATALOGO_PERMISOS =
  "http://127.0.0.1:8000/api/usuarios/permisos/catalogo";

export const RegistrarUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    cedula: "",
    carnetUsuario: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    rol: "",
    activoUsuario: true,
    contrasena: "",
    idsPermisos: [],
  });
  const [catalogoPermisos, setCatalogoPermisos] = useState<PermisoCatalogo[]>(
    [],
  );
  const [cargandoPermisos, setCargandoPermisos] = useState(true);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  useEffect(() => {
    const cargarPermisos = async () => {
      try {
        const response = await fetch(API_CATALOGO_PERMISOS);
        if (!response.ok) {
          throw new Error("Error al cargar permisos");
        }
        const data = await response.json();
        const permisosArray = data.data || [];
        setCatalogoPermisos(permisosArray);
      } catch (err) {
        console.error("Error al cargar catálogo de permisos:", err);
        setError("No se pudieron cargar los permisos disponibles");
      } finally {
        setCargandoPermisos(false);
      }
    };
    cargarPermisos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "activoUsuario") {
      setFormData((prev) => ({
        ...prev,
        activoUsuario: checked,
      }));
    } else if (name === "rol") {
      setFormData((prev) => ({
        ...prev,
        rol: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePermisoChange = (idPermiso: number, checked: boolean) => {
    setFormData((prev) => {
      let nuevosPermisos = [...prev.idsPermisos];
      if (checked) {
        if (!nuevosPermisos.includes(idPermiso)) {
          nuevosPermisos.push(idPermiso);
        }
      } else {
        nuevosPermisos = nuevosPermisos.filter((id) => id !== idPermiso);
      }
      return {
        ...prev,
        idsPermisos: nuevosPermisos,
      };
    });
  };

  const isPermisoSeleccionado = (idPermiso: number): boolean => {
    return formData.idsPermisos.includes(idPermiso);
  };

  const renderPermisosPorModulo = () => {
    if (!Array.isArray(catalogoPermisos) || catalogoPermisos.length === 0) {
      return <p className={styles.sinPermisos}>No hay permisos disponibles</p>;
    }

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
                  disabled={cargandoPermisos}
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    // Validaciones
    if (!formData.cedula.trim()) {
      setError("La cédula es obligatoria.");
      setCargando(false);
      return;
    }
    if (!formData.carnetUsuario.trim()) {
      setError("El carnet es obligatorio.");
      setCargando(false);
      return;
    }
    if (!formData.nombres.trim()) {
      setError("Los nombres son obligatorios.");
      setCargando(false);
      return;
    }
    if (!formData.apellidos.trim()) {
      setError("Los apellidos son obligatorios.");
      setCargando(false);
      return;
    }
    if (!formData.correo.trim()) {
      setError("El correo es obligatorio.");
      setCargando(false);
      return;
    }
    if (!formData.rol) {
      setError("Debes seleccionar un rol.");
      setCargando(false);
      return;
    }
    if (!formData.contrasena || formData.contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(API_USUARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rol: formData.rol.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al registrar usuario.");
      }

      navigate("/gestion-usuarios");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Error al registrar usuario.",
      );
    } finally {
      setCargando(false);
    }
  };

  const handleReset = () => {
    setFormData({
      cedula: "",
      carnetUsuario: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      correo: "",
      rol: "",
      activoUsuario: true,
      contrasena: "",
      idsPermisos: [],
    });
    setError("");
  };

  return (
    <form className={`${styles.form} content`} onSubmit={handleSubmit}>
      <HeaderForm />

      <h3 className={styles.title}>Registrar Nuevo Usuario</h3>

      <section className={styles.formData}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Información Personal</legend>

          <div className={styles.inputWrapper}>
            <label htmlFor="cedula">
              Cédula <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="cedula"
              name="cedula"
              type="text"
              value={formData.cedula}
              onChange={handleChange}
              required
              placeholder="Ej: 12345678"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="carnetUsuario">
              Carnet <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="carnetUsuario"
              name="carnetUsuario"
              type="text"
              value={formData.carnetUsuario}
              onChange={handleChange}
              required
              placeholder="Ej: USR-001"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="nombres">
              Nombres <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="nombres"
              name="nombres"
              type="text"
              value={formData.nombres}
              onChange={handleChange}
              required
              placeholder="Ej: Juan Carlos"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="apellidos">
              Apellidos <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="apellidos"
              name="apellidos"
              type="text"
              value={formData.apellidos}
              onChange={handleChange}
              required
              placeholder="Ej: Pérez González"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 0412-1234567"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="correo">
              Correo <span className={styles.requireSymbol}>*</span>
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              required
              placeholder="Ej: usuario@empresa.com"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="rol">
              Rol <span className={styles.requireSymbol}>*</span>
            </label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="administrador">Administrador</option>
              <option value="operador">Operador</option>
            </select>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="activoUsuario">Estado</label>
            <div className={styles.checkboxWrapper}>
              <input
                id="activoUsuario"
                name="activoUsuario"
                type="checkbox"
                checked={formData.activoUsuario}
                onChange={handleChange}
                className={styles.checkboxEstado}
              />
              <label htmlFor="activoUsuario" className={styles.estadoLabel}>
                {formData.activoUsuario ? "Activo" : "Inactivo"}
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Seguridad</legend>
          <div className={styles.inputWrapper}>
            <label htmlFor="contrasena">
              Contraseña <span className={styles.requireSymbol}>*</span>
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="contrasena"
                name="contrasena"
                type={mostrarPassword ? "text" : "password"}
                value={formData.contrasena}
                onChange={handleChange}
                required
                placeholder="Mínimo 8 caracteres"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className={styles.togglePassword}
              >
                {mostrarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <small className={styles.advice}>Mínimo 8 caracteres</small>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Permisología</legend>
          <p className={styles.permisosDescripcion}>
            Selecciona los permisos que tendrá el usuario en el sistema.
          </p>

          {cargandoPermisos ? (
            <div className={styles.loadingPermisos}>
              <p>Cargando permisos disponibles...</p>
            </div>
          ) : (
            <div className={styles.modulosContainer}>
              {renderPermisosPorModulo()}
            </div>
          )}
        </fieldset>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonWrapper}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={cargando || cargandoPermisos}
          >
            {cargando ? "Registrando..." : "Guardar"}
          </button>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
            disabled={cargando || cargandoPermisos}
          >
            Resetear
          </button>
        </div>
      </section>
    </form>
  );
};
