import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

// Módulo - Home
import { Home } from "../modules/Home";

// Módulo - Rendimiento
import { Rendimiento } from "../modules/Rendimiento";

// Módulo - Inventario
import { Inventario } from "../modules/Inventario";
import { RegistroInsumo } from "../modules/Inventario/RegistroInsumo";
import { SalidaInsumo } from "../modules/Inventario/SalidaInsumo";
import { ListarInventario } from "../modules/Inventario/ListarInventario";
import { HistorialMovimiento } from "../modules/Inventario/HistorialMovimiento";
import { CrearInsumo } from "../modules/Inventario/CrearInsumo";
import { EditarInsumo } from "../modules/Inventario/EditarInsumo";

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
import { RegistrarUsuario } from "../modules/GestionUsuarios/RegistrarUsuario";
import { EditarUsuario } from "../modules/GestionUsuarios/EditarUsuario";

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
        Módulo - Inventario - Requiere el permiso ...
      */}
      <Route
        path="/inventario"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "insumo_pintura", accion: "ver_inventario" },
            ]}
            // Usamos requireAnyPermission para que permita si tiene AL MENOS UNO
            requireAnyPermission={true}
          >
            <Inventario />
          </PrivateRoute>
        }
      >
        <Route
          path="registro-insumo"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "insumo_pintura", accion: "crear_consumo" },
              ]}
            >
              <RegistroInsumo />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="salida-insumo"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "insumo_pintura", accion: "crear_consumo" },
              ]}
            >
              <SalidaInsumo />
            </PrivateRoute>
          }
        />
        <Route
          path="historial-movimiento"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "insumo_pintura", accion: "crear_consumo" },
              ]}
            >
              <HistorialMovimiento />
            </PrivateRoute>
          }
        />
        <Route
          path="listar-inventario"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "insumo_pintura", accion: "crear_consumo" },
              ]}
            >
              <ListarInventario />
            </PrivateRoute>
          }
        />
        <Route
          path="crear-insumo"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "insumo_pintura", accion: "crear_consumo" },
              ]}
            >
              <CrearInsumo />
            </PrivateRoute>
          }
        />
        <Route
          path="editar-insumo"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "insumo_pintura", accion: "crear_consumo" },
              ]}
            >
              <EditarInsumo />
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
              { modulo: "gestion_productiva", accion: "gestion_justificantes" },
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
                {
                  modulo: "gestion_productiva",
                  accion: "gestion_justificantes",
                },
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
                {
                  modulo: "gestion_productiva",
                  accion: "gestion_justificantes",
                },
              ]}
            >
              <EditarJustificante />
            </PrivateRoute>
          }
        />
      </Route>

      {/* 
        Módulo - Gestión de Usuarios
        EL PADRE: Requiere el permiso ver_usuarios del módulo gestion_usuarios
      */}
      <Route
        path="/gestion-usuarios"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "gestion_usuarios", accion: "ver_usuarios" },
            ]}
            requireAnyPermission={true}
          >
            <GestionUsuarios />
          </PrivateRoute>
        }
      >
        <Route
          path="registrar-usuario"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "gestion_usuarios", accion: "crear_editar" },
              ]}
            >
              <RegistrarUsuario />
            </PrivateRoute>
          }
        />
        <Route
          path="editar-usuario/:id"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "gestion_usuarios", accion: "crear_editar" },
              ]}
            >
              <EditarUsuario />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};
