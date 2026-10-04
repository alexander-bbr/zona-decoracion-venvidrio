-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-10-2026 a las 23:44:13
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
(286, '2026-10-03', 3, 'Luis Gómez', 0, 15300, 0, 15400, 30700, 213.19, 'Grupo C', 'Noche'),
(287, '2026-10-05', 1, 'Carlos Mendoza', 15500, 0, 15500, 0, 31000, 215.28, 'Grupo A', 'Mañana'),
(288, '2026-10-06', 2, 'María Rodríguez', 0, 15200, 0, 15200, 30400, 211.11, 'Grupo B', 'Tarde'),
(290, '2026-10-06', 2, 'María Rodríguez', 0, 15200, 0, 15200, 30400, 211.11, 'Grupo B', 'Tarde');

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
(245, 286, 2, 5, 15300, '23:00'),
(246, 286, 4, 6, 15400, '23:30'),
(247, 287, 1, 1, 15500, '07:00'),
(248, 287, 3, 4, 15500, '07:30'),
(249, 288, 2, 2, 15200, '15:00'),
(250, 288, 4, 5, 15200, '15:15'),
(252, 290, 2, 2, 15200, '15:00'),
(253, 290, 4, 5, 15200, '15:15');

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
(284, 286, 0.00, 0, 202.89, 29216, 1484, 10.30, 95.17, 4.83, 'Producción nocturna ajustada a capacidad real de paletas'),
(285, 287, 0.00, 0, 202.89, 29216, 1784, 12.39, 94.25, 5.75, 'Operación continua en máquinas 1 y 3'),
(286, 288, 0.00, 0, 202.89, 29216, 1184, 8.22, 96.11, 3.89, 'Proceso estable en turno de la tarde'),
(287, 290, 0.00, 0, 202.89, 29216, 1184, 8.22, 96.11, 3.89, 'Proceso estable en turno de la tarde');

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
(628, 5, 286, 4, 0, 0, 0, 0.00, 4, 32, 14608, 101.44),
(629, 6, 286, 4, 0, 0, 0, 0.00, 4, 32, 14608, 101.44),
(630, 1, 287, 4, 0, 0, 0, 0.00, 4, 32, 14608, 101.44),
(631, 4, 287, 4, 0, 0, 0, 0.00, 4, 32, 14608, 101.44),
(632, 2, 288, 4, 0, 0, 0, 0.00, 4, 32, 14608, 101.44),
(633, 5, 288, 4, 0, 0, 0, 0.00, 4, 32, 14608, 101.44),
(634, 2, 290, 4, 0, 0, 0, 0.00, 4, 32, 14608, 101.44),
(635, 5, 290, 4, 0, 0, 0, 0.00, 4, 32, 14608, 101.44);

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
(11, 'Goma', 'Goma - Decoracion', 'Und', 100.00, 50.00, 1),
(12, 'Emulsion', 'Emulsion Foteco', 'Unidad (4Kg)', 100.00, 50.00, 1),
(13, 'Emulsion', 'Emulsion Ferro', 'Unidad (10Kg)', 100.00, 50.00, 1),
(14, 'Lecitina', 'Lecitina de Soya', 'Pipa', 100.00, 50.00, 1),
(15, 'Pega', 'Pega Hercules (Amarilla)', 'Galon', 100.00, 50.00, 1),
(16, 'Tirro', 'Tirro 1\"', 'Unidad', 100.00, 50.00, 1),
(17, 'Tirro', 'Tirro 2\"', 'Unidad', 100.00, 50.00, 1),
(18, 'cinta', 'Cinta Plástica de 2\"', 'Unidad', 100.00, 50.00, 1),
(19, 'Dicromato', 'Dicromato de Potacio', 'Unidad', 100.00, 50.00, 1),
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
(11, 'gestion_productiva', 'registrar_produccion'),
(12, 'gestion_productiva', 'ver_produccion'),
(13, 'gestion_productiva', 'editar'),
(14, 'gestion_productiva', 'gestion_moldes'),
(28, 'gestion_productiva', 'gestion_justificantes'),
(29, 'inventario_insumos', 'gestion_insumos');

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
(234, 12, 1),
(235, 12, 2),
(236, 12, 3),
(237, 12, 7),
(238, 12, 4),
(239, 12, 5),
(240, 12, 6),
(241, 12, 11),
(242, 12, 12),
(243, 12, 13),
(244, 12, 14),
(245, 12, 29),
(246, 12, 28),
(283, 10, 5),
(284, 10, 6),
(285, 10, 11),
(286, 10, 12),
(287, 10, 13),
(288, 10, 1),
(289, 10, 2),
(290, 10, 3),
(291, 10, 4),
(292, 10, 28),
(293, 10, 7),
(294, 10, 29),
(295, 10, 14),
(333, 11, 1),
(334, 11, 2),
(335, 11, 3),
(336, 11, 7),
(337, 11, 5),
(338, 11, 6),
(339, 11, 11),
(340, 11, 12),
(341, 11, 13),
(342, 11, 14),
(343, 11, 28),
(344, 11, 29),
(345, 11, 4);

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
(286, 5, 1),
(286, 6, 2),
(287, 1, 1),
(287, 4, 3),
(288, 2, 2),
(288, 5, 4),
(290, 2, 2),
(290, 5, 4);

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
(10, '30670857', '111', '$argon2id$v=19$m=65536,t=3,p=4$CkFIaY1RivHeu9e6NyaEsA$rtdZu3HTE9nKFkeXi/QguC7E5wxIKoaruCOY7ojW17U', 'Daniel Alexander', 'Perez Moreno', '0416-7383181', 'd30670857@gmail.com', 'administrador', 1, '2026-08-09 14:46:05'),
(11, '30717851', '000', '$argon2id$v=19$m=65536,t=3,p=4$iNGa877XmlOqdU5JiRHC2A$K1niqF75/hqWw+7nz6zUnPxkI2rRrju9nDGHqJ8hoBI', 'Miguel Alexander', 'Bethancourt Briceño', '0412-1986816', 'mbethancourt2005@gmail.com', 'administrador', 1, '2026-08-27 01:12:11'),
(12, '30670913', '222', '$argon2id$v=19$m=65536,t=3,p=4$plQq5bw3BmCsNQYgpHTO+Q$obEOZpk7qGRmCP0lfmOYk7ZvAmxLqiDCvNjNRw0wzsw', 'Fabio', 'Romero Vera', '0416-3660482', 'fabioromero7809@gmail.com', 'administrador', 1, '2026-08-27 01:15:12');

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
-- Indices de la tabla `justificantes`
--
ALTER TABLE `justificantes`
  ADD PRIMARY KEY (`id_justificante`);

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
  MODIFY `id_cabecera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=291;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_entrada`
--
ALTER TABLE `gestion_productiva_entrada`
  MODIFY `id_entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=254;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_resultado`
--
ALTER TABLE `gestion_productiva_resultado`
  MODIFY `id_resultado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=288;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_salida`
--
ALTER TABLE `gestion_productiva_salida`
  MODIFY `id_eficiencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=636;

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
-- AUTO_INCREMENT de la tabla `justificantes`
--
ALTER TABLE `justificantes`
  MODIFY `id_justificante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `moldes`
--
ALTER TABLE `moldes`
  MODIFY `id_molde` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `permisos_modulos`
--
ALTER TABLE `permisos_modulos`
  MODIFY `id_permisom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `permisos_usuarios`
--
ALTER TABLE `permisos_usuarios`
  MODIFY `id_permisou` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=346;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
