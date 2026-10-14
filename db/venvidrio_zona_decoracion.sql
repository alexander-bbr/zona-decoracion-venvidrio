-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-10-2026 a las 13:29:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `venvidrio_zona_decoracion`
--
CREATE DATABASE IF NOT EXISTS `venvidrio_zona_decoracion` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `venvidrio_zona_decoracion`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_productiva_cabecera`
--

CREATE TABLE `gestion_productiva_cabecera` (
  `id_cabecera` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `turno` int(10) NOT NULL,
  `tecnico` varchar(150) NOT NULL,
  `cant_envases_d1` int(11) DEFAULT NULL,
  `cant_envases_d2` int(11) DEFAULT NULL,
  `cant_envases_d3` int(11) DEFAULT NULL,
  `cant_envases_d4` int(11) DEFAULT NULL,
  `total_envases` int(11) DEFAULT NULL,
  `total_gruesas` decimal(12,2) DEFAULT NULL,
  `grupo` varchar(10) DEFAULT NULL,
  `tipo_turno` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_productiva_cabecera`
--

INSERT INTO `gestion_productiva_cabecera` (`id_cabecera`, `fecha`, `turno`, `tecnico`, `cant_envases_d1`, `cant_envases_d2`, `cant_envases_d3`, `cant_envases_d4`, `total_envases`, `total_gruesas`, `grupo`, `tipo_turno`) VALUES
(1, '2026-09-01', 1, 'Miguel Bethancourt', 50000, 10000, 0, 0, 60000, 416.67, 'A', '2 Turnos'),
(2, '2026-09-02', 1, 'Daniel Pérez', 50000, 55600, 0, 0, 105600, 733.33, 'A', '2 Turnos'),
(3, '2026-09-03', 1, 'Daniel Pérez', 15000, 10000, 0, 0, 25000, 173.61, 'A', '3 Turnos'),
(4, '2026-09-04', 2, 'Miguel Bethancourt', 15000, 20000, 0, 0, 35000, 243.06, 'B', '3 Turnos'),
(5, '2026-09-05', 3, 'Fabio Romero', 30000, 15000, 0, 0, 45000, 312.50, 'C', '3 Turnos'),
(6, '2026-09-06', 3, 'Fabio Romero', 15000, 10000, 0, 0, 25000, 173.61, 'B', '3 Turnos'),
(7, '2026-09-07', 1, 'Miguel Bethancourt', 30000, 10000, 0, 0, 40000, 277.78, 'B', '2 Turnos'),
(8, '2026-09-08', 1, 'Daniel Pérez', 9000, 5000, 0, 0, 14000, 97.22, 'A', '2 Turnos'),
(9, '2026-09-09', 2, 'Daniel Pérez', 10000, 10000, 0, 0, 20000, 138.89, 'B', '3 Turnos'),
(10, '2026-09-10', 1, 'Miguel Bethancourt', 50000, 25000, 0, 0, 75000, 520.83, 'A', '2 Turnos'),
(11, '2026-09-11', 1, 'Jose Faria', 20000, 20000, 0, 0, 40000, 277.78, 'A', '2 Turnos'),
(12, '2026-09-12', 1, 'Jose Faria', 50000, 50000, 0, 0, 100000, 694.44, 'B', '2 Turnos'),
(13, '2026-09-13', 3, 'Jose Faria', 25000, 15000, 0, 0, 40000, 277.78, 'D', '3 Turnos'),
(14, '2026-09-14', 2, 'Jose Faria', 10000, 0, 0, 0, 10000, 69.44, 'B', '2 Turnos'),
(15, '2026-09-15', 1, 'Fabio Romero', 90000, 10000, 0, 0, 100000, 694.44, 'B', '2 Turnos'),
(16, '2026-09-16', 1, 'Miguel Bethancourt', 47500, 13000, 0, 0, 60500, 420.14, 'B', '3 Turnos'),
(17, '2026-09-17', 3, 'Daniel Pérez', 25000, 25000, 0, 0, 50000, 347.22, 'D', '3 Turnos'),
(18, '2026-09-18', 3, 'Daniel Pérez', 29050, 18000, 0, 0, 47050, 326.74, 'C', '3 Turnos'),
(19, '2026-09-19', 1, 'Fabio Romero', 32000, 8000, 0, 0, 40000, 277.78, 'C', '2 Turnos'),
(20, '2026-09-20', 1, 'Miguel Bethancourt', 105600, 0, 0, 0, 105600, 733.33, 'A', '2 Turnos'),
(21, '2026-09-21', 1, 'Jose Faria', 98000, 0, 0, 0, 98000, 680.56, 'B', '2 Turnos'),
(22, '2026-09-22', 1, 'Miguel Bethancourt', 105000, 0, 0, 0, 105000, 729.17, 'A', '2 Turnos'),
(23, '2026-09-23', 1, 'Miguel Bethancourt', 58000, 0, 0, 0, 58000, 402.78, 'A', '2 Turnos'),
(24, '2026-09-24', 1, 'Fabio Romero', 10000, 0, 0, 0, 10000, 69.44, 'B', '2 Turnos'),
(25, '2026-09-25', 1, 'Fabio Romero', 67000, 0, 0, 0, 67000, 465.28, 'A', '2 Turnos'),
(26, '2026-09-26', 2, 'Fabio Romero', 27000, 0, 0, 0, 27000, 187.50, 'D', '3 Turnos'),
(27, '2026-09-27', 1, 'Jose Faria', 200000, 0, 0, 0, 200000, 1388.89, 'A', '2 Turnos'),
(28, '2026-09-28', 2, 'Jose Faria', 98000, 0, 0, 0, 98000, 680.56, 'A', '2 Turnos'),
(29, '2026-09-29', 2, 'Miguel Bethancourt', 225000, 0, 0, 0, 225000, 1562.50, 'B', '3 Turnos'),
(30, '2026-09-30', 1, 'Daniel Pérez', 100000, 0, 0, 0, 100000, 694.44, 'A', '2 Turnos'),
(31, '2026-10-13', 1, 'Daniel Pérez', 2, 0, 0, 0, 2, 0.01, 'A', '2 Turnos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_productiva_entrada`
--

CREATE TABLE `gestion_productiva_entrada` (
  `id_entrada` int(11) NOT NULL,
  `id_cabecera` int(11) NOT NULL,
  `maquina` int(11) NOT NULL,
  `id_molde` int(11) NOT NULL,
  `cant_envases` int(11) NOT NULL,
  `hora_entrada` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_productiva_entrada`
--

INSERT INTO `gestion_productiva_entrada` (`id_entrada`, `id_cabecera`, `maquina`, `id_molde`, `cant_envases`, `hora_entrada`) VALUES
(338, 1, 1, 6, 50000, '00:00'),
(339, 1, 2, 5, 10000, '00:00'),
(358, 3, 1, 6, 15000, '00:00'),
(359, 3, 2, 6, 10000, '00:00'),
(360, 4, 1, 5, 15000, '00:00'),
(361, 4, 2, 6, 20000, '00:00'),
(364, 6, 1, 1, 15000, '16:54'),
(365, 6, 2, 1, 10000, '18:54'),
(366, 7, 1, 6, 30000, '15:14'),
(367, 7, 2, 4, 10000, '18:15'),
(370, 9, 1, 4, 10000, '20:33'),
(371, 9, 2, 6, 10000, '18:33'),
(372, 10, 1, 6, 50000, '09:11'),
(373, 10, 2, 5, 25000, '09:14'),
(374, 11, 1, 6, 20000, '10:19'),
(375, 11, 2, 6, 20000, '10:19'),
(378, 5, 1, 4, 30000, '00:00'),
(379, 5, 2, 2, 15000, '00:00'),
(380, 2, 1, 6, 50000, '19:09'),
(381, 2, 2, 6, 55600, '19:09'),
(382, 8, 1, 5, 9000, '18:18'),
(383, 8, 2, 5, 5000, '19:18'),
(384, 13, 1, 1, 25000, '22:34'),
(385, 13, 2, 1, 15000, '22:34'),
(386, 14, 1, 4, 10000, '10:36'),
(387, 15, 1, 6, 90000, '10:37'),
(388, 15, 2, 6, 10000, '10:37'),
(389, 12, 1, 2, 50000, '10:31'),
(390, 12, 2, 2, 50000, '10:31'),
(391, 16, 1, 6, 47500, '10:38'),
(392, 16, 2, 6, 13000, '10:38'),
(395, 17, 1, 2, 25000, '22:40'),
(396, 17, 2, 2, 25000, '22:40'),
(397, 18, 1, 6, 29050, '10:42'),
(398, 18, 2, 6, 18000, '10:42'),
(399, 19, 1, 6, 32000, '10:42'),
(400, 19, 2, 6, 8000, '10:43'),
(401, 20, 1, 6, 105600, '00:00'),
(403, 21, 1, 6, 98000, '12:45'),
(404, 22, 1, 4, 105000, '00:00'),
(405, 23, 1, 6, 58000, '10:50'),
(406, 24, 1, 1, 10000, '00:00'),
(407, 25, 1, 6, 67000, '00:00'),
(408, 26, 1, 6, 27000, '22:54'),
(409, 27, 1, 1, 200000, '00:00'),
(410, 28, 1, 5, 98000, '00:00'),
(411, 29, 1, 4, 75000, '10:57'),
(412, 29, 1, 5, 150000, '22:57'),
(419, 30, 1, 6, 100000, '22:59'),
(421, 31, 1, 6, 2, '00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_productiva_resultado`
--

CREATE TABLE `gestion_productiva_resultado` (
  `id_resultado` int(11) NOT NULL,
  `id_cabecera` int(11) NOT NULL,
  `total_gruesas_lisas` decimal(12,2) DEFAULT 0.00,
  `total_envases_lisos` int(11) DEFAULT 0,
  `total_gruesas_decoradas` decimal(12,2) DEFAULT 0.00,
  `total_envases_decorados` int(11) DEFAULT 0,
  `total_envases_perdidos` int(11) DEFAULT 0,
  `total_gruesas_perdidas` decimal(12,2) DEFAULT 0.00,
  `eficiencia_productiva` decimal(5,2) DEFAULT 0.00,
  `deficiencia_productiva` decimal(5,2) DEFAULT 0.00,
  `observaciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_productiva_resultado`
--

INSERT INTO `gestion_productiva_resultado` (`id_resultado`, `id_cabecera`, `total_gruesas_lisas`, `total_envases_lisos`, `total_gruesas_decoradas`, `total_envases_decorados`, `total_envases_perdidos`, `total_gruesas_perdidas`, `eficiencia_productiva`, `deficiencia_productiva`, `observaciones`) VALUES
(289, 1, 48.89, 7040, 349.56, 50336, 9664, 67.11, 83.89, 16.11, 'TUTU'),
(290, 2, 24.44, 3520, 708.89, 102080, 3520, 24.44, 96.67, 3.33, 'Estoy probando el nuevo guardado'),
(291, 3, 122.22, 17600, 171.11, 24640, 360, 2.50, 98.56, 1.44, 'ggg'),
(292, 4, 78.83, 11352, 234.67, 33792, 1208, 8.39, 96.55, 3.45, ''),
(293, 5, 66.21, 9534, 291.11, 41920, 3080, 21.39, 93.16, 6.84, ''),
(294, 6, 39.93, 5750, 159.72, 23000, 2000, 13.89, 92.00, 8.00, ''),
(295, 7, 0.00, 0, 255.44, 36784, 3216, 22.33, 91.96, 8.04, 'dd'),
(296, 8, 0.00, 0, 78.83, 11352, 2648, 18.39, 81.09, 18.91, ''),
(297, 9, 0.00, 0, 129.56, 18656, 1344, 9.33, 93.28, 6.72, ''),
(298, 10, 0.00, 0, 475.44, 68464, 6536, 45.39, 91.29, 8.71, 'Posibles daños'),
(299, 11, 0.00, 0, 244.44, 35200, 4800, 33.33, 88.00, 12.00, ''),
(300, 12, 119.79, 17250, 598.96, 86250, 13750, 95.49, 86.25, 13.75, ''),
(301, 13, 0.00, 0, 199.65, 28750, 11250, 78.13, 71.88, 28.13, ''),
(302, 14, 0.00, 0, 52.56, 7568, 2432, 16.89, 75.68, 24.32, ''),
(303, 15, 244.44, 35200, 611.11, 88000, 12000, 83.33, 88.00, 12.00, ''),
(304, 16, 48.89, 7040, 415.56, 59840, 660, 4.58, 98.91, 1.09, ''),
(305, 17, 678.82, 97750, 319.44, 46000, 4000, 27.78, 92.00, 8.00, 'Alta cantidad de Producción Lisa por exceso de carga de Zona Caliente'),
(306, 18, 0.00, 0, 317.78, 45760, 1290, 8.96, 97.26, 2.74, ''),
(307, 19, 0.00, 0, 268.89, 38720, 1280, 8.89, 96.80, 3.20, ''),
(308, 20, 0.00, 0, 733.33, 105600, 0, 0.00, 100.00, 0.00, 'Tuvimos 100% de eficiencia de decoración. Ha sido un éxito rotundo'),
(309, 21, 0.00, 0, 611.11, 88000, 10000, 69.44, 89.80, 10.20, ''),
(310, 22, 210.22, 30272, 656.94, 94600, 10400, 72.22, 90.10, 9.90, ''),
(311, 23, 0.00, 0, 97.78, 14080, 43920, 305.00, 24.28, 75.72, 'Ocurrieron diferentes problemas durante el proceso de decoración'),
(312, 24, 39.93, 5750, 39.93, 5750, 4250, 29.51, 57.50, 42.50, ''),
(313, 25, 73.33, 10560, 366.67, 52800, 14200, 98.61, 78.81, 21.19, ''),
(314, 26, 24.44, 3520, 171.11, 24640, 2360, 16.39, 91.26, 8.74, ''),
(315, 27, 0.00, 0, 1357.64, 195500, 4500, 31.25, 97.75, 2.25, ''),
(316, 28, 367.89, 52976, 656.94, 94600, 3400, 23.61, 96.53, 3.47, ''),
(317, 29, 394.17, 56760, 1445.28, 208120, 16880, 117.22, 92.50, 7.50, ''),
(318, 30, 122.22, 17600, 48.89, 7040, 92960, 645.56, 7.04, 92.96, ''),
(319, 31, 0.00, 0, 122.22, 17600, 0, 0.00, 100.00, 0.00, '\n\n\n');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_productiva_salida`
--

CREATE TABLE `gestion_productiva_salida` (
  `id_eficiencia` int(11) NOT NULL,
  `modelo_molde` int(11) NOT NULL,
  `id_cabecera` int(11) NOT NULL,
  `total_paletas_molde` int(11) DEFAULT 0,
  `cant_paletas_lisas` int(11) DEFAULT NULL,
  `cant_camadas_lisas` int(11) DEFAULT NULL,
  `cant_envases_lisas` int(11) DEFAULT NULL,
  `cant_gruesas_lisas` decimal(10,2) DEFAULT 0.00,
  `cant_paletas_decoradas` int(11) DEFAULT NULL,
  `cant_camadas_decoradas` int(11) DEFAULT NULL,
  `cant_envases_decoradas` int(11) DEFAULT NULL,
  `cant_gruesas_decoradas` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_productiva_salida`
--

INSERT INTO `gestion_productiva_salida` (`id_eficiencia`, `modelo_molde`, `id_cabecera`, `total_paletas_molde`, `cant_paletas_lisas`, `cant_camadas_lisas`, `cant_envases_lisas`, `cant_gruesas_lisas`, `cant_paletas_decoradas`, `cant_camadas_decoradas`, `cant_envases_decoradas`, `cant_gruesas_decoradas`) VALUES
(700, 6, 1, 12, 2, 16, 7040, 48.89, 10, 80, 35200, 244.44),
(701, 5, 1, 4, 0, 0, 0, 0.00, 4, 32, 15136, 105.11),
(715, 6, 3, 12, 5, 40, 17600, 122.22, 7, 56, 24640, 171.11),
(716, 5, 4, 11, 3, 24, 11352, 78.83, 8, 64, 30272, 210.22),
(717, 6, 4, 1, 0, 0, 0, 0.00, 1, 8, 3520, 24.44),
(720, 1, 6, 5, 1, 10, 5750, 39.93, 4, 40, 23000, 159.72),
(721, 6, 7, 4, 0, 0, 0, 0.00, 4, 32, 14080, 97.78),
(722, 4, 7, 6, 0, 0, 0, 0.00, 6, 48, 22704, 157.67),
(724, 4, 9, 4, 0, 0, 0, 0.00, 4, 32, 15136, 105.11),
(725, 6, 9, 1, 0, 0, 0, 0.00, 1, 8, 3520, 24.44),
(726, 6, 10, 13, 0, 0, 0, 0.00, 13, 104, 45760, 317.78),
(727, 5, 10, 6, 0, 0, 0, 0.00, 6, 48, 22704, 157.67),
(728, 6, 11, 10, 0, 0, 0, 0.00, 10, 80, 35200, 244.44),
(730, 4, 5, 6, 1, 8, 3784, 26.28, 5, 40, 18920, 131.39),
(731, 2, 5, 5, 1, 10, 5750, 39.93, 4, 40, 23000, 159.72),
(732, 6, 2, 30, 1, 8, 3520, 24.44, 29, 232, 102080, 708.89),
(733, 5, 8, 3, 0, 0, 0, 0.00, 3, 24, 11352, 78.83),
(734, 1, 13, 5, 0, 0, 0, 0.00, 5, 50, 28750, 199.65),
(735, 4, 14, 2, 0, 0, 0, 0.00, 2, 16, 7568, 52.56),
(736, 6, 15, 35, 10, 80, 35200, 244.44, 25, 200, 88000, 611.11),
(737, 2, 12, 18, 3, 30, 17250, 119.79, 15, 150, 86250, 598.96),
(738, 6, 16, 19, 2, 16, 7040, 48.89, 17, 136, 59840, 415.56),
(740, 2, 17, 25, 17, 170, 97750, 678.82, 8, 80, 46000, 319.44),
(741, 6, 18, 13, 0, 0, 0, 0.00, 13, 104, 45760, 317.78),
(742, 6, 19, 11, 0, 0, 0, 0.00, 11, 88, 38720, 268.89),
(743, 6, 20, 30, 0, 0, 0, 0.00, 30, 240, 105600, 733.33),
(745, 6, 21, 25, 0, 0, 0, 0.00, 25, 200, 88000, 611.11),
(746, 4, 22, 33, 8, 64, 30272, 210.22, 25, 200, 94600, 656.94),
(747, 6, 23, 4, 0, 0, 0, 0.00, 4, 32, 14080, 97.78),
(748, 1, 24, 2, 1, 10, 5750, 39.93, 1, 10, 5750, 39.93),
(749, 6, 25, 18, 3, 24, 10560, 73.33, 15, 120, 52800, 366.67),
(750, 6, 26, 8, 1, 8, 3520, 24.44, 7, 56, 24640, 171.11),
(751, 1, 27, 34, 0, 0, 0, 0.00, 34, 340, 195500, 1357.64),
(752, 5, 28, 39, 14, 112, 52976, 367.89, 25, 200, 94600, 656.94),
(753, 4, 29, 20, 2, 16, 7568, 52.56, 18, 144, 68112, 473.00),
(754, 5, 29, 50, 13, 104, 49192, 341.61, 37, 296, 140008, 972.28),
(761, 6, 30, 7, 5, 40, 17600, 122.22, 2, 16, 7040, 48.89),
(763, 6, 31, 5, 0, 0, 0, 0.00, 5, 40, 17600, 122.22);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_insumos`
--

CREATE TABLE `inventario_insumos` (
  `id_insumo` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `articulo` varchar(150) NOT NULL,
  `unidad` varchar(20) NOT NULL,
  `cantidad_actual` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cantidad_minima` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_insumos`
--

INSERT INTO `inventario_insumos` (`id_insumo`, `tipo`, `articulo`, `unidad`, `cantidad_actual`, `cantidad_minima`, `estado`) VALUES
(1, 'Pintura', 'SM 00-0200VT38 Blanco', 'Kilogramo', 100.00, 50.00, 1),
(2, 'Pintura', 'SM 00-2208  - VT azul pepsi', 'Kilogramo', 100.00, 50.00, 1),
(3, 'Pintura', 'SM 00-8255  - TA Rojo', 'Kilogramo', 100.00, 50.00, 1),
(4, 'Malla', 'Malla 230', 'Rollo', 100.00, 50.00, 1),
(5, 'Malla', 'Malla 220', 'Rollo', 100.00, 50.00, 1),
(6, 'Malla', 'Malla 200', 'Rollo', 100.00, 50.00, 1),
(7, 'Malla', 'Malla 165', 'Rollo', 100.00, 50.00, 1),
(8, 'Malla', 'Malla 180', 'Rollo', 100.00, 50.00, 1),
(9, 'Malla', 'Malla 160', 'Rollo', 100.00, 50.00, 1),
(10, 'Malla', 'Malla 325', 'Rollo', 100.00, 50.00, 1),
(11, 'Goma', 'Goma - Decoracion', 'N/A', 100.00, 50.00, 1),
(12, 'Emulsion', 'Emulsion Foteco', '(4Kg)', 100.00, 50.00, 1),
(13, 'Emulsion', 'Emulsion Ferro', '(10Kg)', 100.00, 50.00, 1),
(14, 'Lecitina', 'Lecitina de Soya', 'Pipa', 100.00, 50.00, 1),
(15, 'Pega', 'Pega Hercules (Amarilla)', 'Galon', 100.00, 50.00, 1),
(16, 'Tirro', 'Tirro 1\"', 'N/A', 100.00, 50.00, 1),
(17, 'Tirro', 'Tirro 2\"', 'N/A', 100.00, 50.00, 1),
(18, 'cinta', 'Cinta Plástica de 2\"', 'N/A', 100.00, 50.00, 1),
(19, 'Dicromato', 'Dicromato de Potacio', 'N/A', 100.00, 50.00, 1),
(20, 'Fleje', 'Fleje 1718', 'Rollo', 100.00, 50.00, 1),
(21, 'Stretch', 'Stretch-23-micras', 'Kilogramo', 100.00, 50.00, 1),
(22, 'Cap-Sheet', 'Cap-Sheet', 'Kilogramo', 100.00, 50.00, 1),
(23, 'Plástico Termo', 'TERMOENCOGIBLE DE 24\"', 'Kilogramo', 100.00, 50.00, 1),
(24, 'Plástico Termo', 'TERMOENCOGIBLE DE 28\"', 'Kilogramo', 100.00, 50.00, 1),
(25, 'prueba', 'ggg', 'string', 100.00, 50.00, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_insumos_entrada`
--

CREATE TABLE `inventario_insumos_entrada` (
  `id_inventario_entrada` int(11) NOT NULL,
  `id_insumo` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `encargado` varchar(100) NOT NULL,
  `turno` varchar(20) NOT NULL,
  `grupo` varchar(20) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_insumos_entrada`
--

INSERT INTO `inventario_insumos_entrada` (`id_inventario_entrada`, `id_insumo`, `fecha`, `encargado`, `turno`, `grupo`, `cantidad`) VALUES
(1, 1, '2026-09-13 13:50:29', 'string', 'string', 'string', 5.05),
(2, 2, '2026-09-13 14:15:49', 'string', 'string', 'string', 50.80),
(3, 1, '2026-09-14 15:22:31', '222', 'Turno 1', 'Grupo A', 150.55),
(4, 22, '2026-09-25 18:30:30', '222', 'Turno 1', 'Grupo A', 1.00),
(5, 22, '2026-09-25 18:31:44', '222', 'Turno 1', 'Grupo A', 50.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_insumos_salida`
--

CREATE TABLE `inventario_insumos_salida` (
  `id_inventario_salida` int(11) NOT NULL,
  `id_insumo` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `encargado` varchar(100) NOT NULL,
  `turno` varchar(20) NOT NULL,
  `grupo` varchar(20) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_insumos_salida`
--

INSERT INTO `inventario_insumos_salida` (`id_inventario_salida`, `id_insumo`, `fecha`, `encargado`, `turno`, `grupo`, `cantidad`) VALUES
(1, 1, '2026-09-13 13:51:40', 'string', 'string', 'string', 1.05),
(2, 2, '2026-09-13 14:16:20', 'string', 'string', 'string', 10.86),
(3, 1, '2026-09-14 15:24:57', '222', 'Turno 2', 'Grupo A', 34.00),
(4, 22, '2026-09-25 18:32:16', '222', 'Turno 1', 'Grupo A', 2.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_pantallas`
--

CREATE TABLE `inventario_pantallas` (
  `id_pantalla` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `cantidad_actual` int(11) NOT NULL DEFAULT 0,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_pantallas`
--

INSERT INTO `inventario_pantallas` (`id_pantalla`, `nombre`, `descripcion`, `tipo`, `cantidad_actual`, `estado`) VALUES
(6, 'Pantalla Polar Light', 'Diseño para decoración de botella Polar Light', 'Malla 120T', 0, 1),
(7, 'Pantalla Polarcita 222 ML', 'Diseño para decoración de botella Polarcita 222 ML', 'Malla 120T', 0, 1),
(8, 'Pantalla Golden 350 ML', 'Diseño para decoración de botella Golden 350 ML', 'Malla 150T', 0, 1),
(9, 'Pantalla Pepsi 350 ML', 'Diseño para decoración de botella Pepsi 350 ML', 'Malla 150T', 0, 1),
(10, 'Pantalla Cerveza 330 RET', 'Diseño para decoración de botella Cerveza 330 RET', 'Malla 90T', 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_pantallas_entrada`
--

CREATE TABLE `inventario_pantallas_entrada` (
  `id_inventario_entrada` int(11) NOT NULL,
  `id_pantalla` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `encargado` varchar(100) NOT NULL,
  `turno` varchar(20) NOT NULL,
  `grupo` varchar(20) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_pantallas_entrada`
--

INSERT INTO `inventario_pantallas_entrada` (`id_inventario_entrada`, `id_pantalla`, `fecha`, `encargado`, `turno`, `grupo`, `cantidad`) VALUES
(1, 6, '2026-10-09 21:42:57', 'string', 'string', 'string', 50),
(2, 7, '2026-10-09 21:43:09', 'string', 'string', 'string', 50),
(3, 6, '2026-10-12 19:16:37', '222', 'Turno 1', 'Grupo A', 50),
(4, 8, '2026-10-12 19:16:58', '222', 'Turno 2', 'Grupo C', 50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_pantallas_salida`
--

CREATE TABLE `inventario_pantallas_salida` (
  `id_inventario_salida` int(11) NOT NULL,
  `id_pantalla` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `encargado` varchar(100) NOT NULL,
  `turno` varchar(20) NOT NULL,
  `grupo` varchar(20) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_pantallas_salida`
--

INSERT INTO `inventario_pantallas_salida` (`id_inventario_salida`, `id_pantalla`, `fecha`, `encargado`, `turno`, `grupo`, `cantidad`) VALUES
(1, 6, '2026-10-09 21:43:28', 'string', 'string', 'string', 0),
(2, 6, '2026-10-09 21:43:42', 'string', 'string', 'string', 30),
(3, 7, '2026-10-09 21:43:48', 'string', 'string', 'string', 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `justificantes`
--

CREATE TABLE `justificantes` (
  `id_justificante` int(11) NOT NULL,
  `etiqueta` varchar(150) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `justificantes`
--

INSERT INTO `justificantes` (`id_justificante`, `etiqueta`, `descripcion`) VALUES
(1, 'Desperfecto en el decorado', 'Pérdida por mal decorado de la máquina, envases con imperfecciones visuales'),
(2, 'Rotura por mal cocido', 'Envases quebrados debido a una cocción deficiente en el proceso de fabricación'),
(3, 'Falla mecánica de la máquina', 'Parada de producción ocasionada por avería o mal funcionamiento del equipo'),
(4, 'Material defectuoso', 'Pérdida originada por lote de materia prima en mal estado o fuera de especificación'),
(5, 'Error de operario', 'Pérdida atribuida a manipulación incorrecta del equipo o del proceso por parte del personal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metas_rendimiento`
--

CREATE TABLE `metas_rendimiento` (
  `id_meta` int(11) NOT NULL,
  `anio` int(11) NOT NULL,
  `mes` varchar(20) NOT NULL,
  `deficiencia` decimal(5,2) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metas_rendimiento`
--

INSERT INTO `metas_rendimiento` (`id_meta`, `anio`, `mes`, `deficiencia`, `estado`) VALUES
(1, 2025, 'enero', 85.00, 0),
(2, 2026, 'febrero', 92.00, 0),
(3, 2026, 'marzo', 93.00, 0),
(4, 2026, 'abril', 87.00, 0),
(5, 2026, 'mayo', 75.00, 0),
(6, 2026, 'junio', 85.00, 0),
(7, 2026, 'julio', 89.00, 0),
(8, 2026, 'agosto', 93.00, 0),
(9, 2026, 'diciembre', 91.00, 1),
(10, 2026, 'octubre', 5.00, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `moldes`
--

CREATE TABLE `moldes` (
  `id_molde` int(11) NOT NULL,
  `Nombre` varchar(150) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `numero_camadas` int(11) NOT NULL,
  `numero_envases` int(11) NOT NULL,
  `numero_gruesas` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `moldes`
--

INSERT INTO `moldes` (`id_molde`, `Nombre`, `Descripcion`, `numero_camadas`, `numero_envases`, `numero_gruesas`) VALUES
(1, 'GX01944', 'POLAR LIGHT', 10, 5750, 39.93),
(2, 'GX01944', 'POLARCITA 222 ML', 10, 5750, 39.93),
(4, 'GV02156', 'GOLDEN 350 ML', 8, 3784, 26.28),
(5, 'GV02156', 'PEPSI 350 ML', 8, 3784, 26.28),
(6, 'GX01335', 'CERVEZA 330,0 RET.', 8, 3520, 24.44);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos_modulos`
--

CREATE TABLE `permisos_modulos` (
  `id_permisom` int(11) NOT NULL,
  `modulo` varchar(100) NOT NULL,
  `accion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos_modulos`
--

INSERT INTO `permisos_modulos` (`id_permisom`, `modulo`, `accion`) VALUES
(1, 'inventario_insumos', 'ver_inventario'),
(2, 'inventario_insumos', 'entrada_insumos'),
(3, 'inventario_insumos', 'salida_insumos'),
(4, 'rendimiento', 'ver'),
(5, 'gestion_usuarios', 'ver_usuarios'),
(6, 'gestion_usuarios', 'crear_editar'),
(7, 'inventario_insumos', 'historial_movimientos'),
(8, 'gestion_productiva', 'registrar_produccion'),
(9, 'gestion_productiva', 'ver_produccion'),
(10, 'gestion_productiva', 'editar'),
(11, 'gestion_productiva', 'gestion_moldes'),
(12, 'gestion_productiva', 'gestion_justificantes'),
(13, 'inventario_insumos', 'gestion_insumos'),
(14, 'inventario_pantallas', 'ver_inventario'),
(15, 'inventario_pantallas', 'entrada_pantallas'),
(16, 'inventario_pantallas', 'salida_pantallas'),
(17, 'inventario_pantallas', 'historial_movimientos'),
(18, 'inventario_pantallas', 'gestion_pantallas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos_usuarios`
--

CREATE TABLE `permisos_usuarios` (
  `id_permisou` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_permisom` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos_usuarios`
--

INSERT INTO `permisos_usuarios` (`id_permisou`, `id_usuario`, `id_permisom`) VALUES
(564, 13, 1),
(565, 13, 2),
(566, 13, 3),
(567, 13, 4),
(568, 13, 5),
(569, 13, 6),
(570, 13, 7),
(571, 13, 8),
(572, 13, 9),
(573, 13, 10),
(574, 13, 11),
(575, 13, 12),
(576, 13, 13),
(577, 13, 14),
(578, 13, 15),
(579, 13, 16),
(580, 13, 17),
(581, 13, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion_justificantes`
--

CREATE TABLE `produccion_justificantes` (
  `id_cabecera` int(11) NOT NULL,
  `modelo_molde` int(11) NOT NULL,
  `id_justificante` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `produccion_justificantes`
--

INSERT INTO `produccion_justificantes` (`id_cabecera`, `modelo_molde`, `id_justificante`) VALUES
(1, 6, 4),
(2, 6, 5),
(10, 5, 5),
(10, 6, 1),
(11, 6, 3),
(12, 2, 2),
(13, 1, 1),
(14, 4, 4),
(15, 6, 2),
(16, 6, 3),
(17, 2, 1),
(21, 6, 3),
(23, 6, 1),
(23, 6, 2),
(23, 6, 3),
(23, 6, 4),
(25, 6, 5),
(27, 1, 1),
(30, 6, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `carnet_usuario` varchar(20) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) NOT NULL,
  `rol` enum('administrador','operador') NOT NULL,
  `activo_usuario` tinyint(1) NOT NULL DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `cedula`, `carnet_usuario`, `contrasena`, `nombres`, `apellidos`, `telefono`, `correo`, `rol`, `activo_usuario`, `creado_en`) VALUES
(13, '30670857', '111', '$argon2id$v=19$m=65536,t=3,p=4$Q3u6fMBXG8gEHQIhfGUojg$Drm1LW+20g2J02h0dyKaQEoNoYJ8+oNb1zDS19NnQuI', 'Daniel', 'Perez', '04167383181', 'd30670857@gmail.com', 'administrador', 1, '2026-10-11 19:30:27');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `gestion_productiva_cabecera`
--
ALTER TABLE `gestion_productiva_cabecera`
  ADD PRIMARY KEY (`id_cabecera`);

--
-- Indices de la tabla `gestion_productiva_entrada`
--
ALTER TABLE `gestion_productiva_entrada`
  ADD PRIMARY KEY (`id_entrada`),
  ADD KEY `id_produccion` (`id_cabecera`),
  ADD KEY `id_molde` (`id_molde`);

--
-- Indices de la tabla `gestion_productiva_resultado`
--
ALTER TABLE `gestion_productiva_resultado`
  ADD PRIMARY KEY (`id_resultado`),
  ADD KEY `fk_resultado_produccion` (`id_cabecera`);

--
-- Indices de la tabla `gestion_productiva_salida`
--
ALTER TABLE `gestion_productiva_salida`
  ADD PRIMARY KEY (`id_eficiencia`),
  ADD KEY `fk_salida_molde` (`modelo_molde`),
  ADD KEY `fk_salida_produccion` (`id_cabecera`);

--
-- Indices de la tabla `inventario_insumos`
--
ALTER TABLE `inventario_insumos`
  ADD PRIMARY KEY (`id_insumo`);

--
-- Indices de la tabla `inventario_insumos_entrada`
--
ALTER TABLE `inventario_insumos_entrada`
  ADD PRIMARY KEY (`id_inventario_entrada`),
  ADD KEY `id_insumo` (`id_insumo`);

--
-- Indices de la tabla `inventario_insumos_salida`
--
ALTER TABLE `inventario_insumos_salida`
  ADD PRIMARY KEY (`id_inventario_salida`),
  ADD KEY `id_insumo` (`id_insumo`);

--
-- Indices de la tabla `inventario_pantallas`
--
ALTER TABLE `inventario_pantallas`
  ADD PRIMARY KEY (`id_pantalla`);

--
-- Indices de la tabla `inventario_pantallas_entrada`
--
ALTER TABLE `inventario_pantallas_entrada`
  ADD PRIMARY KEY (`id_inventario_entrada`),
  ADD KEY `id_pantalla` (`id_pantalla`);

--
-- Indices de la tabla `inventario_pantallas_salida`
--
ALTER TABLE `inventario_pantallas_salida`
  ADD PRIMARY KEY (`id_inventario_salida`),
  ADD KEY `id_pantalla` (`id_pantalla`);

--
-- Indices de la tabla `justificantes`
--
ALTER TABLE `justificantes`
  ADD PRIMARY KEY (`id_justificante`);

--
-- Indices de la tabla `metas_rendimiento`
--
ALTER TABLE `metas_rendimiento`
  ADD PRIMARY KEY (`id_meta`),
  ADD UNIQUE KEY `uk_anio_mes` (`anio`,`mes`);

--
-- Indices de la tabla `moldes`
--
ALTER TABLE `moldes`
  ADD PRIMARY KEY (`id_molde`);

--
-- Indices de la tabla `permisos_modulos`
--
ALTER TABLE `permisos_modulos`
  ADD PRIMARY KEY (`id_permisom`);

--
-- Indices de la tabla `permisos_usuarios`
--
ALTER TABLE `permisos_usuarios`
  ADD PRIMARY KEY (`id_permisou`),
  ADD KEY `id_ususario` (`id_usuario`),
  ADD KEY `id_permisom` (`id_permisom`);

--
-- Indices de la tabla `produccion_justificantes`
--
ALTER TABLE `produccion_justificantes`
  ADD UNIQUE KEY `id_cabecera` (`id_cabecera`,`modelo_molde`,`id_justificante`),
  ADD KEY `modelo_molde` (`modelo_molde`),
  ADD KEY `id_justificante` (`id_justificante`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD UNIQUE KEY `carnet_usuario` (`carnet_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_cabecera`
--
ALTER TABLE `gestion_productiva_cabecera`
  MODIFY `id_cabecera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_entrada`
--
ALTER TABLE `gestion_productiva_entrada`
  MODIFY `id_entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=422;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_resultado`
--
ALTER TABLE `gestion_productiva_resultado`
  MODIFY `id_resultado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=320;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_salida`
--
ALTER TABLE `gestion_productiva_salida`
  MODIFY `id_eficiencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=764;

--
-- AUTO_INCREMENT de la tabla `inventario_insumos`
--
ALTER TABLE `inventario_insumos`
  MODIFY `id_insumo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `inventario_insumos_entrada`
--
ALTER TABLE `inventario_insumos_entrada`
  MODIFY `id_inventario_entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `inventario_insumos_salida`
--
ALTER TABLE `inventario_insumos_salida`
  MODIFY `id_inventario_salida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `inventario_pantallas`
--
ALTER TABLE `inventario_pantallas`
  MODIFY `id_pantalla` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `inventario_pantallas_entrada`
--
ALTER TABLE `inventario_pantallas_entrada`
  MODIFY `id_inventario_entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `inventario_pantallas_salida`
--
ALTER TABLE `inventario_pantallas_salida`
  MODIFY `id_inventario_salida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `justificantes`
--
ALTER TABLE `justificantes`
  MODIFY `id_justificante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `metas_rendimiento`
--
ALTER TABLE `metas_rendimiento`
  MODIFY `id_meta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `moldes`
--
ALTER TABLE `moldes`
  MODIFY `id_molde` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `permisos_modulos`
--
ALTER TABLE `permisos_modulos`
  MODIFY `id_permisom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `permisos_usuarios`
--
ALTER TABLE `permisos_usuarios`
  MODIFY `id_permisou` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=582;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `gestion_productiva_entrada`
--
ALTER TABLE `gestion_productiva_entrada`
  ADD CONSTRAINT `gestion_productiva_entrada_ibfk_1` FOREIGN KEY (`id_cabecera`) REFERENCES `gestion_productiva_cabecera` (`id_cabecera`) ON DELETE CASCADE,
  ADD CONSTRAINT `gestion_productiva_entrada_ibfk_2` FOREIGN KEY (`id_molde`) REFERENCES `moldes` (`id_molde`);

--
-- Filtros para la tabla `gestion_productiva_resultado`
--
ALTER TABLE `gestion_productiva_resultado`
  ADD CONSTRAINT `fk_resultado_produccion` FOREIGN KEY (`id_cabecera`) REFERENCES `gestion_productiva_cabecera` (`id_cabecera`) ON DELETE CASCADE;

--
-- Filtros para la tabla `gestion_productiva_salida`
--
ALTER TABLE `gestion_productiva_salida`
  ADD CONSTRAINT `fk_salida_molde` FOREIGN KEY (`modelo_molde`) REFERENCES `moldes` (`id_molde`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_salida_produccion` FOREIGN KEY (`id_cabecera`) REFERENCES `gestion_productiva_cabecera` (`id_cabecera`) ON DELETE CASCADE;

--
-- Filtros para la tabla `inventario_insumos_entrada`
--
ALTER TABLE `inventario_insumos_entrada`
  ADD CONSTRAINT `inventario_insumos_entrada_ibfk_1` FOREIGN KEY (`id_insumo`) REFERENCES `inventario_insumos` (`id_insumo`);

--
-- Filtros para la tabla `inventario_insumos_salida`
--
ALTER TABLE `inventario_insumos_salida`
  ADD CONSTRAINT `inventario_insumos_salida_ibfk_1` FOREIGN KEY (`id_insumo`) REFERENCES `inventario_insumos` (`id_insumo`);

--
-- Filtros para la tabla `inventario_pantallas_entrada`
--
ALTER TABLE `inventario_pantallas_entrada`
  ADD CONSTRAINT `inventario_pantallas_entrada_ibfk_1` FOREIGN KEY (`id_pantalla`) REFERENCES `inventario_pantallas` (`id_pantalla`);

--
-- Filtros para la tabla `inventario_pantallas_salida`
--
ALTER TABLE `inventario_pantallas_salida`
  ADD CONSTRAINT `inventario_pantallas_salida_ibfk_1` FOREIGN KEY (`id_pantalla`) REFERENCES `inventario_pantallas` (`id_pantalla`);

--
-- Filtros para la tabla `permisos_usuarios`
--
ALTER TABLE `permisos_usuarios`
  ADD CONSTRAINT `permisos_usu
arios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `permisos_usu
arios_ibfk_2` FOREIGN KEY (`id_permisom`) REFERENCES `permisos_modulos` (`id_permisom`);

--
-- Filtros para la tabla `produccion_justificantes`
--
ALTER TABLE `produccion_justificantes`
  ADD CONSTRAINT `produccion_justificantes_ibfk_1` FOREIGN KEY (`id_cabecera`) REFERENCES `gestion_productiva_cabecera` (`id_cabecera`) ON DELETE CASCADE,
  ADD CONSTRAINT `produccion_justificantes_ibfk_2` FOREIGN KEY (`modelo_molde`) REFERENCES `moldes` (`id_molde`),
  ADD CONSTRAINT `produccion_justificantes_ibfk_3` FOREIGN KEY (`id_justificante`) REFERENCES `justificantes` (`id_justificante`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
