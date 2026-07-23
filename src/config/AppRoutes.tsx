import { Routes, Route } from "react-router-dom";

// Módulo - Dashboard
import { Dashboard } from "../modules/Dashboard";

// Módulo - Consumo de Pintura
import { ConsumoDePintura } from "../modules/CuartoDePantalla/ConsumoDePintura";
import { ConsumirPintura } from "../modules/CuartoDePantalla/ConsumoDePintura/ConsumirPintura";
import { SuministrarPintura } from "../modules/CuartoDePantalla/ConsumoDePintura/SuministrarPintura";
import { InventarioPintura } from "../modules/CuartoDePantalla/ConsumoDePintura/InventarioPintura";
import { HistorialConsumo } from "../modules/CuartoDePantalla/ConsumoDePintura/HistorialConsumo";

// Módulo - Gestión de Usuarios
import { Usuarios } from "../modules/Usuarios";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Módulo - Consumo de Pintura */}
      <Route path="/consumo-pintura" element={<ConsumoDePintura />}>
        <Route path="consumir" element={<ConsumirPintura />} />
        <Route path="suministrar" element={<SuministrarPintura />} />
        <Route path="historialconsumo" element={<HistorialConsumo />} />
        <Route path="inventario" element={<InventarioPintura />} />
      </Route>

      {/* Módulo - Dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Módulo - Gestión de Usuarios */}
      <Route path="/gestion-usuarios" element={<Usuarios />}></Route>
    </Routes>
  );
};
