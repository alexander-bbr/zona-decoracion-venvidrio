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

// Módulo - Gestión Productiva
import { GestionProductiva } from "../modules/GestionProductiva";
import { RegistrarProduccion } from "../modules/GestionProductiva/RegistrarProduccion";
import { EditarProduccion } from "../modules/GestionProductiva/EditarProduccion";

// Módulo - Gestión de Moldes
import { GestionMoldes } from "../modules/GestionMoldes";
import { RegistrarMolde } from "../modules/GestionMoldes/RegistrarMolde";
import { EditarMolde } from "../modules/GestionMoldes/EditarMolde";

// Módulo - Gestión de Justificantes
import { GestionJustificantes } from "../modules/GestionJustificantes";
import { RegistrarJustificante } from "../modules/GestionJustificantes/RegistrarJustificante";
import { EditarJustificante } from "../modules/GestionJustificantes/EditarJustificante";

// Módulo - Gestión de Usuarios
import { GestionUsuarios } from "../modules/GestionUsuarios";

// Módulo - Iniciar Sesión
import { SignIn } from "../modules/SignIn";

// Página de No Autorizado
import { Unauthorized } from "../modules/Unauthorized";

export const AppRoutes = () => {
  return (
    <Routes>
      {/*
      
          === RUTAS PÚBLICAS ===
      
      */}

      {/* Módulo - Sign In */}
      <Route
        path="/sign-in"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />

      {/* Módulo - Inicio */}
      <Route path="/" element={<Home />} />

      {/* Página de No Autorizado */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/*
      
          === RUTAS PRIVADAS ===
      
      */}

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
        ></Route>
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
        Módulo - Gestión Productiva 
        EL PADRE: Requiere AL MENOS UN permiso del módulo gestion_productiva
      */}
      <Route
        path="/gestion-productiva"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "gestion_productiva", accion: "ver_produccion" },
            ]}
            requireAnyPermission={true}
          >
            <GestionProductiva />
          </PrivateRoute>
        }
      >
        <Route
          path="registrar-produccion"
          element={
            <PrivateRoute
              requiredPermissions={[
                {
                  modulo: "gestion_productiva",
                  accion: "registrar_produccion",
                },
              ]}
            >
              <RegistrarProduccion />
            </PrivateRoute>
          }
        />
        <Route
          path="editar-produccion/:id_registro"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "gestion_productiva", accion: "editar" },
              ]}
            >
              <EditarProduccion />
            </PrivateRoute>
          }
        />
      </Route>

      {/* 
        Módulo - Gestión de Moldes
        EL PADRE: Requiere el permiso gestion_moldes del módulo gestion_productiva
      */}
      <Route
        path="/gestion-moldes"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "gestion_productiva", accion: "gestion_moldes" },
            ]}
            requireAnyPermission={true}
          >
            <GestionMoldes />
          </PrivateRoute>
        }
      >
        <Route
          path="registrar-molde"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "gestion_productiva", accion: "gestion_moldes" },
              ]}
            >
              <RegistrarMolde />
            </PrivateRoute>
          }
        />
        <Route
          path="editar-molde/:id"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "gestion_productiva", accion: "gestion_moldes" },
              ]}
            >
              <EditarMolde />
            </PrivateRoute>
          }
        />
      </Route>

      {/* 
        Módulo - Gestión de Justificantes
        EL PADRE: Requiere el permiso gestion_justificantes del módulo gestion_productiva
      */}
      <Route
        path="/gestion-justificantes"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "gestion_productiva", accion: "gestion_moldes" },
            ]}
            requireAnyPermission={true}
          >
            <GestionJustificantes />
          </PrivateRoute>
        }
      >
        <Route
          path="registrar-justificante"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "gestion_productiva", accion: "gestion_moldes" },
              ]}
            >
              <RegistrarJustificante />
            </PrivateRoute>
          }
        />
        <Route
          path="editar-justificante/:id"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "gestion_productiva", accion: "gestion_moldes" },
              ]}
            >
              <EditarJustificante />
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
            <GestionUsuarios />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};
