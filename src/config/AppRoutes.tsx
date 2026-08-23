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

// Módulo - Gestión Productiva
import { GestionProductiva } from "../modules/GestionProductiva";
import { Produccion } from "../modules/GestionProductiva/Produccion";
import { Moldes } from "../modules/GestionProductiva/Moldes";

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

      {/* 
        Módulo - Consumo de Pintura 
        EL PADRE: Requiere AL MENOS UN permiso del módulo insumo_pintura
        Los submódulos: Requieren permisos específicos
      */}
      <Route
        path="/consumo-pintura"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "insumo_pintura", accion: "ver_inventario" },
              { modulo: "insumo_pintura", accion: "crear_registro" },
              { modulo: "insumo_pintura", accion: "crear_consumo" },
              { modulo: "insumo_pintura", accion: "ver_historial_consumo" },
            ]}
            // Usamos requireAnyPermission para que permita si tiene AL MENOS UNO
            requireAnyPermission={true}
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

      {/* 
        Módulo - Producción Lisa 
        EL PADRE: Requiere AL MENOS UN permiso del módulo produccion_lisa
      */}
      <Route
        path="/produccion-lisa"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "produccion_lisa", accion: "ver_inventario" },
              { modulo: "produccion_lisa", accion: "crear_registro" },
              { modulo: "produccion_lisa", accion: "crear_salida" },
              { modulo: "produccion_lisa", accion: "ver_historial" },
            ]}
            requireAnyPermission={true}
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

      {/* 
        Módulo - Gestión Productiva 
        EL PADRE: Requiere AL MENOS UN permiso del módulo gestion_productiva
      */}
      <Route
        path="/gestion-productiva"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "produccion_lisa", accion: "ver_inventario" },
              { modulo: "produccion_lisa", accion: "crear_registro" },
            ]}
            requireAnyPermission={true}
          >
            <GestionProductiva />
          </PrivateRoute>
        }
      >
        <Route
          path="produccion"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "produccion_lisa", accion: "ver_inventario" },
              ]}
            >
              <Produccion />
            </PrivateRoute>
          }
        />
        <Route
          path="moldes"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "produccion_lisa", accion: "crear_registro" },
              ]}
            >
              <Moldes />
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
