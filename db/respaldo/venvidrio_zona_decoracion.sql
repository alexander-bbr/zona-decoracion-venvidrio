-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-09-2026 a las 22:00:15
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
-- Estructura de tabla para la tabla `envases_decorados`
--

CREATE TABLE `envases_decorados` (
  `id` int(11) NOT NULL,
  `fecha_decorada` date NOT NULL,
  `cantidad_decorada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `envases_decorados`
--

INSERT INTO `envases_decorados` (`id`, `fecha_decorada`, `cantidad_decorada`) VALUES
(1, '2026-06-01', 90),
(2, '2026-06-02', 110),
(3, '2026-06-03', 100),
(4, '2026-06-04', 120),
(5, '2026-06-05', 95),
(6, '2026-06-06', 130),
(7, '2026-06-07', 115),
(8, '2026-06-08', 105),
(9, '2026-06-09', 125),
(10, '2026-06-10', 140);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envases_defectuoso`
--

CREATE TABLE `envases_defectuoso` (
  `id` int(11) NOT NULL,
  `fecha_produccion` date NOT NULL,
  `cantidad_defectuosa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `envases_defectuoso`
--

INSERT INTO `envases_defectuoso` (`id`, `fecha_produccion`, `cantidad_defectuosa`) VALUES
(1, '2026-06-01', 5),
(2, '2026-06-02', 8),
(3, '2026-06-03', 3),
(4, '2026-06-04', 10),
(5, '2026-06-05', 2),
(6, '2026-06-06', 7),
(7, '2026-06-07', 4),
(8, '2026-06-08', 6),
(9, '2026-06-09', 9),
(10, '2026-06-10', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_paletizador_cabecera`
--

CREATE TABLE `formato_paletizador_cabecera` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `turno` varchar(20) NOT NULL,
  `grupo` varchar(10) NOT NULL,
  `equipo_evaluado` varchar(100) NOT NULL,
  `comentarios` text DEFAULT NULL,
  `elaborado_por` varchar(100) NOT NULL,
  `revisado_por` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_paletizador_preguntas`
--

CREATE TABLE `formato_paletizador_preguntas` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `estado` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formato_paletizador_preguntas`
--

INSERT INTO `formato_paletizador_preguntas` (`id`, `descripcion`, `categoria`, `estado`) VALUES
(1, 'Carro.', 'Condiciones del Equipo', 1),
(2, 'Mallas.', 'Condiciones del Equipo', 1),
(3, 'Prensa.', 'Condiciones del Equipo', 1),
(4, 'Manejo de Envases.', 'Condiciones del Equipo', 1),
(5, 'Centrado de la Camada.', 'Condiciones del Equipo', 1),
(6, 'Correcto ajuste de los Compactador de Camada.', 'Condiciones del Equipo', 1),
(7, 'Altura de los Compactadores.', 'Condiciones del Equipo', 1),
(8, 'Recorrido de la Paleta vacía (desde el dispensador hasta subirlo por el ascensor).', 'Condiciones del Equipo', 1),
(9, 'Recorrido de la Paleta llena (desde que sale del paletizador hasta el forrador).', 'Condiciones del Equipo', 1),
(10, 'Estados de las uñas.', 'Condiciones del Equipo', 1),
(11, 'Estado de las mangueras de aire (que no presenten fuga).', 'Condiciones del Equipo', 1),
(12, 'Tope de Cartón en buen estado.', 'Condiciones del Equipo', 1),
(13, 'Centrado del Cartón.', 'Condiciones del Equipo', 1),
(14, 'Vidrio suelto en la Malla.', 'Condiciones de Inocuidad en el Equipo', 1),
(15, 'Vidrio suelto en Compactador.', 'Condiciones de Inocuidad en el Equipo', 1),
(16, 'Vidrio suelto en el Área (piso, estructura, escalera, alrededor de transportadores...)', 'Condiciones de Inocuidad en el Equipo', 1),
(17, 'Acumulación de polvo en el Carro.', 'Condiciones de Inocuidad en el Equipo', 1),
(18, 'Exceso de grasa en la Cadena del Carro.', 'Condiciones de Inocuidad en el Equipo', 1),
(19, 'Exceso de polvo y tela de araña en la Estructura del Ascensor.', 'Condiciones de Inocuidad en el Equipo', 1),
(20, 'Estado de Pinturas de los Paletizadores.', 'Condiciones de Inocuidad en el Equipo', 1),
(21, 'Condiciones del Material de Empaque (paletas, marcos, cartón separador).', 'Condiciones de Inocuidad en el Equipo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_paletizador_respuestas`
--

CREATE TABLE `formato_paletizador_respuestas` (
  `id` int(11) NOT NULL,
  `id_cabecera` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `resultado` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_pantalla_cambio_cabecera`
--

CREATE TABLE `formato_pantalla_cambio_cabecera` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `turno` varchar(20) NOT NULL,
  `maquina_decoradora` varchar(50) NOT NULL,
  `molde` varchar(50) NOT NULL,
  `elaborado_por` varchar(100) DEFAULT NULL,
  `revisado_por` varchar(100) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `defectos_reportado_selector` text DEFAULT NULL,
  `pantallas_cambiadas_1er_c` int(11) DEFAULT 0,
  `pantallas_cambiadas_2do_c` int(11) DEFAULT 0,
  `pantallas_cambiadas_3er_c` int(11) DEFAULT 0,
  `pantallas_cambiadas_1er_h` int(11) DEFAULT 0,
  `pantallas_cambiadas_2do_h` int(11) DEFAULT 0,
  `pantallas_cambiadas_3er_h` int(11) DEFAULT 0,
  `total_pantallas` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_pantalla_cambio_preguntas`
--

CREATE TABLE `formato_pantalla_cambio_preguntas` (
  `id` int(11) NOT NULL,
  `nombre_defecto` varchar(100) NOT NULL,
  `estado` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formato_pantalla_cambio_preguntas`
--

INSERT INTO `formato_pantalla_cambio_preguntas` (`id`, `nombre_defecto`, `estado`) VALUES
(1, 'Dec Sobre Costura', 1),
(2, 'Decorado Borroso', 1),
(3, 'Decorado Fallo', 1),
(4, 'Decorado Manchado', 1),
(5, 'Decorado Corrido', 1),
(6, 'Decorado Veteado', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_pantalla_cambio_respuestas`
--

CREATE TABLE `formato_pantalla_cambio_respuestas` (
  `id` int(11) NOT NULL,
  `id_cabecera` int(11) NOT NULL,
  `id_defecto` int(11) NOT NULL,
  `hora` varchar(15) NOT NULL,
  `resultado` varchar(5) DEFAULT NULL COMMENT 'Guarda C o N/C',
  `accion_tomada` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_pintura_consumo`
--

CREATE TABLE `formato_pintura_consumo` (
  `id` int(11) NOT NULL,
  `id_pintura_inventario` int(11) NOT NULL,
  `proveedor` varchar(100) NOT NULL,
  `fecha_inicio_consumo` date NOT NULL,
  `numero_lote` varchar(50) NOT NULL,
  `unidad_medida` varchar(50) NOT NULL,
  `cantidad_consumida` decimal(10,2) NOT NULL,
  `fecha_finalizacion_consumo` date NOT NULL,
  `revisado_por` varchar(100) NOT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formato_pintura_consumo`
--

INSERT INTO `formato_pintura_consumo` (`id`, `id_pintura_inventario`, `proveedor`, `fecha_inicio_consumo`, `numero_lote`, `unidad_medida`, `cantidad_consumida`, `fecha_finalizacion_consumo`, `revisado_por`, `observaciones`) VALUES
(34, 1, 'string', '2026-08-01', 'string', 'string', 1.00, '2026-08-01', 'string', 'string');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_recepcion_carton_cabecera`
--

CREATE TABLE `formato_recepcion_carton_cabecera` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `turno` varchar(20) NOT NULL,
  `grupo` varchar(10) NOT NULL,
  `molde` varchar(50) NOT NULL,
  `maquina` varchar(50) NOT NULL,
  `item_number` varchar(50) NOT NULL,
  `codigo_carton` varchar(50) NOT NULL,
  `cantidad_recibida` int(11) NOT NULL,
  `unidades_por_caja` int(11) NOT NULL,
  `estado_carton` varchar(50) NOT NULL,
  `nombre_elaborador` varchar(100) NOT NULL,
  `carnet_elaborador` varchar(50) NOT NULL,
  `aprobado_por` varchar(100) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_recepcion_carton_causas_dano_preguntas`
--

CREATE TABLE `formato_recepcion_carton_causas_dano_preguntas` (
  `id` int(11) NOT NULL,
  `descripcion_causa` varchar(150) NOT NULL,
  `estado` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formato_recepcion_carton_causas_dano_preguntas`
--

INSERT INTO `formato_recepcion_carton_causas_dano_preguntas` (`id`, `descripcion_causa`, `estado`) VALUES
(1, 'ACUMULACIÓN POR TRANSPORTADOR', 1),
(2, 'GOLPEADAS', 1),
(3, 'HUMEDAD', 1),
(4, 'MAQUINA ENGOMADORA', 1),
(5, 'ROTAS', 1),
(6, 'SUCIO', 1),
(7, 'DESPEGADA DE LA COSTURA', 1),
(8, 'IMPRESIÓN CORRIDA', 1),
(9, 'MAL CORTE', 1),
(10, 'OTROS DEFECTOS', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_recepcion_carton_danado_respuestas`
--

CREATE TABLE `formato_recepcion_carton_danado_respuestas` (
  `id` int(11) NOT NULL,
  `id_cabecera` int(11) NOT NULL,
  `id_causa` int(11) NOT NULL,
  `cantidad_cajas` int(11) DEFAULT 0,
  `cantidad_divisores` int(11) DEFAULT 0,
  `cantidad_tapas` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_recepcion_carton_preguntas`
--

CREATE TABLE `formato_recepcion_carton_preguntas` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `estado` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formato_recepcion_carton_preguntas`
--

INSERT INTO `formato_recepcion_carton_preguntas` (`id`, `descripcion`, `estado`) VALUES
(1, 'ADHESIÓN DE SOLAPAS', 1),
(2, 'ESPACIO ENTRE SOLAPAS', 1),
(3, 'CUADRADO DE CAJAS', 1),
(4, 'EXCESO DE: PEGA, CINTA PLASTICA O GRAPAS', 1),
(5, 'SELLO DEL FABRICANTE', 1),
(6, 'SELLADO', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_recepcion_carton_respuestas`
--

CREATE TABLE `formato_recepcion_carton_respuestas` (
  `id` int(11) NOT NULL,
  `id_cabecera` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `hora` varchar(15) NOT NULL,
  `resultado` varchar(2) DEFAULT NULL COMMENT 'Guarda C o N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_verificacion_diaria_cabecera`
--

CREATE TABLE `formato_verificacion_diaria_cabecera` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `turno` varchar(20) NOT NULL,
  `elaborado_por` varchar(100) DEFAULT NULL,
  `revisado_por` varchar(100) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_verificacion_diaria_preguntas`
--

CREATE TABLE `formato_verificacion_diaria_preguntas` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `tipo_equipo` varchar(50) NOT NULL COMMENT 'Puede ser Archa o Maquina',
  `estado` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formato_verificacion_diaria_preguntas`
--

INSERT INTO `formato_verificacion_diaria_preguntas` (`id`, `descripcion`, `tipo_equipo`, `estado`) VALUES
(1, 'Decorado Punta de Archa', 'Archa', 1),
(2, 'Gomas', 'Archa', 1),
(3, 'Herramientas', 'Archa', 1),
(4, 'Muestras Límites', 'Archa', 1),
(5, '¿Realiza el Stacker el Cambio de Arreglo de Envases en la Malla del Archa al Tener una Máquina Parada?', 'Archa', 1),
(6, 'Temp del Envase en la entrada de la máquina', 'Archa', 1),
(7, 'Decorado de Máquina', 'Maquina', 1),
(8, 'Presión Squeegee con la Historia de Trabajo', 'Maquina', 1),
(9, 'Luz Temporizada de Inspección', 'Maquina', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formato_verificacion_diaria_respuestas`
--

CREATE TABLE `formato_verificacion_diaria_respuestas` (
  `id` int(11) NOT NULL,
  `id_cabecera` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `equipo_evaluado` varchar(50) NOT NULL COMMENT 'Guarda el nombre del Archa o Máquina (ej. Archa D2, Maquina D4)',
  `resultado` varchar(20) DEFAULT NULL COMMENT 'Guarda C, NC o el valor numérico para la Temperatura'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `f_historia_trabajo_decoracion_cabecera`
--

CREATE TABLE `f_historia_trabajo_decoracion_cabecera` (
  `id_htd_cabecera` int(11) NOT NULL,
  `fecha_elaboracion` date NOT NULL,
  `molde` varchar(50) NOT NULL,
  `no_plano` varchar(50) DEFAULT NULL,
  `identificador_maquina` varchar(20) NOT NULL,
  `tipo_decorado` varchar(100) DEFAULT NULL,
  `no_archa` varchar(50) DEFAULT NULL,
  `cant_ranuras` int(11) DEFAULT NULL,
  `no_tazas` int(11) DEFAULT NULL,
  `velocidad_bpm` int(11) DEFAULT NULL,
  `tiempo_malla_seg` int(11) DEFAULT NULL,
  `problemas` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `revisado_por` varchar(100) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `f_historia_trabajo_decoracion_cabecera`
--

INSERT INTO `f_historia_trabajo_decoracion_cabecera` (`id_htd_cabecera`, `fecha_elaboracion`, `molde`, `no_plano`, `identificador_maquina`, `tipo_decorado`, `no_archa`, `cant_ranuras`, `no_tazas`, `velocidad_bpm`, `tiempo_malla_seg`, `problemas`, `observaciones`, `revisado_por`, `fecha_registro`) VALUES
(1, '2026-08-16', 'buenas', 'string', 'string', 'string', 'string', 0, 0, 0, 0, 'string', 'string', 'string', '2026-08-16 16:00:32'),
(2, '2026-08-16', 'GX01944', '662', 'D-3', 'Polarcita', 'D2', 19, 30, 70, 300, 'Mal comportamiento de la malla del archa, ameritó ajustes.', 'Sin observaciones adicionales.', 'Octavio Aldana', '2026-08-16 17:11:05'),
(3, '2026-08-16', 'prueba', '445', 'D-4', 'Floral', 'A3', 24, 20, 85, 250, 'hola HOLA HHHHHHHHHHHHHHHH BBBBBBBBBBBBB OOOOOOOOOOOOOO OOOOOOOOOOOOOO AAAAAAAAAAAAAAQQQQQQ QQQQQQQQQQQQQQQQ QQQQQQQQQQQQQQQ Q', 'Corrida sin inconvenientes. hola HOLA HHHHHHHHHHHHHHHH BBBBBBBBBBBBB OOOOOOOOOOOOOO OOOOOOOOOOOOOO AAAAAAAAAAAAAAQQQQQQ QQQQQQQQQQQQQQQQ QQQQQQQQQQQQQQQ', 'Luis Cardenas', '2026-08-16 19:11:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `f_historia_trabajo_decoracion_colores`
--

CREATE TABLE `f_historia_trabajo_decoracion_colores` (
  `id_htd_color` int(11) NOT NULL,
  `id_htd_cabecera` int(11) NOT NULL,
  `numero_color` int(11) NOT NULL,
  `consumo_pintura` varchar(50) DEFAULT NULL,
  `codigo_pintura` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `f_historia_trabajo_decoracion_colores`
--

INSERT INTO `f_historia_trabajo_decoracion_colores` (`id_htd_color`, `id_htd_cabecera`, `numero_color`, `consumo_pintura`, `codigo_pintura`) VALUES
(3, 2, 1, '60', 'SM 00-0200VT38'),
(4, 2, 2, '27', 'SM 00-0025 IN - VT'),
(5, 2, 3, NULL, NULL),
(9, 1, 0, 'string', 'string'),
(19, 3, 1, '45', 'SM 00-0310VT12'),
(20, 3, 2, NULL, NULL),
(21, 3, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `f_historia_trabajo_decoracion_estaciones`
--

CREATE TABLE `f_historia_trabajo_decoracion_estaciones` (
  `id_htd_estacion` int(11) NOT NULL,
  `id_htd_cabecera` int(11) NOT NULL,
  `numero_estacion` int(11) NOT NULL,
  `cuerpo_presion_squeegees` varchar(50) DEFAULT NULL,
  `cuerpo_nro_marco` varchar(50) DEFAULT NULL,
  `cuerpo_tipo_malla` varchar(50) DEFAULT NULL,
  `cuello_presion_squeegees` varchar(50) DEFAULT NULL,
  `cuello_nro_marco` varchar(50) DEFAULT NULL,
  `cuello_tipo_malla` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `f_historia_trabajo_decoracion_estaciones`
--

INSERT INTO `f_historia_trabajo_decoracion_estaciones` (`id_htd_estacion`, `id_htd_cabecera`, `numero_estacion`, `cuerpo_presion_squeegees`, `cuerpo_nro_marco`, `cuerpo_tipo_malla`, `cuello_presion_squeegees`, `cuello_nro_marco`, `cuello_tipo_malla`) VALUES
(3, 2, 1, '15', '130', '200', NULL, NULL, NULL),
(4, 2, 2, '12', '100', '200', '9', '50', '180'),
(5, 2, 3, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 1, 0, 'string', 'string', 'string', 'string', 'string', 'string'),
(19, 3, 1, '18', '110', '180', '10', '60', '160'),
(20, 3, 2, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 3, 3, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `f_historia_trabajo_decoracion_temperatura`
--

CREATE TABLE `f_historia_trabajo_decoracion_temperatura` (
  `id_htd_temperatura` int(11) NOT NULL,
  `id_htd_cabecera` int(11) NOT NULL,
  `numero_zona` int(11) NOT NULL,
  `set_point` varchar(50) DEFAULT NULL,
  `lado_izq` varchar(50) DEFAULT NULL,
  `lado_der` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `f_historia_trabajo_decoracion_temperatura`
--

INSERT INTO `f_historia_trabajo_decoracion_temperatura` (`id_htd_temperatura`, `id_htd_cabecera`, `numero_zona`, `set_point`, `lado_izq`, `lado_der`) VALUES
(3, 2, 1, '250', '250', '250'),
(4, 2, 2, '390', '390', '390'),
(5, 2, 3, '800', '800', '800'),
(6, 2, 4, '1100', '1100', '1100'),
(7, 2, 5, '1160', '1160', '1160'),
(8, 2, 6, '1160', '1160', '1160'),
(9, 2, 7, '1160', '1160', '1160'),
(10, 2, 8, '1020', '1020', '1020'),
(11, 2, 9, '940', '940', '940'),
(12, 2, 10, '710', '710', '710'),
(13, 2, 11, NULL, NULL, NULL),
(14, 2, 12, NULL, NULL, NULL),
(15, 2, 13, NULL, NULL, NULL),
(16, 2, 14, NULL, NULL, NULL),
(17, 2, 15, NULL, NULL, NULL),
(33, 1, 0, 'string', 'string', 'string'),
(79, 3, 1, '230', '228', '231'),
(80, 3, 2, '380', '375', '382'),
(81, 3, 3, '750', '748', '753'),
(82, 3, 4, '1050', '1048', '1052'),
(83, 3, 5, '1150', '1148', '1151'),
(84, 3, 6, '1150', '1149', '1152'),
(85, 3, 7, '1150', '1147', '1150'),
(86, 3, 8, '1000', '998', '1001'),
(87, 3, 9, '920', '918', '922'),
(88, 3, 10, '700', '698', '701'),
(89, 3, 11, NULL, NULL, NULL),
(90, 3, 12, NULL, NULL, NULL),
(91, 3, 13, NULL, NULL, NULL),
(92, 3, 14, NULL, NULL, NULL),
(93, 3, 15, NULL, NULL, NULL);

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
  `grupo` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_productiva_cabecera`
--

INSERT INTO `gestion_productiva_cabecera` (`id_cabecera`, `fecha`, `turno`, `tecnico`, `cant_envases_d1`, `cant_envases_d2`, `cant_envases_d3`, `cant_envases_d4`, `total_envases`, `total_gruesas`, `grupo`) VALUES
(271, '2026-09-08', 1, 'Carlos Mendoza', 700, 350, 100, 0, 1150, 7.99, 'A'),
(272, '2026-09-08', 1, 'Carlos Mendoza', 700, 350, 100, 0, 1150, 7.99, 'A'),
(273, '2026-09-08', 1, 'pruebaaaaaaa', 700, 350, 100, 0, 1150, 7.99, 'A');

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
(132, 271, 1, 1, 500, '07:00'),
(133, 271, 1, 2, 200, '11:30'),
(134, 271, 2, 4, 350, '08:15'),
(135, 271, 3, 5, 100, '09:00'),
(136, 272, 1, 1, 500, '07:00'),
(137, 272, 1, 2, 200, '11:30'),
(138, 272, 2, 4, 350, '08:15'),
(139, 272, 3, 5, 100, '09:00'),
(144, 273, 1, 1, 500, '07:00'),
(145, 273, 1, 2, 200, '11:30'),
(146, 273, 2, 4, 350, '08:15'),
(147, 273, 3, 5, 100, '09:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_productiva_resultado`
--

CREATE TABLE `gestion_productiva_resultado` (
  `id_resultado` int(11) NOT NULL,
  `id_cabecera` int(11) NOT NULL,
  `total_gruesas_lisas` decimal(12,2) DEFAULT 0.00,
  `total_gruesas_decoradas` decimal(12,2) DEFAULT 0.00,
  `eficiencia_productiva` decimal(5,2) DEFAULT 0.00,
  `deficiencia_productiva` decimal(5,2) DEFAULT 0.00,
  `observaciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_productiva_resultado`
--

INSERT INTO `gestion_productiva_resultado` (`id_resultado`, `id_cabecera`, `total_gruesas_lisas`, `total_gruesas_decoradas`, `eficiencia_productiva`, `deficiencia_productiva`, `observaciones`) VALUES
(269, 271, 6.24, 1.73, 98.50, 1.50, 'Prueba de guardado omitiendo el ID 3 en moldes y justificantes.'),
(270, 272, 6.24, 1.73, 98.50, 1.50, 'Prueba de guardado omitiendo el ID 3 en moldes y justificantes.'),
(271, 273, 6.24, 1.73, 98.50, 1.50, 'Prueba de guardado omitiendo el ID 3 en moldes y justificantes.');

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
(553, 1, 271, 2, 1, 5, 250, 1.73, 1, 5, 250, 1.73),
(554, 2, 271, 1, 1, 7, 350, 2.43, 0, 0, 0, 0.00),
(555, 4, 271, 1, 1, 4, 200, 1.39, 0, 0, 0, 0.00),
(556, 5, 271, 1, 1, 2, 100, 0.69, 0, 0, 0, 0.00),
(557, 1, 272, 2, 1, 5, 250, 1.73, 1, 5, 250, 1.73),
(558, 2, 272, 1, 1, 7, 350, 2.43, 0, 0, 0, 0.00),
(559, 4, 272, 1, 1, 4, 200, 1.39, 0, 0, 0, 0.00),
(560, 5, 272, 1, 1, 2, 100, 0.69, 0, 0, 0, 0.00),
(565, 1, 273, 2, 1, 5, 250, 1.73, 1, 5, 250, 1.73),
(566, 2, 273, 1, 1, 7, 350, 2.43, 0, 0, 0, 0.00),
(567, 4, 273, 1, 1, 4, 200, 1.39, 0, 0, 0, 0.00),
(568, 5, 273, 1, 1, 2, 100, 0.69, 0, 0, 0, 0.00);

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
(2, 'Rotura por malcocido', 'Envases quebrados debido a una cocción deficiente en el proceso de fabricación'),
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
(1, 'insumo_pintura', 'ver_inventario'),
(2, 'insumo_pintura', 'crear_registro'),
(3, 'insumo_pintura', 'crear_consumo'),
(4, 'dashboard', 'ver'),
(5, 'gestion_usuarios', 'ver_usuarios'),
(6, 'gestion_usuarios', 'crear_editar'),
(7, 'insumo_pintura', 'ver_historial_consumo'),
(11, 'gestion_productiva', 'registrar_produccion'),
(12, 'gestion_productiva', 'ver_produccion'),
(13, 'gestion_productiva', 'editar'),
(14, 'gestion_productiva', 'gestion_moldes'),
(28, 'gestion_productiva', 'gestion_justificantes');

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
(148, 12, 1),
(149, 12, 2),
(150, 12, 3),
(151, 12, 7),
(152, 12, 4),
(153, 12, 5),
(154, 12, 6),
(155, 12, 11),
(156, 12, 12),
(157, 12, 13),
(158, 12, 14),
(159, 11, 1),
(160, 11, 2),
(161, 11, 3),
(162, 11, 7),
(163, 11, 4),
(164, 11, 5),
(165, 11, 6),
(166, 11, 11),
(167, 11, 12),
(168, 11, 13),
(169, 11, 14),
(170, 11, 28),
(171, 10, 5),
(172, 10, 6),
(173, 10, 11),
(174, 10, 12),
(175, 10, 13),
(176, 10, 14),
(177, 10, 1),
(178, 10, 2),
(179, 10, 3),
(180, 10, 7),
(181, 10, 4),
(182, 10, 28);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pintura_inventario`
--

CREATE TABLE `pintura_inventario` (
  `id` int(11) NOT NULL,
  `color` varchar(50) NOT NULL,
  `cantidad_actual` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cantidad_minima_alerta` decimal(10,2) NOT NULL DEFAULT 5.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pintura_inventario`
--

INSERT INTO `pintura_inventario` (`id`, `color`, `cantidad_actual`, `cantidad_minima_alerta`) VALUES
(1, 'Blanco', 45.00, 10.00),
(2, 'Azul', 20.00, 10.00),
(3, 'Rojo', 20.00, 10.00),
(4, 'Amarillo', 20.00, 10.00),
(5, 'Verde', 20.00, 10.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pintura_registro`
--

CREATE TABLE `pintura_registro` (
  `id` int(11) NOT NULL,
  `id_pintura_inventario` int(11) NOT NULL,
  `proveedor` varchar(100) NOT NULL,
  `fecha_registro` date NOT NULL,
  `unidad_medida` varchar(50) NOT NULL,
  `cantidad_registrada` decimal(10,2) NOT NULL,
  `registrado_por` varchar(100) NOT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pintura_registro`
--

INSERT INTO `pintura_registro` (`id`, `id_pintura_inventario`, `proveedor`, `fecha_registro`, `unidad_medida`, `cantidad_registrada`, `registrado_por`, `observaciones`) VALUES
(17, 1, 'string', '2026-07-23', 'string', 20.00, 'string', 'string'),
(18, 1, 'string', '2026-07-23', 'string', 1.00, 'string', 'string');

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
(271, 1, 1),
(271, 1, 2),
(271, 2, 4),
(271, 2, 5),
(272, 1, 1),
(272, 1, 2),
(272, 2, 4),
(272, 2, 5),
(273, 1, 1),
(273, 1, 2),
(273, 2, 4),
(273, 2, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion_lisa_inventario`
--

CREATE TABLE `produccion_lisa_inventario` (
  `id_inventariopl` int(11) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `cantidad_actual` int(11) NOT NULL DEFAULT 0,
  `estado` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `produccion_lisa_inventario`
--

INSERT INTO `produccion_lisa_inventario` (`id_inventariopl`, `modelo`, `cantidad_actual`, `estado`) VALUES
(1, 'Valmy', 36, 1),
(2, 'Polarcita', 50, 1),
(3, 'Ronista', 0, 1),
(4, 'ron', 100, 1),
(5, 'cerveza', 50, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion_lisa_registro`
--

CREATE TABLE `produccion_lisa_registro` (
  `id_registro` int(11) NOT NULL,
  `fecha_registro` date NOT NULL,
  `id_inventariopl` int(11) NOT NULL,
  `cantidad_registrada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `produccion_lisa_registro`
--

INSERT INTO `produccion_lisa_registro` (`id_registro`, `fecha_registro`, `id_inventariopl`, `cantidad_registrada`) VALUES
(1, '2026-08-04', 1, 50),
(2, '2026-08-04', 2, 50),
(3, '2026-08-04', 4, 50),
(4, '2026-08-04', 4, 50),
(5, '2026-08-04', 5, 50),
(6, '2026-08-05', 1, 1),
(7, '2026-08-05', 1, 1),
(8, '2026-08-05', 1, 1),
(9, '2026-08-05', 1, 1),
(10, '2026-08-05', 1, 1),
(11, '2026-08-05', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion_lisa_salida`
--

CREATE TABLE `produccion_lisa_salida` (
  `id_salida` int(11) NOT NULL,
  `fecha_salida` date NOT NULL,
  `id_inventariopl` int(11) NOT NULL,
  `cantidad_sacada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `produccion_lisa_salida`
--

INSERT INTO `produccion_lisa_salida` (`id_salida`, `fecha_salida`, `id_inventariopl`, `cantidad_sacada`) VALUES
(1, '2026-08-04', 1, 20);

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
-- Indices de la tabla `envases_decorados`
--
ALTER TABLE `envases_decorados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `envases_defectuoso`
--
ALTER TABLE `envases_defectuoso`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formato_paletizador_cabecera`
--
ALTER TABLE `formato_paletizador_cabecera`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formato_paletizador_preguntas`
--
ALTER TABLE `formato_paletizador_preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formato_paletizador_respuestas`
--
ALTER TABLE `formato_paletizador_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cabecera` (`id_cabecera`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `formato_pantalla_cambio_cabecera`
--
ALTER TABLE `formato_pantalla_cambio_cabecera`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formato_pantalla_cambio_preguntas`
--
ALTER TABLE `formato_pantalla_cambio_preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formato_pantalla_cambio_respuestas`
--
ALTER TABLE `formato_pantalla_cambio_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cabecera` (`id_cabecera`),
  ADD KEY `id_defecto` (`id_defecto`);

--
-- Indices de la tabla `formato_pintura_consumo`
--
ALTER TABLE `formato_pintura_consumo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pintura_inventario` (`id_pintura_inventario`);

--
-- Indices de la tabla `formato_recepcion_carton_cabecera`
--
ALTER TABLE `formato_recepcion_carton_cabecera`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formato_recepcion_carton_causas_dano_preguntas`
--
ALTER TABLE `formato_recepcion_carton_causas_dano_preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formato_recepcion_carton_danado_respuestas`
--
ALTER TABLE `formato_recepcion_carton_danado_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cabecera` (`id_cabecera`),
  ADD KEY `id_causa` (`id_causa`);

--
-- Indices de la tabla `formato_recepcion_carton_preguntas`
--
ALTER TABLE `formato_recepcion_carton_preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formato_recepcion_carton_respuestas`
--
ALTER TABLE `formato_recepcion_carton_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cabecera` (`id_cabecera`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `formato_verificacion_diaria_cabecera`
--
ALTER TABLE `formato_verificacion_diaria_cabecera`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formato_verificacion_diaria_preguntas`
--
ALTER TABLE `formato_verificacion_diaria_preguntas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `formato_verificacion_diaria_respuestas`
--
ALTER TABLE `formato_verificacion_diaria_respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cabecera` (`id_cabecera`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `f_historia_trabajo_decoracion_cabecera`
--
ALTER TABLE `f_historia_trabajo_decoracion_cabecera`
  ADD PRIMARY KEY (`id_htd_cabecera`);

--
-- Indices de la tabla `f_historia_trabajo_decoracion_colores`
--
ALTER TABLE `f_historia_trabajo_decoracion_colores`
  ADD PRIMARY KEY (`id_htd_color`),
  ADD KEY `id_htd_cabecera` (`id_htd_cabecera`);

--
-- Indices de la tabla `f_historia_trabajo_decoracion_estaciones`
--
ALTER TABLE `f_historia_trabajo_decoracion_estaciones`
  ADD PRIMARY KEY (`id_htd_estacion`),
  ADD KEY `id_htd_cabecera` (`id_htd_cabecera`);

--
-- Indices de la tabla `f_historia_trabajo_decoracion_temperatura`
--
ALTER TABLE `f_historia_trabajo_decoracion_temperatura`
  ADD PRIMARY KEY (`id_htd_temperatura`),
  ADD KEY `id_htd_cabecera` (`id_htd_cabecera`);

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
-- Indices de la tabla `pintura_inventario`
--
ALTER TABLE `pintura_inventario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pintura_registro`
--
ALTER TABLE `pintura_registro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pintura_inventario` (`id_pintura_inventario`);

--
-- Indices de la tabla `produccion_justificantes`
--
ALTER TABLE `produccion_justificantes`
  ADD UNIQUE KEY `id_cabecera` (`id_cabecera`,`modelo_molde`,`id_justificante`),
  ADD KEY `modelo_molde` (`modelo_molde`),
  ADD KEY `id_justificante` (`id_justificante`);

--
-- Indices de la tabla `produccion_lisa_inventario`
--
ALTER TABLE `produccion_lisa_inventario`
  ADD PRIMARY KEY (`id_inventariopl`);

--
-- Indices de la tabla `produccion_lisa_registro`
--
ALTER TABLE `produccion_lisa_registro`
  ADD PRIMARY KEY (`id_registro`),
  ADD KEY `id_inventariopl` (`id_inventariopl`);

--
-- Indices de la tabla `produccion_lisa_salida`
--
ALTER TABLE `produccion_lisa_salida`
  ADD PRIMARY KEY (`id_salida`),
  ADD KEY `id_inventariopl` (`id_inventariopl`);

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
-- AUTO_INCREMENT de la tabla `envases_decorados`
--
ALTER TABLE `envases_decorados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `envases_defectuoso`
--
ALTER TABLE `envases_defectuoso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `formato_paletizador_cabecera`
--
ALTER TABLE `formato_paletizador_cabecera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formato_paletizador_preguntas`
--
ALTER TABLE `formato_paletizador_preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `formato_paletizador_respuestas`
--
ALTER TABLE `formato_paletizador_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formato_pantalla_cambio_cabecera`
--
ALTER TABLE `formato_pantalla_cambio_cabecera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formato_pantalla_cambio_preguntas`
--
ALTER TABLE `formato_pantalla_cambio_preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `formato_pantalla_cambio_respuestas`
--
ALTER TABLE `formato_pantalla_cambio_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formato_pintura_consumo`
--
ALTER TABLE `formato_pintura_consumo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `formato_recepcion_carton_cabecera`
--
ALTER TABLE `formato_recepcion_carton_cabecera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formato_recepcion_carton_causas_dano_preguntas`
--
ALTER TABLE `formato_recepcion_carton_causas_dano_preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `formato_recepcion_carton_danado_respuestas`
--
ALTER TABLE `formato_recepcion_carton_danado_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formato_recepcion_carton_preguntas`
--
ALTER TABLE `formato_recepcion_carton_preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `formato_recepcion_carton_respuestas`
--
ALTER TABLE `formato_recepcion_carton_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formato_verificacion_diaria_cabecera`
--
ALTER TABLE `formato_verificacion_diaria_cabecera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formato_verificacion_diaria_preguntas`
--
ALTER TABLE `formato_verificacion_diaria_preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `formato_verificacion_diaria_respuestas`
--
ALTER TABLE `formato_verificacion_diaria_respuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `f_historia_trabajo_decoracion_cabecera`
--
ALTER TABLE `f_historia_trabajo_decoracion_cabecera`
  MODIFY `id_htd_cabecera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `f_historia_trabajo_decoracion_colores`
--
ALTER TABLE `f_historia_trabajo_decoracion_colores`
  MODIFY `id_htd_color` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `f_historia_trabajo_decoracion_estaciones`
--
ALTER TABLE `f_historia_trabajo_decoracion_estaciones`
  MODIFY `id_htd_estacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `f_historia_trabajo_decoracion_temperatura`
--
ALTER TABLE `f_historia_trabajo_decoracion_temperatura`
  MODIFY `id_htd_temperatura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_cabecera`
--
ALTER TABLE `gestion_productiva_cabecera`
  MODIFY `id_cabecera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=274;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_entrada`
--
ALTER TABLE `gestion_productiva_entrada`
  MODIFY `id_entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=148;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_resultado`
--
ALTER TABLE `gestion_productiva_resultado`
  MODIFY `id_resultado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=272;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_salida`
--
ALTER TABLE `gestion_productiva_salida`
  MODIFY `id_eficiencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=569;

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
  MODIFY `id_permisom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `permisos_usuarios`
--
ALTER TABLE `permisos_usuarios`
  MODIFY `id_permisou` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- AUTO_INCREMENT de la tabla `pintura_inventario`
--
ALTER TABLE `pintura_inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pintura_registro`
--
ALTER TABLE `pintura_registro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `produccion_lisa_inventario`
--
ALTER TABLE `produccion_lisa_inventario`
  MODIFY `id_inventariopl` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `produccion_lisa_registro`
--
ALTER TABLE `produccion_lisa_registro`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `produccion_lisa_salida`
--
ALTER TABLE `produccion_lisa_salida`
  MODIFY `id_salida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `formato_paletizador_respuestas`
--
ALTER TABLE `formato_paletizador_respuestas`
  ADD CONSTRAINT `formato_paletizador_respuestas_ibfk_1` FOREIGN KEY (`id_cabecera`) REFERENCES `formato_paletizador_cabecera` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `formato_paletizador_respuestas_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `formato_paletizador_preguntas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `formato_pantalla_cambio_respuestas`
--
ALTER TABLE `formato_pantalla_cambio_respuestas`
  ADD CONSTRAINT `formato_pantalla_cambio_respuestas_ibfk_1` FOREIGN KEY (`id_cabecera`) REFERENCES `formato_pantalla_cambio_cabecera` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `formato_pantalla_cambio_respuestas_ibfk_2` FOREIGN KEY (`id_defecto`) REFERENCES `formato_pantalla_cambio_preguntas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `formato_pintura_consumo`
--
ALTER TABLE `formato_pintura_consumo`
  ADD CONSTRAINT `formato_pintura_consumo_ibfk_1` FOREIGN KEY (`id_pintura_inventario`) REFERENCES `pintura_inventario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `formato_recepcion_carton_danado_respuestas`
--
ALTER TABLE `formato_recepcion_carton_danado_respuestas`
  ADD CONSTRAINT `fk_recepcion_cabecera_dano` FOREIGN KEY (`id_cabecera`) REFERENCES `formato_recepcion_carton_cabecera` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_recepcion_causa_dano` FOREIGN KEY (`id_causa`) REFERENCES `formato_recepcion_carton_causas_dano_preguntas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `formato_recepcion_carton_respuestas`
--
ALTER TABLE `formato_recepcion_carton_respuestas`
  ADD CONSTRAINT `fk_recepcion_cabecera_resp` FOREIGN KEY (`id_cabecera`) REFERENCES `formato_recepcion_carton_cabecera` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_recepcion_pregunta_resp` FOREIGN KEY (`id_pregunta`) REFERENCES `formato_recepcion_carton_preguntas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `formato_verificacion_diaria_respuestas`
--
ALTER TABLE `formato_verificacion_diaria_respuestas`
  ADD CONSTRAINT `fk_verif_diaria_cabecera` FOREIGN KEY (`id_cabecera`) REFERENCES `formato_verificacion_diaria_cabecera` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_verif_diaria_pregunta` FOREIGN KEY (`id_pregunta`) REFERENCES `formato_verificacion_diaria_preguntas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `f_historia_trabajo_decoracion_colores`
--
ALTER TABLE `f_historia_trabajo_decoracion_colores`
  ADD CONSTRAINT `f_historia_trabajo_decoracion_colores_ibfk_1` FOREIGN KEY (`id_htd_cabecera`) REFERENCES `f_historia_trabajo_decoracion_cabecera` (`id_htd_cabecera`);

--
-- Filtros para la tabla `f_historia_trabajo_decoracion_estaciones`
--
ALTER TABLE `f_historia_trabajo_decoracion_estaciones`
  ADD CONSTRAINT `f_historia_trabajo_decoracion_estaciones_ibfk_1` FOREIGN KEY (`id_htd_cabecera`) REFERENCES `f_historia_trabajo_decoracion_cabecera` (`id_htd_cabecera`);

--
-- Filtros para la tabla `f_historia_trabajo_decoracion_temperatura`
--
ALTER TABLE `f_historia_trabajo_decoracion_temperatura`
  ADD CONSTRAINT `f_historia_trabajo_decoracion_temperatura_ibfk_1` FOREIGN KEY (`id_htd_cabecera`) REFERENCES `f_historia_trabajo_decoracion_cabecera` (`id_htd_cabecera`);

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
-- Filtros para la tabla `permisos_usuarios`
--
ALTER TABLE `permisos_usuarios`
  ADD CONSTRAINT `permisos_usu
arios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `permisos_usu
arios_ibfk_2` FOREIGN KEY (`id_permisom`) REFERENCES `permisos_modulos` (`id_permisom`);

--
-- Filtros para la tabla `pintura_registro`
--
ALTER TABLE `pintura_registro`
  ADD CONSTRAINT `pintura_registro_ibfk_1` FOREIGN KEY (`id_pintura_inventario`) REFERENCES `pintura_inventario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `produccion_justificantes`
--
ALTER TABLE `produccion_justificantes`
  ADD CONSTRAINT `produccion_justificantes_ibfk_1` FOREIGN KEY (`id_cabecera`) REFERENCES `gestion_productiva_cabecera` (`id_cabecera`) ON DELETE CASCADE,
  ADD CONSTRAINT `produccion_justificantes_ibfk_2` FOREIGN KEY (`modelo_molde`) REFERENCES `moldes` (`id_molde`),
  ADD CONSTRAINT `produccion_justificantes_ibfk_3` FOREIGN KEY (`id_justificante`) REFERENCES `justificantes` (`id_justificante`) ON DELETE CASCADE;

--
-- Filtros para la tabla `produccion_lisa_registro`
--
ALTER TABLE `produccion_lisa_registro`
  ADD CONSTRAINT `produccion_lisa_registro_ibfk_1` FOREIGN KEY (`id_inventariopl`) REFERENCES `produccion_lisa_inventario` (`id_inventariopl`);

--
-- Filtros para la tabla `produccion_lisa_salida`
--
ALTER TABLE `produccion_lisa_salida`
  ADD CONSTRAINT `produccion_lisa_salida_ibfk_1` FOREIGN KEY (`id_inventariopl`) REFERENCES `produccion_lisa_inventario` (`id_inventariopl`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
