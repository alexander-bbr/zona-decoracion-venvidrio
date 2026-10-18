import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

// Módulo - Inicio
import { Home } from "../modules/Home";

// Módulo - Rendimiento
import { Rendimiento } from "../modules/Rendimiento";
import { Metas } from "../modules/Rendimiento/Metas";
import { RegistrarMeta } from "../modules/Rendimiento/Metas/RegistrarMeta";
import { EditarMeta } from "../modules/Rendimiento/Metas/EditarMeta";

// Módulo - Inventario de Insumos
import { InventarioInsumos } from "../modules/InventarioInsumos";
import { RegistroInsumo } from "../modules/InventarioInsumos/RegistroInsumo";
import { SalidaInsumo } from "../modules/InventarioInsumos/SalidaInsumo";
import { VerInventarioInsumos } from "../modules/InventarioInsumos/VerInventarioInsumos";
import { HistorialMovimientoInsumos } from "../modules/InventarioInsumos/HistorialMovimientoInsumos";
import { GestionInsumos } from "../modules/InventarioInsumos/GestionInsumos";
import { CrearInsumo } from "../modules/InventarioInsumos/GestionInsumos/CrearInsumo";
import { EditarInsumo } from "../modules/InventarioInsumos/GestionInsumos/EditarInsumo";

// Módulo - Inventario de Pantallas
import { InventarioPantallas } from "../modules/InventarioPantallas";
import { RegistroPantalla } from "../modules/InventarioPantallas/RegistroPantalla";
import { SalidaPantalla } from "../modules/InventarioPantallas/SalidaPantalla";
import { VerInventarioPantallas } from "../modules/InventarioPantallas/VerInventarioPantallas";
import { HistorialMovimientoPantallas } from "../modules/InventarioPantallas/HistorialMovimientoPantallas";
import { GestionPantallas } from "../modules/InventarioPantallas/GestionPantallas";
import { CrearPantalla } from "../modules/InventarioPantallas/GestionPantallas/CrearPantalla";
import { EditarPantalla } from "../modules/InventarioPantallas/GestionPantallas/EditarPantalla";

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

      {/* Módulo - Rendimiento - Requiere permiso rendimiento.ver */}
      <Route
        path="/rendimiento"
        element={
          <PrivateRoute
            requiredPermissions={[{ modulo: "rendimiento", accion: "ver" }]}
          >
            <Rendimiento />
          </PrivateRoute>
        }
      >
        {/* Submódulo - Metas */}
        <Route
          path="metas"
          element={
            <PrivateRoute
              requiredPermissions={[{ modulo: "rendimiento", accion: "ver" }]}
            >
              <Metas />
            </PrivateRoute>
          }
        >
          {/* Registrar Meta */}
          <Route
            path="registrar-meta"
            element={
              <PrivateRoute
                requiredPermissions={[{ modulo: "rendimiento", accion: "ver" }]}
              >
                <RegistrarMeta />
              </PrivateRoute>
            }
          />
          {/* Editar Meta */}
          <Route
            path="editar-meta/:id"
            element={
              <PrivateRoute
                requiredPermissions={[{ modulo: "rendimiento", accion: "ver" }]}
              >
                <EditarMeta />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>

      {/* 
        Módulo - Inventario de Insumos - Requiere al menos un permiso de inventario_insumos
      */}
      <Route
        path="/inventario-insumos"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "inventario_insumos", accion: "ver_inventario" },
            ]}
            // Usamos requireAnyPermission para que permita si tiene AL MENOS UNO
            requireAnyPermission={true}
          >
            <InventarioInsumos />
          </PrivateRoute>
        }
      >
        {/* Registro de Insumo */}
        <Route
          path="registro-insumo"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "inventario_insumos", accion: "entrada_insumos" },
              ]}
            >
              <RegistroInsumo />
            </PrivateRoute>
          }
        ></Route>
        {/* Salida de Insumo */}
        <Route
          path="salida-insumo"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "inventario_insumos", accion: "salida_insumos" },
              ]}
            >
              <SalidaInsumo />
            </PrivateRoute>
          }
        />
        {/* Historial de Movimiento */}
        <Route
          path="historial-movimiento"
          element={
            <PrivateRoute
              requiredPermissions={[
                {
                  modulo: "inventario_insumos",
                  accion: "historial_movimientos",
                },
              ]}
            >
              <HistorialMovimientoInsumos />
            </PrivateRoute>
          }
        />
        {/* Ver Inventario */}
        <Route
          path="ver-inventario"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "inventario_insumos", accion: "ver_inventario" },
              ]}
            >
              <VerInventarioInsumos />
            </PrivateRoute>
          }
        />
        {/* Gestión de Insumos */}
        <Route
          path="gestion-insumos"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "inventario_insumos", accion: "gestion_insumos" },
              ]}
            >
              <GestionInsumos />
            </PrivateRoute>
          }
        >
          {/* Crear Insumo */}
          <Route
            path="crear-insumo"
            element={
              <PrivateRoute
                requiredPermissions={[
                  { modulo: "inventario_insumos", accion: "gestion_insumos" },
                ]}
              >
                <CrearInsumo />
              </PrivateRoute>
            }
          />
          {/* Editar Insumo */}
          <Route
            path="editar-insumo/:id"
            element={
              <PrivateRoute
                requiredPermissions={[
                  { modulo: "inventario_insumos", accion: "gestion_insumos" },
                ]}
              >
                <EditarInsumo />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>

      {/* 
        Módulo - Inventario de Pantallas - Requiere al menos un permiso de inventario_pantallas
      */}
      <Route
        path="/inventario-pantallas"
        element={
          <PrivateRoute
            requiredPermissions={[
              { modulo: "inventario_pantallas", accion: "ver_inventario" },
            ]}
            // Usamos requireAnyPermission para que permita si tiene AL MENOS UNO
            requireAnyPermission={true}
          >
            <InventarioPantallas />
          </PrivateRoute>
        }
      >
        {/* Registro de Pantalla */}
        <Route
          path="registro-pantalla"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "inventario_pantallas", accion: "entrada_pantallas" },
              ]}
            >
              <RegistroPantalla />
            </PrivateRoute>
          }
        ></Route>
        {/* Salida de Pantalla */}
        <Route
          path="salida-pantalla"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "inventario_pantallas", accion: "salida_pantallas" },
              ]}
            >
              <SalidaPantalla />
            </PrivateRoute>
          }
        />
        {/* Historial de Movimiento */}
        <Route
          path="historial-movimiento"
          element={
            <PrivateRoute
              requiredPermissions={[
                {
                  modulo: "inventario_pantallas",
                  accion: "historial_movimientos",
                },
              ]}
            >
              <HistorialMovimientoPantallas />
            </PrivateRoute>
          }
        />
        {/* Ver Inventario */}
        <Route
          path="ver-inventario"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "inventario_pantallas", accion: "ver_inventario" },
              ]}
            >
              <VerInventarioPantallas />
            </PrivateRoute>
          }
        />
        {/* Gestión de Pantallas */}
        <Route
          path="gestion-pantallas"
          element={
            <PrivateRoute
              requiredPermissions={[
                { modulo: "inventario_pantallas", accion: "gestion_pantallas" },
              ]}
            >
              <GestionPantallas />
            </PrivateRoute>
          }
        >
          {/* Crear Pantalla */}
          <Route
            path="crear-pantalla"
            element={
              <PrivateRoute
                requiredPermissions={[
                  {
                    modulo: "inventario_pantallas",
                    accion: "gestion_pantallas",
                  },
                ]}
              >
                <CrearPantalla />
              </PrivateRoute>
            }
          />
          {/* Editar Pantalla */}
          <Route
            path="editar-pantalla/:id"
            element={
              <PrivateRoute
                requiredPermissions={[
                  {
                    modulo: "inventario_pantallas",
                    accion: "gestion_pantallas",
                  },
                ]}
              >
                <EditarPantalla />
              </PrivateRoute>
            }
          />
        </Route>
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
          path="editar-produccion/:id"
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
          path="editar-molde/:item"
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
