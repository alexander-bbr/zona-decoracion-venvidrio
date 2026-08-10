// Configuración
import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

// Módulo - Home
import { Home } from "../modules/Home";

// Módulo - Rendimiento
import { Rendimiento } from "../modules/Rendimiento";

// Módulo - Consumo de Pintura
import { ConsumoDePintura } from "../modules/CuartoDePantalla/ConsumoDePintura";
import { ConsumirPintura } from "../modules/CuartoDePantalla/ConsumoDePintura/ConsumirPintura";
import { SuministrarPintura } from "../modules/CuartoDePantalla/ConsumoDePintura/SuministrarPintura";
import { InventarioPintura } from "../modules/CuartoDePantalla/ConsumoDePintura/InventarioPintura";
import { HistorialConsumo } from "../modules/CuartoDePantalla/ConsumoDePintura/HistorialConsumo";

// Módulo - Producción Lisa
import { ProduccionLisa } from "../modules/ProduccionLisa";
import { RegistrarProduccionLisa } from "../modules/ProduccionLisa/RegistrarProduccionLisa";
import { ConsumirProduccionLisa } from "../modules/ProduccionLisa/ConsumirProduccionLisa";
import { HistorialProduccionLisa } from "../modules/ProduccionLisa/HistorialProduccionLisa";
import { InventarioProduccionLisa } from "../modules/ProduccionLisa/InventarioProduccionLisa";

// Módulo - Gestión de Usuarios
import { Usuarios } from "../modules/Usuarios";

// Módulo - Iniciar Sesión
import { SignIn } from "../modules/SignIn";

// Módulo - No Autorizado
import { Unauthorized } from "../modules/Unauthorized";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública - Login */}
      <Route
        path="/sign-in"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />

      {/* Ruta pública - Home (accesible para todos) */}
      <Route path="/" element={<Home />} />

      {/* Ruta pública - No Autorizado */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Módulo - Rendimiento - Requiere permiso dashboard.ver */}
      <Route
        path="/rendimiento"
        element={
          <PrivateRoute
            requiredPermissions={[{ modulo: "dashboard", accion: "ver" }]}
          >
            <Rendimiento />
          </PrivateRoute>
        }
      />

      {/* Módulo - Consumo de Pintura - Requiere permisos específicos */}
      <Route
        path="/consumo-pintura"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "insumo_pintura", accion: "ver_inventario" },
            ]}
          >
            <ConsumoDePintura />
          </PrivateRoute>
        }
      >
        <Route
          path="consumir"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "insumo_pintura", accion: "crear_consumo" },
              ]}
            >
              <ConsumirPintura />
            </PrivateRoute>
          }
        />
        <Route
          path="suministrar"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "insumo_pintura", accion: "crear_registro" },
              ]}
            >
              <SuministrarPintura />
            </PrivateRoute>
          }
        />
        <Route
          path="historial-consumo"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "insumo_pintura", accion: "ver_historial_consumo" },
              ]}
            >
              <HistorialConsumo />
            </PrivateRoute>
          }
        />
        <Route
          path="inventario"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "insumo_pintura", accion: "ver_inventario" },
              ]}
            >
              <InventarioPintura />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Módulo - Producción Lisa - Requiere permisos específicos */}
      <Route
        path="/produccion-lisa"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "produccion_lisa", accion: "ver_inventario" },
            ]}
          >
            <ProduccionLisa />
          </PrivateRoute>
        }
      >
        <Route
          path="registrar"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "produccion_lisa", accion: "crear_registro" },
              ]}
            >
              <RegistrarProduccionLisa />
            </PrivateRoute>
          }
        />
        <Route
          path="consumir"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "produccion_lisa", accion: "crear_salida" },
              ]}
            >
              <ConsumirProduccionLisa />
            </PrivateRoute>
          }
        />
        <Route
          path="historial"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "produccion_lisa", accion: "ver_historial" },
              ]}
            >
              <HistorialProduccionLisa />
            </PrivateRoute>
          }
        />
        <Route
          path="inventario"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "produccion_lisa", accion: "ver_inventario" },
              ]}
            >
              <InventarioProduccionLisa />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Módulo - Gestión de Usuarios - Requiere permisos específicos */}
      <Route
        path="/gestion-usuarios"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "gestion_usuarios", accion: "ver_usuarios" },
            ]}
          >
            <Usuarios />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};
