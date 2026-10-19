import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./gestion-productiva.module.css";

type RegistroProduccionLista = {
  idCabecera: number;
  fecha: string;
  turno: number;
  grupo: string;
  tecnico: string;
  totalGruesas: number;
  totalGruesasLisas: number;
  totalGruesasDecoradas: number;
  eficienciaProductiva: number;
  deficienciaProductiva: number;
};

type Molde = {
  item: string;
  nombre: string;
  descripcion: string;
  numeroCamadas: number;
  numeroEnvases: number;
  numeroGruesas: number;
};

type Criterio =
  | ""
  | "tecnico"
  | "turno"
  | "totalGruesas"
  | "totalGruesasLisas"
  | "totalGruesasDecoradas"
  | "eficiencia"
  | "item";

type FiltrosAplicados = {
  desde: string;
  hasta: string;
  criterio: Criterio;
  valor: string;
};

const API_PRODUCCION = "http://127.0.0.1:8000/produccion";
const API_MOLDES = "http://127.0.0.1:8000/produccion/moldes";
const API_EXPORTAR_PRODUCCION =
  "http://127.0.0.1:8000/api/exportacion/gestion-productiva";

const STORAGE_KEY_FILTROS = "gestion-productiva-filtros";

const CRITERIOS: { value: Criterio; label: string }[] = [
  { value: "tecnico", label: "Técnico" },
  { value: "turno", label: "Turno" },
  { value: "item", label: "Molde (item)" },
  { value: "totalGruesas", label: "Total Gruesas" },
  { value: "totalGruesasLisas", label: "Gruesas Lisas" },
  { value: "totalGruesasDecoradas", label: "Gruesas Decoradas" },
  { value: "eficiencia", label: "Eficiencia" },
];

// Helpers de sessionStorage
const leerFiltrosGuardados = (): FiltrosAplicados | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_FILTROS);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FiltrosAplicados;
    if (!parsed.desde || !parsed.hasta) return null;
    return parsed;
  } catch {
    return null;
  }
};

const guardarFiltros = (filtros: FiltrosAplicados | null) => {
  try {
    if (filtros && filtros.desde && filtros.hasta) {
      sessionStorage.setItem(STORAGE_KEY_FILTROS, JSON.stringify(filtros));
    } else {
      sessionStorage.removeItem(STORAGE_KEY_FILTROS);
    }
  } catch {
    // Ignorar errores de storage
  }
};

export const GestionProductiva = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();

  const [pagina, setPagina] = useState(1);
  const [registros, setRegistros] = useState<RegistroProduccionLista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [moldes, setMoldes] = useState<Molde[]>([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [criterio, setCriterio] = useState<Criterio>("");
  const [valorCriterio, setValorCriterio] = useState("");
  /* Averigua si hice algo bien con mis cambios, ya que esta variable deice que está asignada pero su valor no se está utilizando */
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosAplicados | null>(null);

  // Exportación
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fechaDesdeExport, setFechaDesdeExport] = useState("");
  const [fechaHastaExport, setFechaHastaExport] = useState("");
  const [descargando, setDescargando] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState("");

  // Permisos
  const puedeRegistrar = hasPermission(
    "gestion_productiva",
    "registrar_produccion",
  );
  const puedeEditar = hasPermission("gestion_productiva", "editar");

  const registrosPorPagina = 50;
  const inicio = (pagina - 1) * registrosPorPagina;
  const registrosPagina = registros.slice(inicio, inicio + registrosPorPagina);
  const totalRegistros = registros.length;
  const hayMasRegistros = inicio + registrosPagina.length < totalRegistros;

  // Fecha máxima permitida: hoy (en hora local, no UTC)
  const hoy = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  // ===== Cargar moldes para el select del criterio "item" =====
  useEffect(() => {
    const cargarMoldes = async () => {
      try {
        const response = await fetch(API_MOLDES);
        if (!response.ok) {
          throw new Error(`Error al cargar moldes: ${response.status}`);
        }
        const moldesCargados = (await response.json()) as Molde[];
        setMoldes(moldesCargados);
      } catch (loadError) {
        console.error("Error al cargar moldes:", loadError);
      }
    };
    void cargarMoldes();
  }, []);

  // ===== Carga de registros (con o sin filtros) =====
  const cargarRegistros = async (filtros: FiltrosAplicados | null) => {
    setCargando(true);
    setError("");
    try {
      const registrosCargados: RegistroProduccionLista[] = [];
      let skip = 0;

      const construirUrl = (skipActual: number) => {
        const params = new URLSearchParams();
        params.set("skip", String(skipActual));
        params.set("limit", String(registrosPorPagina));

        if (filtros) {
          // Fechas obligatorias cuando hay filtro
          params.set("desde", filtros.desde);
          params.set("hasta", filtros.hasta);

          // Criterio opcional
          if (filtros.criterio && filtros.valor) {
            let valorFinal = filtros.valor;
            if (filtros.criterio === "tecnico") {
              valorFinal = valorFinal.toUpperCase();
            }
            params.set(filtros.criterio, valorFinal);
          }
        }

        return `${API_PRODUCCION}?${params.toString()}`;
      };

      while (true) {
        const response = await fetch(construirUrl(skip));
        if (!response.ok)
          throw new Error(`Error al cargar registros: ${response.status}`);

        const data = await response.json();
        const registrosApi = Array.isArray(data) ? data : (data.data ?? []);
        const registrosNormalizados = registrosApi.map(
          (registro: RegistroProduccionLista) => ({
            ...registro,
            idCabecera: Number(registro.idCabecera),
            turno: Number(registro.turno),
            totalGruesas: Number(registro.totalGruesas),
            totalGruesasLisas: Number(registro.totalGruesasLisas),
            totalGruesasDecoradas: Number(registro.totalGruesasDecoradas),
            eficienciaProductiva: Number(registro.eficienciaProductiva),
            deficienciaProductiva: Number(registro.deficienciaProductiva),
          }),
        );

        registrosCargados.push(...registrosNormalizados);

        // Como el backend devuelve array sin total, paramos si vino menos del límite
        if (registrosNormalizados.length < registrosPorPagina) {
          break;
        }
        skip += registrosPorPagina;
      }

      setRegistros(registrosCargados);
      setPagina(1);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Error al cargar producción.",
      );
    } finally {
      setCargando(false);
    }
  };

  // ===== Carga inicial (lee filtros guardados) =====
  useEffect(() => {
    const filtrosGuardados = leerFiltrosGuardados();
    if (filtrosGuardados) {
      setFiltrosAplicados(filtrosGuardados);
      setFechaDesde(filtrosGuardados.desde);
      setFechaHasta(filtrosGuardados.hasta);
      setCriterio(filtrosGuardados.criterio);
      setValorCriterio(filtrosGuardados.valor);
      setMostrarFiltros(true);
      void cargarRegistros(filtrosGuardados);
    } else {
      void cargarRegistros(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Recargar al volver de registrar/editar =====
  useEffect(() => {
    if (location.pathname === "/gestion-productiva") {
      const filtrosGuardados = leerFiltrosGuardados();
      void cargarRegistros(filtrosGuardados);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ===== Handlers de filtros =====
  const handleFiltrar = () => {
    if (!fechaDesde || !fechaHasta) {
      setError("Debes seleccionar ambas fechas (Desde y Hasta) para filtrar.");
      return;
    }

    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      setError("La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.");
      return;
    }

    if (criterio && !valorCriterio.trim()) {
      setError("Debes ingresar un valor para el criterio seleccionado.");
      return;
    }

    const filtros: FiltrosAplicados = {
      desde: fechaDesde,
      hasta: fechaHasta,
      criterio,
      valor: criterio ? valorCriterio : "",
    };

    setFiltrosAplicados(filtros);
    guardarFiltros(filtros);
    setError("");
    void cargarRegistros(filtros);
  };

  const handleLimpiarFiltros = () => {
    setFechaDesde("");
    setFechaHasta("");
    setCriterio("");
    setValorCriterio("");
    setFiltrosAplicados(null);
    guardarFiltros(null);
    setError("");
    void cargarRegistros(null);
  };

  // ===== Exportación =====
  const abrirModalExportar = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hoyStr = `${year}-${month}-${day}`;
    setFechaDesdeExport(hoyStr);
    setFechaHastaExport(hoyStr);
    setErrorDescarga("");
    setMostrarModal(true);
  };

  const cerrarModalExportar = () => {
    setMostrarModal(false);
    setErrorDescarga("");
  };

  const handleDescargarExcel = async () => {
    if (!fechaDesdeExport || !fechaHastaExport) {
      setErrorDescarga("Debes seleccionar ambas fechas.");
      return;
    }

    if (new Date(fechaDesdeExport) > new Date(fechaHastaExport)) {
      setErrorDescarga(
        "La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.",
      );
      return;
    }

    setDescargando(true);
    setErrorDescarga("");

    try {
      const response = await fetch(API_EXPORTAR_PRODUCCION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaDesde: fechaDesdeExport,
          fechaHasta: fechaHastaExport,
        }),
      });

      if (!response.ok) {
        let mensajeError = `Error al generar el Excel: ${response.status}`;
        try {
          const data = await response.json();
          if (data?.detail) {
            mensajeError =
              typeof data.detail === "string"
                ? data.detail
                : JSON.stringify(data.detail);
          }
        } catch {
          // La respuesta no era JSON
        }
        throw new Error(mensajeError);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let nombreArchivo = "Historial de Producción.xlsx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          nombreArchivo = match[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      cerrarModalExportar();
    } catch (downloadError) {
      setErrorDescarga(
        downloadError instanceof Error
          ? downloadError.message
          : "Error al descargar el Excel.",
      );
    } finally {
      setDescargando(false);
    }
  };

  // ===== Handlers con permisos =====
  const handleRegistrarClick = () => {
    if (!puedeRegistrar) {
      alert("No tienes permiso para registrar producción");
      return;
    }
    navigate("registrar-produccion");
  };

  const handleEditarClick = (id: number) => {
    if (!puedeEditar) {
      alert("No tienes permiso para editar registros de producción");
      return;
    }
    navigate(`editar-produccion/${id}`);
  };

  const isRoot = location.pathname === "/gestion-productiva";

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("registrar-produccion")) return "Registrar Producción";
    if (path.includes("editar-produccion")) return "Editar Producción";
    return "";
  };

  // ===== Render dinámico del input según criterio =====
  const renderInputCriterio = () => {
    if (!criterio) {
      return (
        <input
          type="text"
          placeholder="Selecciona un criterio primero"
          disabled
          value=""
        />
      );
    }

    if (criterio === "tecnico") {
      return (
        <input
          type="text"
          placeholder="Ej: DANIEL PÉREZ"
          value={valorCriterio}
          onChange={(e) => setValorCriterio(e.target.value.toUpperCase())}
        />
      );
    }

    if (criterio === "turno") {
      return (
        <select
          value={valorCriterio}
          onChange={(e) => setValorCriterio(e.target.value)}
        >
          <option value="">...</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      );
    }

    if (criterio === "item") {
      return (
        <select
          value={valorCriterio}
          onChange={(e) => setValorCriterio(e.target.value)}
        >
          <option value="">...</option>
          {moldes.map((molde) => (
            <option key={molde.item} value={molde.item}>
              {molde.item} --&gt; {molde.nombre}
            </option>
          ))}
        </select>
      );
    }

    // Numéricos
    return (
      <input
        type="number"
        step="0.01"
        min="0"
        placeholder="Valor numérico"
        value={valorCriterio}
        onChange={(e) => setValorCriterio(e.target.value)}
      />
    );
  };

  return (
    <section className="container">
      <header className={styles.moduleHeader}>
        <h2 className={styles.moduleTitle}>Gestión Productiva</h2>
        <p className={styles.moduleSubtitle}>
          Historial de producción en la Zona de Decoración
        </p>
      </header>

      {!isRoot ? (
        <nav className={`${styles.subNav} content`} id="subNav">
          <NavLink
            to="/gestion-productiva"
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
        <section className={`${styles.gestionProductiva} content`}>
          <section className={styles.controlPanel}>
            <h2 className={styles.title}>Historial de Producción</h2>

            <div className={styles.buttonWrapper}>
              <button
                className={styles.filterToggleButton}
                onClick={() => setMostrarFiltros((v) => !v)}
              >
                {mostrarFiltros ? "▲ Ocultar filtros" : "▼ Mostrar filtros"}
              </button>
              <button
                className={styles.downloadButton}
                onClick={abrirModalExportar}
                disabled={cargando}
              >
                ↓ Descargar
              </button>
              {puedeRegistrar && (
                <button
                  className={styles.registerButton}
                  onClick={handleRegistrarClick}
                >
                  + Registrar Producción
                </button>
              )}
            </div>
          </section>

          {/* === PANEL DE FILTROS === */}
          {mostrarFiltros && (
            <div className={styles.filtrosPanel}>
              <div className={styles.filtrosRow}>
                <div className={styles.filtroInput}>
                  <label htmlFor="filtroFechaDesde">
                    Desde <span className={styles.requireSymbol}>*</span>
                  </label>
                  <input
                    id="filtroFechaDesde"
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    max={hoy}
                  />
                </div>
                <div className={styles.filtroInput}>
                  <label htmlFor="filtroFechaHasta">
                    Hasta <span className={styles.requireSymbol}>*</span>
                  </label>
                  <input
                    id="filtroFechaHasta"
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    max={hoy}
                  />
                </div>
                <div className={styles.filtroInput}>
                  <label htmlFor="filtroCriterio">Criterio</label>
                  <select
                    id="filtroCriterio"
                    value={criterio}
                    onChange={(e) => {
                      setCriterio(e.target.value as Criterio);
                      setValorCriterio("");
                    }}
                  >
                    <option value="">Sin criterio (solo fechas)</option>
                    {CRITERIOS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.filtroInput}>
                  <label htmlFor="filtroValor">Valor</label>
                  {renderInputCriterio()}
                </div>
              </div>
              <div className={styles.filtrosActions}>
                <button
                  className={styles.filtrarButton}
                  onClick={handleFiltrar}
                  disabled={cargando}
                >
                  {cargando ? "Filtrando..." : "Filtrar"}
                </button>
                <button
                  className={styles.limpiarButton}
                  onClick={handleLimpiarFiltros}
                  disabled={cargando}
                >
                  Limpiar
                </button>
              </div>
            </div>
          )}

          {/* Mensajes de Estado para el filtrado */}
          {cargando && <p>Cargando registros de producción...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!cargando && !error && registros.length === 0 && (
            <p className={styles.emptyMessage}>
              No se encontraron registros con esos filtros.
            </p>
          )}
          {!cargando && !error && registros.length > 0 && (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nro. Registro</th>
                    <th>Fecha</th>
                    <th>Turno</th>
                    <th>Técnico</th>
                    <th>Total Gruesas</th>
                    <th>Gruesas Lisas</th>
                    <th>Gruesas Decoradas</th>
                    <th>Eficiencia</th>
                    <th>Deficiencia</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosPagina.map((registro) => (
                    <tr
                      key={registro.idCabecera}
                      onClick={() => handleEditarClick(registro.idCabecera)}
                      style={{
                        cursor: puedeEditar ? "pointer" : "default",
                        opacity: puedeEditar ? 1 : 0.8,
                      }}
                    >
                      <td>
                        <strong>{registro.idCabecera}</strong>
                      </td>
                      <td>{registro.fecha}</td>
                      <td>{registro.turno}</td>
                      <td>{registro.tecnico}</td>
                      <td>{registro.totalGruesas}</td>
                      <td>{registro.totalGruesasLisas}</td>
                      <td>{registro.totalGruesasDecoradas}</td>
                      <td className={styles.eficent}>
                        {registro.eficienciaProductiva} %
                      </td>
                      <td className={styles.deficent}>
                        {registro.deficienciaProductiva} %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer className={styles.pagination}>
            <span>
              {registrosPagina.length
                ? `${inicio + 1}-${inicio + registrosPagina.length}`
                : "0-0"}{" "}
              de {totalRegistros}
            </span>

            <div className={styles.pageButtons}>
              <button
                className={styles.pageButton}
                disabled={pagina === 1}
                onClick={() => setPagina((actual) => actual - 1)}
              >
                &lt;
              </button>

              <button
                className={styles.pageButton}
                disabled={!hayMasRegistros}
                onClick={() => setPagina((actual) => actual + 1)}
              >
                &gt;
              </button>
            </div>
          </footer>
        </section>
      ) : (
        <Outlet />
      )}

      {/* === MODAL DE EXPORTACIÓN === */}
      {mostrarModal && (
        <div className={styles.modalOverlay} onClick={cerrarModalExportar}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Exportar Historial de Producción
              </h3>
              <button
                className={styles.modalCloseButton}
                onClick={cerrarModalExportar}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <p className={styles.modalDescription}>
              Selecciona el rango de fechas para exportar los registros de
              producción.
            </p>

            <div className={styles.modalBody}>
              <div className={styles.modalInputWrapper}>
                <label htmlFor="fechaDesdeExport">Desde</label>
                <input
                  id="fechaDesdeExport"
                  type="date"
                  value={fechaDesdeExport}
                  onChange={(e) => setFechaDesdeExport(e.target.value)}
                  max={fechaHastaExport || undefined}
                />
              </div>

              <div className={styles.modalInputWrapper}>
                <label htmlFor="fechaHastaExport">Hasta</label>
                <input
                  id="fechaHastaExport"
                  type="date"
                  value={fechaHastaExport}
                  onChange={(e) => setFechaHastaExport(e.target.value)}
                  min={fechaDesdeExport || undefined}
                />
              </div>
            </div>

            {errorDescarga && (
              <p className={styles.modalError}>{errorDescarga}</p>
            )}

            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelButton}
                onClick={cerrarModalExportar}
                disabled={descargando}
              >
                Cancelar
              </button>
              <button
                className={styles.modalDownloadButton}
                onClick={handleDescargarExcel}
                disabled={descargando}
              >
                {descargando ? "Generando..." : "Descargar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
