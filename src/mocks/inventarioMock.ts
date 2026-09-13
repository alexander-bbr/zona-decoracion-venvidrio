/**
 * Mockup del backend para el módulo de Inventario.
 * Simula las 7 rutas del API usando localStorage como persistencia.
 *
 * Uso desde cualquier componente:
 *   import { mockFetch } from "../../../mocks/inventarioMock";
 *   const response = await mockFetch(API_URL, { method: "GET" });
 *
 * Cuando el backend real esté listo, simplemente reemplaza `mockFetch` por `fetch`.
 */

const STORAGE_KEY_INSUMOS = "mock_inventario_insumos";
const STORAGE_KEY_ENTRADAS = "mock_inventario_entradas";
const STORAGE_KEY_SALIDAS = "mock_inventario_salidas";
const STORAGE_KEY_COUNTERS = "mock_inventario_counters";

const API_BASE = "http://127.0.0.1:8000/api/inventario-insumos";

// ============================================================
// Tipos internos
// ============================================================

export type Insumo = {
  idInsumo: number;
  tipo: string;
  articulo: string;
  unidad: string;
  cantidadActual: number;
  cantidadMinima: number;
  estado: boolean;
};

export type Entrada = {
  idInventarioEntrada: number;
  idInsumo: number;
  fecha: string;
  encargado: string;
  turno: string;
  grupo: string;
  cantidad: number;
};

export type Salida = {
  idInventarioSalida: number;
  idInsumo: number;
  fecha: string;
  encargado: string;
  turno: string;
  grupo: string;
  cantidad: number;
};

type Counters = {
  insumo: number;
  entrada: number;
  salida: number;
};

// ============================================================
// Utilidades de localStorage
// ============================================================

const leer = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const escribir = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getCounters = (): Counters =>
  leer<Counters>(STORAGE_KEY_COUNTERS, { insumo: 0, entrada: 0, salida: 0 });

const setCounters = (counters: Counters): void =>
  escribir(STORAGE_KEY_COUNTERS, counters);

const getInsumos = (): Insumo[] => leer<Insumo[]>(STORAGE_KEY_INSUMOS, []);
const setInsumos = (data: Insumo[]): void =>
  escribir(STORAGE_KEY_INSUMOS, data);

const getEntradas = (): Entrada[] => leer<Entrada[]>(STORAGE_KEY_ENTRADAS, []);
const setEntradas = (data: Entrada[]): void =>
  escribir(STORAGE_KEY_ENTRADAS, data);

const getSalidas = (): Salida[] => leer<Salida[]>(STORAGE_KEY_SALIDAS, []);
const setSalidas = (data: Salida[]): void =>
  escribir(STORAGE_KEY_SALIDAS, data);

// ============================================================
// Seed inicial (solo la primera vez)
// ============================================================

const seedInicial = (): void => {
  const counters = getCounters();
  if (counters.insumo > 0 || counters.entrada > 0 || counters.salida > 0)
    return;

  const insumosSeed: Insumo[] = [
    {
      idInsumo: 1,
      tipo: "Pintura",
      articulo: "Esmalte Blanco",
      unidad: "Litros",
      cantidadActual: 120.5,
      cantidadMinima: 20.0,
      estado: true,
    },
    {
      idInsumo: 2,
      tipo: "Solvente",
      articulo: "Tinner Standard",
      unidad: "Galones",
      cantidadActual: 45.0,
      cantidadMinima: 10.0,
      estado: true,
    },
    {
      idInsumo: 3,
      tipo: "Pintura",
      articulo: "Esmalte Negro",
      unidad: "Litros",
      cantidadActual: 8.0,
      cantidadMinima: 15.0,
      estado: true,
    },
  ];

  const entradasSeed: Entrada[] = [
    {
      idInventarioEntrada: 1,
      idInsumo: 1,
      fecha: "2026-09-13",
      encargado: "Carlos Mendoza",
      turno: "Turno 1",
      grupo: "Grupo A",
      cantidad: 10.5,
    },
    {
      idInventarioEntrada: 2,
      idInsumo: 2,
      fecha: "2026-09-12",
      encargado: "Ana Gómez",
      turno: "Turno 2",
      grupo: "Grupo B",
      cantidad: 20.0,
    },
  ];

  const salidasSeed: Salida[] = [
    {
      idInventarioSalida: 1,
      idInsumo: 1,
      fecha: "2026-09-13",
      encargado: "Carlos Mendoza",
      turno: "Turno 1",
      grupo: "Grupo A",
      cantidad: 5.0,
    },
  ];

  setInsumos(insumosSeed);
  setEntradas(entradasSeed);
  setSalidas(salidasSeed);
  setCounters({ insumo: 3, entrada: 2, salida: 1 });
};

seedInicial();

// ============================================================
// Helpers de respuesta
// ============================================================

const jsonResponse = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const errorResponse = (detail: string, status = 400): Response =>
  jsonResponse({ detail }, status);

const hoyISO = (): string => new Date().toISOString().slice(0, 10);

// ============================================================
// mockFetch
// ============================================================

export const mockFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const method = (options.method ?? "GET").toUpperCase();
  const urlObj = new URL(url, window.location.origin);
  const pathname = urlObj.pathname;
  const params = urlObj.searchParams;

  const body: any = options.body ? JSON.parse(options.body as string) : null;

  // Simular latencia
  await new Promise((r) => setTimeout(r, 300));

  // ---------------------------------------------------------
  // Ruta 3: Listar Inventario (GET /inventario-insumos)
  // ---------------------------------------------------------
  if (pathname === "/api/inventario-insumos" && method === "GET") {
    const insumos = getInsumos().filter((i) => i.estado === true);
    return jsonResponse(insumos);
  }

  // ---------------------------------------------------------
  // Ruta 5: Crear Insumo (POST /inventario-insumos)
  // ---------------------------------------------------------
  if (pathname === "/api/inventario-insumos" && method === "POST") {
    if (!body) return errorResponse("Error al crear un insumo");

    const counters = getCounters();
    counters.insumo += 1;
    setCounters(counters);

    const nuevo: Insumo = {
      idInsumo: counters.insumo,
      tipo: body.tipo,
      articulo: body.articulo,
      unidad: body.unidad,
      cantidadActual: Number(body.cantidadActual),
      cantidadMinima: Number(body.cantidadMinima),
      estado: body.estado ?? true,
    };

    setInsumos([...getInsumos(), nuevo]);
    return jsonResponse({
      status: "Insumo creado con éxito",
      id: nuevo.idInsumo,
    });
  }

  // ---------------------------------------------------------
  // Ruta 1: Registro de Insumo (POST /entradas)
  // ---------------------------------------------------------
  if (pathname === "/api/inventario-insumos/entradas" && method === "POST") {
    if (!body) return errorResponse("Error en el registro");

    const counters = getCounters();
    counters.entrada += 1;
    setCounters(counters);

    const nueva: Entrada = {
      idInventarioEntrada: counters.entrada,
      idInsumo: Number(body.idInsumo),
      fecha: hoyISO(),
      encargado: body.encargado,
      turno: body.turno,
      grupo: body.grupo,
      cantidad: Number(body.cantidad),
    };

    setEntradas([...getEntradas(), nueva]);

    // Actualizar cantidadActual del insumo
    const insumos = getInsumos();
    const idx = insumos.findIndex((i) => i.idInsumo === nueva.idInsumo);
    if (idx !== -1) {
      insumos[idx].cantidadActual =
        Number(insumos[idx].cantidadActual) + Number(nueva.cantidad);
      setInsumos(insumos);
    }

    return jsonResponse({
      status: "Registro insertado con éxito",
      id: nueva.idInventarioEntrada,
    });
  }

  // ---------------------------------------------------------
  // Ruta 2: Salida de Insumo (POST /salidas)
  // ---------------------------------------------------------
  if (pathname === "/api/inventario-insumos/salidas" && method === "POST") {
    if (!body) return errorResponse("Error en la salida del insumo");

    const counters = getCounters();
    counters.salida += 1;
    setCounters(counters);

    const nueva: Salida = {
      idInventarioSalida: counters.salida,
      idInsumo: Number(body.idInsumo),
      fecha: hoyISO(),
      encargado: body.encargado,
      turno: body.turno,
      grupo: body.grupo,
      cantidad: Number(body.cantidad),
    };

    setSalidas([...getSalidas(), nueva]);

    // Actualizar cantidadActual del insumo (restar)
    const insumos = getInsumos();
    const idx = insumos.findIndex((i) => i.idInsumo === nueva.idInsumo);
    if (idx !== -1) {
      insumos[idx].cantidadActual =
        Number(insumos[idx].cantidadActual) - Number(nueva.cantidad);
      setInsumos(insumos);
    }

    return jsonResponse({
      status: "Salida registrada con éxito",
      id: nueva.idInventarioSalida,
    });
  }

  // ---------------------------------------------------------
  // Ruta 4: Historial de Movimiento (GET /historial)
  // ---------------------------------------------------------
  if (pathname === "/api/inventario-insumos/historial" && method === "GET") {
    const skip = Number(params.get("skip") ?? 0);
    const limit = Number(params.get("limit") ?? 50);

    const entradas = getEntradas().map((e) => ({
      idInventarioEntrada: e.idInventarioEntrada,
      idInsumo: e.idInsumo,
      fecha: e.fecha,
      encargado: e.encargado,
      turno: e.turno,
      grupo: e.grupo,
      cantidad: e.cantidad,
    }));

    const salidas = getSalidas().map((s) => ({
      idInventarioSalida: s.idInventarioSalida,
      idInsumo: s.idInsumo,
      fecha: s.fecha,
      encargado: s.encargado,
      turno: s.turno,
      grupo: s.grupo,
      cantidad: s.cantidad,
    }));

    // Mezclar y ordenar por fecha descendente
    const combinado = [...entradas, ...salidas].sort((a, b) =>
      a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0,
    );

    const paginado = combinado.slice(skip, skip + limit);
    return jsonResponse(paginado);
  }

  // ---------------------------------------------------------
  // Ruta 6: Ver Insumo por ID (GET /inventario-insumos/{id})
  // ---------------------------------------------------------
  const matchId = pathname.match(/^\/api\/inventario-insumos\/(\d+)$/);
  if (matchId) {
    const id = Number(matchId[1]);
    const insumo = getInsumos().find((i) => i.idInsumo === id);

    if (method === "GET") {
      if (!insumo) return errorResponse("Insumo no encontrado", 404);
      return jsonResponse(insumo);
    }

    // ---------------------------------------------------------
    // Ruta 7: Editar Insumo (PUT /inventario-insumos/{id})
    // ---------------------------------------------------------
    if (method === "PUT") {
      if (!insumo) return errorResponse("Error al editar el insumo", 404);
      if (!body) return errorResponse("Error al editar el insumo");

      const insumos = getInsumos();
      const idx = insumos.findIndex((i) => i.idInsumo === id);
      insumos[idx] = {
        ...insumos[idx],
        tipo: body.tipo,
        articulo: body.articulo,
        unidad: body.unidad,
        cantidadActual: Number(body.cantidadActual),
        cantidadMinima: Number(body.cantidadMinima),
        estado: body.estado ?? true,
      };
      setInsumos(insumos);

      return jsonResponse({ status: "Insumo editado con éxito", id });
    }
  }

  return errorResponse("Ruta no encontrada en el mock", 404);
};

// Utilidad opcional para reiniciar el mock desde la consola:
//   import { resetMock } from "..."; resetMock();
export const resetMock = (): void => {
  localStorage.removeItem(STORAGE_KEY_INSUMOS);
  localStorage.removeItem(STORAGE_KEY_ENTRADAS);
  localStorage.removeItem(STORAGE_KEY_SALIDAS);
  localStorage.removeItem(STORAGE_KEY_COUNTERS);
  seedInicial();
};
