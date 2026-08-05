import { Routes, Route } from "react-router-dom";

// Módulo - Dashboard
import { Dashboard } from "../modules/Dashboard";

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

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Módulo - Consumo de Pintura */}
      <Route path="/consumo-pintura" element={<ConsumoDePintura />}>
        <Route path="consumir" element={<ConsumirPintura />} />
        <Route path="suministrar" element={<SuministrarPintura />} />
        <Route path="historial-consumo" element={<HistorialConsumo />} />
        <Route path="inventario" element={<InventarioPintura />} />
      </Route>

      {/* Módulo - Dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Módulo - Producción Lisa */}
      <Route path="/produccion-lisa" element={<ProduccionLisa />}>
        <Route path="registrar" element={<RegistrarProduccionLisa />} />
        <Route path="consumir" element={<ConsumirProduccionLisa />} />
        <Route path="historial" element={<HistorialProduccionLisa />} />
        <Route path="inventario" element={<InventarioProduccionLisa />} />
      </Route>

      {/* Módulo - Gestión de Usuarios */}
      <Route path="/gestion-usuarios" element={<Usuarios />}></Route>
    </Routes>
  );
};
