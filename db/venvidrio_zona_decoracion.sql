SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
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
-- Estructura de tabla para la tabla `gestion_productiva_entrada`
--

CREATE TABLE `gestion_productiva_entrada` (
  `id_produccion` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `turno` varchar(10) NOT NULL,
  `tecnico` varchar(150) NOT NULL,
  `cant_envases_d1` decimal(10,2) DEFAULT 0.00,
  `cant_envases_d2` decimal(10,2) DEFAULT 0.00,
  `cant_envases_d3` decimal(10,2) DEFAULT 0.00,
  `cant_envases_d4` decimal(10,2) DEFAULT 0.00,
  `total_envases` decimal(12,2) DEFAULT 0.00,
  `total_gruesas` decimal(12,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_productiva_entrada`
--

INSERT INTO `gestion_productiva_entrada` (`id_produccion`, `fecha`, `turno`, `tecnico`, `cant_envases_d1`, `cant_envases_d2`, `cant_envases_d3`, `cant_envases_d4`, `total_envases`, `total_gruesas`) VALUES
(1, '2024-01-01', 'Mañana', 'Juan Perez', 14.60, 68.71, 99.76, 92.64, 255.75, 417.67),
(2, '2024-04-10', 'Tarde', 'Juan Perez', 17.02, 59.81, 47.98, 60.48, 233.75, 107.57),
(3, '2024-01-02', 'Tarde', 'Maria Lopez', 78.47, 60.10, 65.06, 45.02, 119.57, 144.21),
(4, '2024-04-11', 'Noche', 'Maria Lopez', 82.43, 68.87, 97.06, 78.68, 8.95, 751.43),
(5, '2024-01-03', 'Noche', 'Carlos Ruiz', 69.00, 19.59, 90.93, 95.90, 26.74, 457.35),
(6, '2024-04-12', 'Mañana', 'Carlos Ruiz', 8.62, 5.90, 3.63, 0.45, 365.47, 554.88),
(7, '2024-01-04', 'Mañana', 'Ana Torres', 3.33, 50.20, 41.02, 54.50, 197.78, 837.11),
(8, '2024-04-13', 'Tarde', 'Ana Torres', 70.22, 99.98, 89.22, 46.16, 252.54, 772.06),
(9, '2024-01-05', 'Tarde', 'Luis Gomez', 96.62, 51.50, 67.63, 83.63, 61.06, 254.43),
(10, '2024-04-14', 'Noche', 'Luis Gomez', 81.42, 30.77, 9.57, 55.57, 196.44, 788.52),
(11, '2024-01-06', 'Noche', 'Juan Perez', 46.93, 98.10, 49.70, 54.19, 87.49, 467.86),
(12, '2024-04-15', 'Mañana', 'Juan Perez', 68.31, 1.20, 1.05, 1.64, 20.32, 204.72),
(13, '2024-01-07', 'Mañana', 'Maria Lopez', 87.12, 74.17, 9.49, 24.95, 385.16, 65.89),
(14, '2024-04-16', 'Tarde', 'Maria Lopez', 44.08, 0.62, 70.88, 52.52, 199.89, 922.99),
(15, '2024-01-08', 'Tarde', 'Carlos Ruiz', 11.58, 80.98, 70.19, 7.98, 117.44, 228.53),
(16, '2024-04-17', 'Noche', 'Carlos Ruiz', 26.18, 62.35, 33.19, 78.91, 379.99, 382.41),
(17, '2024-01-09', 'Noche', 'Ana Torres', 6.22, 16.36, 63.15, 66.68, 175.83, 197.33),
(18, '2024-04-18', 'Mañana', 'Ana Torres', 66.80, 74.78, 73.50, 43.16, 381.27, 470.96),
(19, '2024-01-10', 'Mañana', 'Luis Gomez', 49.53, 6.35, 83.18, 96.86, 138.92, 830.86),
(20, '2024-04-19', 'Tarde', 'Luis Gomez', 11.24, 6.93, 0.95, 83.95, 67.64, 326.96),
(21, '2024-01-11', 'Tarde', 'Juan Perez', 12.75, 65.65, 90.01, 53.12, 382.20, 183.96),
(22, '2024-04-20', 'Noche', 'Juan Perez', 5.33, 71.45, 41.25, 91.93, 143.50, 35.96),
(23, '2024-01-12', 'Noche', 'Maria Lopez', 10.35, 40.98, 73.82, 46.17, 37.60, 84.82),
(24, '2024-04-21', 'Mañana', 'Maria Lopez', 14.21, 45.61, 85.41, 90.22, 379.49, 37.03),
(25, '2024-01-13', 'Mañana', 'Carlos Ruiz', 33.90, 58.38, 90.22, 75.95, 36.28, 175.13),
(26, '2024-04-22', 'Tarde', 'Carlos Ruiz', 60.35, 49.23, 65.10, 77.80, 374.86, 351.66),
(27, '2024-01-14', 'Tarde', 'Ana Torres', 94.68, 67.92, 55.57, 74.06, 14.44, 958.63),
(28, '2024-04-23', 'Noche', 'Ana Torres', 68.49, 54.84, 68.76, 79.27, 360.33, 125.95),
(29, '2024-01-15', 'Noche', 'Luis Gomez', 92.73, 25.85, 51.05, 77.73, 141.95, 442.53),
(30, '2024-04-24', 'Mañana', 'Luis Gomez', 14.80, 41.23, 61.77, 85.15, 161.76, 467.47),
(31, '2024-01-16', 'Mañana', 'Juan Perez', 12.42, 21.84, 71.95, 94.21, 220.89, 934.75),
(32, '2024-04-25', 'Tarde', 'Juan Perez', 1.71, 28.12, 35.46, 92.96, 233.69, 132.23),
(33, '2024-01-17', 'Tarde', 'Maria Lopez', 90.85, 14.58, 0.35, 57.99, 355.70, 706.47),
(34, '2024-04-26', 'Noche', 'Maria Lopez', 86.46, 20.36, 42.42, 51.03, 111.59, 863.91),
(35, '2024-01-18', 'Noche', 'Carlos Ruiz', 48.26, 82.12, 65.84, 82.84, 66.64, 347.88),
(36, '2024-04-27', 'Mañana', 'Carlos Ruiz', 23.96, 15.44, 5.31, 80.25, 341.31, 858.77),
(37, '2024-01-19', 'Mañana', 'Ana Torres', 73.40, 9.37, 26.65, 5.15, 183.16, 135.00),
(38, '2024-04-28', 'Tarde', 'Ana Torres', 30.13, 10.16, 60.39, 71.47, 304.67, 664.42),
(39, '2024-01-20', 'Tarde', 'Luis Gomez', 3.71, 19.21, 84.93, 67.03, 321.45, 7.10),
(40, '2024-04-29', 'Noche', 'Luis Gomez', 62.47, 10.20, 63.61, 87.45, 185.64, 697.06),
(41, '2024-01-21', 'Noche', 'Juan Perez', 9.30, 37.38, 59.02, 82.94, 150.60, 394.27),
(42, '2024-04-30', 'Mañana', 'Juan Perez', 84.18, 2.64, 60.66, 95.38, 379.61, 883.76),
(43, '2024-01-22', 'Mañana', 'Maria Lopez', 57.18, 20.76, 32.25, 98.96, 392.28, 934.62),
(44, '2024-05-01', 'Tarde', 'Maria Lopez', 73.10, 85.12, 6.30, 76.15, 247.30, 806.89),
(45, '2024-01-23', 'Tarde', 'Carlos Ruiz', 17.97, 47.78, 85.00, 81.67, 213.40, 217.32),
(46, '2024-05-02', 'Noche', 'Carlos Ruiz', 48.61, 77.85, 43.41, 83.53, 349.61, 864.26),
(47, '2024-01-24', 'Noche', 'Ana Torres', 69.92, 90.33, 41.90, 38.50, 267.24, 185.47),
(48, '2024-05-03', 'Mañana', 'Ana Torres', 92.30, 5.88, 52.48, 44.76, 265.54, 976.26),
(49, '2024-01-25', 'Mañana', 'Luis Gomez', 88.98, 52.01, 93.12, 9.56, 273.81, 135.82),
(50, '2024-05-04', 'Tarde', 'Luis Gomez', 62.55, 72.01, 72.38, 45.87, 48.95, 235.65),
(51, '2024-01-26', 'Tarde', 'Juan Perez', 81.11, 34.87, 31.01, 50.46, 237.01, 448.85),
(52, '2024-05-05', 'Noche', 'Juan Perez', 46.67, 98.69, 53.44, 71.13, 381.27, 632.08),
(53, '2024-01-27', 'Noche', 'Maria Lopez', 30.08, 60.80, 13.76, 86.37, 362.37, 938.42),
(54, '2024-05-06', 'Mañana', 'Maria Lopez', 97.44, 5.65, 35.96, 62.82, 24.93, 427.05),
(55, '2024-01-28', 'Mañana', 'Carlos Ruiz', 94.83, 46.02, 45.61, 90.00, 52.68, 958.43),
(56, '2024-05-07', 'Tarde', 'Carlos Ruiz', 39.71, 11.01, 35.95, 46.69, 102.45, 879.91),
(57, '2024-01-29', 'Tarde', 'Ana Torres', 63.12, 51.61, 68.70, 88.68, 149.23, 204.83),
(58, '2024-05-08', 'Noche', 'Ana Torres', 90.50, 91.03, 83.67, 45.26, 301.07, 405.73),
(59, '2024-01-30', 'Noche', 'Luis Gomez', 77.06, 63.59, 86.77, 43.08, 220.32, 461.65),
(60, '2024-05-09', 'Mañana', 'Luis Gomez', 65.58, 89.43, 50.39, 83.66, 268.54, 846.95),
(61, '2024-01-31', 'Mañana', 'Juan Perez', 22.07, 56.26, 15.10, 6.72, 353.11, 212.38),
(62, '2024-05-10', 'Tarde', 'Juan Perez', 41.36, 43.08, 91.34, 27.45, 252.95, 338.30),
(63, '2024-02-01', 'Tarde', 'Maria Lopez', 79.44, 95.70, 40.20, 13.87, 195.05, 22.09),
(64, '2024-05-11', 'Noche', 'Maria Lopez', 64.75, 17.14, 91.44, 5.78, 218.36, 556.07),
(65, '2024-02-02', 'Noche', 'Carlos Ruiz', 14.26, 4.48, 79.64, 84.75, 339.23, 698.00),
(66, '2024-05-12', 'Mañana', 'Carlos Ruiz', 94.58, 63.49, 33.73, 78.15, 358.36, 134.92),
(67, '2024-02-03', 'Mañana', 'Ana Torres', 98.69, 52.96, 68.74, 84.82, 71.45, 348.62),
(68, '2024-05-13', 'Tarde', 'Ana Torres', 20.72, 99.03, 32.97, 67.76, 159.59, 962.04),
(69, '2024-02-04', 'Tarde', 'Luis Gomez', 61.33, 18.04, 6.21, 76.93, 264.01, 992.34),
(70, '2024-05-14', 'Noche', 'Luis Gomez', 98.16, 93.11, 71.07, 76.02, 267.52, 63.46),
(71, '2024-02-05', 'Noche', 'Juan Perez', 31.09, 36.40, 88.73, 34.46, 24.50, 272.34),
(72, '2024-05-15', 'Mañana', 'Juan Perez', 17.79, 7.26, 82.92, 92.84, 61.78, 986.89),
(73, '2024-02-06', 'Mañana', 'Maria Lopez', 47.11, 39.50, 56.15, 62.24, 171.05, 270.87),
(74, '2024-05-16', 'Tarde', 'Maria Lopez', 7.15, 54.49, 50.99, 91.50, 18.10, 481.21),
(75, '2024-02-07', 'Tarde', 'Carlos Ruiz', 27.03, 90.80, 72.88, 92.04, 166.10, 315.22),
(76, '2024-05-17', 'Noche', 'Carlos Ruiz', 33.03, 70.59, 53.86, 57.54, 104.37, 578.54),
(77, '2024-02-08', 'Noche', 'Ana Torres', 10.99, 81.41, 74.07, 26.10, 33.16, 631.54),
(78, '2024-05-18', 'Mañana', 'Ana Torres', 90.90, 65.05, 52.53, 67.51, 319.90, 973.31),
(79, '2024-02-09', 'Mañana', 'Luis Gomez', 46.73, 41.67, 68.17, 15.83, 298.60, 257.49),
(80, '2024-05-19', 'Tarde', 'Luis Gomez', 4.80, 46.74, 19.33, 56.41, 96.21, 510.44),
(81, '2024-02-10', 'Tarde', 'Juan Perez', 83.06, 62.17, 61.68, 21.89, 97.60, 563.33),
(82, '2024-05-20', 'Noche', 'Juan Perez', 8.47, 73.33, 41.26, 86.31, 31.12, 799.58),
(83, '2024-02-11', 'Noche', 'Maria Lopez', 76.45, 42.39, 82.59, 85.78, 324.57, 483.62),
(84, '2024-05-21', 'Mañana', 'Maria Lopez', 98.39, 46.84, 39.06, 54.75, 226.34, 186.74),
(85, '2024-02-12', 'Mañana', 'Carlos Ruiz', 23.61, 62.05, 39.39, 10.81, 143.50, 469.46),
(86, '2024-05-22', 'Tarde', 'Carlos Ruiz', 27.11, 94.70, 92.17, 76.74, 28.82, 58.06),
(87, '2024-02-13', 'Tarde', 'Ana Torres', 7.41, 19.65, 76.00, 21.06, 309.16, 232.80),
(88, '2024-05-23', 'Noche', 'Ana Torres', 84.52, 52.78, 10.35, 93.38, 143.46, 991.81),
(89, '2024-02-14', 'Noche', 'Luis Gomez', 88.31, 44.01, 55.12, 43.55, 209.64, 313.94),
(90, '2024-05-24', 'Mañana', 'Luis Gomez', 99.74, 4.52, 23.39, 3.37, 186.73, 233.11),
(91, '2024-02-15', 'Mañana', 'Juan Perez', 76.51, 12.60, 33.47, 29.57, 189.73, 484.52),
(92, '2024-05-25', 'Tarde', 'Juan Perez', 99.96, 54.45, 72.39, 98.57, 302.72, 826.93),
(93, '2024-02-16', 'Tarde', 'Maria Lopez', 86.43, 84.05, 60.99, 52.79, 323.84, 464.49),
(94, '2024-05-26', 'Noche', 'Maria Lopez', 89.36, 7.45, 69.17, 23.52, 40.23, 797.44),
(95, '2024-02-17', 'Noche', 'Carlos Ruiz', 68.54, 3.49, 11.80, 48.56, 29.57, 912.74),
(96, '2024-05-27', 'Mañana', 'Carlos Ruiz', 34.20, 97.16, 83.21, 24.57, 292.86, 923.66),
(97, '2024-02-18', 'Mañana', 'Ana Torres', 42.19, 33.84, 42.65, 11.74, 122.88, 183.93),
(98, '2024-05-28', 'Tarde', 'Ana Torres', 99.80, 43.84, 19.80, 67.48, 311.99, 875.42),
(99, '2024-02-19', 'Tarde', 'Luis Gomez', 3.72, 55.98, 68.73, 75.71, 289.48, 347.14),
(100, '2024-05-29', 'Noche', 'Luis Gomez', 56.46, 78.17, 21.45, 72.75, 397.62, 787.68),
(101, '2024-02-20', 'Noche', 'Juan Perez', 95.63, 41.82, 22.25, 85.76, 248.18, 529.55),
(102, '2024-05-30', 'Mañana', 'Juan Perez', 78.64, 34.34, 35.78, 75.87, 288.00, 324.01),
(103, '2024-02-21', 'Mañana', 'Maria Lopez', 46.00, 32.81, 26.05, 31.83, 324.00, 95.03),
(104, '2024-05-31', 'Tarde', 'Maria Lopez', 4.51, 94.06, 56.75, 1.59, 150.77, 836.96),
(105, '2024-02-22', 'Tarde', 'Carlos Ruiz', 5.40, 75.91, 63.35, 89.00, 219.92, 78.93),
(106, '2024-06-01', 'Noche', 'Carlos Ruiz', 74.52, 48.93, 21.06, 58.54, 118.10, 719.98),
(107, '2024-02-23', 'Noche', 'Ana Torres', 71.41, 41.06, 91.08, 32.22, 351.43, 426.27),
(108, '2024-06-02', 'Mañana', 'Ana Torres', 49.56, 19.93, 50.96, 95.00, 88.48, 256.01),
(109, '2024-02-24', 'Mañana', 'Luis Gomez', 61.65, 31.43, 72.22, 66.81, 69.51, 864.65),
(110, '2024-06-03', 'Tarde', 'Luis Gomez', 80.19, 41.55, 67.20, 11.35, 220.60, 416.92),
(111, '2024-02-25', 'Tarde', 'Juan Perez', 43.01, 89.98, 20.86, 34.35, 36.64, 427.62),
(112, '2024-06-04', 'Noche', 'Juan Perez', 86.33, 3.38, 57.90, 79.35, 92.14, 771.43),
(113, '2024-02-26', 'Noche', 'Maria Lopez', 16.61, 51.62, 8.26, 86.44, 29.66, 777.59),
(114, '2024-06-05', 'Mañana', 'Maria Lopez', 66.55, 99.48, 97.75, 90.30, 233.08, 204.34),
(115, '2024-02-27', 'Mañana', 'Carlos Ruiz', 27.37, 75.52, 95.53, 51.06, 274.86, 903.99),
(116, '2024-06-06', 'Tarde', 'Carlos Ruiz', 45.85, 58.06, 52.73, 89.48, 356.86, 776.27),
(117, '2024-02-28', 'Tarde', 'Ana Torres', 20.49, 69.58, 86.41, 23.34, 229.84, 172.82),
(118, '2024-06-07', 'Noche', 'Ana Torres', 14.02, 18.28, 49.32, 91.77, 43.47, 790.42),
(119, '2024-02-29', 'Noche', 'Luis Gomez', 62.61, 75.90, 91.69, 30.73, 314.32, 7.22),
(120, '2024-06-08', 'Mañana', 'Luis Gomez', 67.87, 37.17, 82.25, 99.73, 207.68, 603.97),
(121, '2024-03-01', 'Mañana', 'Juan Perez', 46.23, 49.95, 11.05, 5.43, 375.93, 536.26),
(122, '2024-03-02', 'Tarde', 'Maria Lopez', 86.18, 70.03, 91.60, 47.89, 258.75, 797.48),
(123, '2024-03-03', 'Noche', 'Carlos Ruiz', 4.68, 84.17, 6.78, 81.42, 346.92, 894.06),
(124, '2024-03-04', 'Mañana', 'Ana Torres', 86.84, 65.97, 69.33, 48.74, 142.89, 323.91),
(125, '2024-03-05', 'Tarde', 'Luis Gomez', 54.78, 76.74, 19.37, 66.62, 299.89, 750.11),
(126, '2024-03-06', 'Noche', 'Juan Perez', 50.14, 25.66, 77.90, 12.50, 115.16, 64.62),
(127, '2024-03-07', 'Mañana', 'Maria Lopez', 45.94, 10.31, 13.72, 37.68, 188.94, 231.38),
(128, '2024-03-08', 'Tarde', 'Carlos Ruiz', 73.98, 0.51, 80.59, 1.42, 261.30, 223.70),
(129, '2024-03-09', 'Noche', 'Ana Torres', 15.87, 12.26, 13.68, 31.62, 68.26, 904.59),
(130, '2024-03-10', 'Mañana', 'Luis Gomez', 1.10, 34.13, 67.33, 34.28, 277.58, 441.37),
(131, '2024-03-11', 'Tarde', 'Juan Perez', 12.50, 30.10, 13.00, 74.71, 138.16, 485.72),
(132, '2024-03-12', 'Noche', 'Maria Lopez', 39.24, 50.48, 34.67, 21.91, 22.11, 619.21),
(133, '2024-03-13', 'Mañana', 'Carlos Ruiz', 93.02, 79.35, 17.69, 50.38, 395.35, 430.52),
(134, '2024-03-14', 'Tarde', 'Ana Torres', 18.75, 64.57, 66.61, 39.36, 387.78, 666.49),
(135, '2024-03-15', 'Noche', 'Luis Gomez', 42.41, 12.12, 33.37, 30.50, 209.56, 704.44),
(136, '2024-03-16', 'Mañana', 'Juan Perez', 95.05, 63.90, 34.38, 80.18, 391.04, 482.61),
(137, '2024-03-17', 'Tarde', 'Maria Lopez', 48.03, 95.35, 32.67, 77.32, 354.26, 108.76),
(138, '2024-03-18', 'Noche', 'Carlos Ruiz', 88.68, 10.79, 87.91, 7.16, 288.23, 388.22),
(139, '2024-03-19', 'Mañana', 'Ana Torres', 77.94, 73.21, 32.26, 41.65, 45.91, 324.37),
(140, '2024-03-20', 'Tarde', 'Luis Gomez', 27.75, 41.45, 23.98, 95.57, 23.53, 427.18),
(141, '2024-03-21', 'Noche', 'Juan Perez', 95.94, 51.56, 69.98, 95.22, 264.69, 451.95),
(142, '2024-03-22', 'Mañana', 'Maria Lopez', 27.45, 1.69, 26.08, 25.31, 193.38, 657.77),
(143, '2024-03-23', 'Tarde', 'Carlos Ruiz', 83.85, 21.93, 58.09, 24.65, 196.01, 710.52),
(144, '2024-03-24', 'Noche', 'Ana Torres', 8.26, 28.12, 15.83, 94.79, 105.77, 478.53),
(145, '2024-03-25', 'Mañana', 'Luis Gomez', 59.94, 56.13, 0.85, 35.86, 306.92, 760.81),
(146, '2024-03-26', 'Tarde', 'Juan Perez', 50.21, 22.83, 63.49, 48.98, 217.68, 251.62),
(147, '2024-03-27', 'Noche', 'Maria Lopez', 62.55, 37.26, 98.64, 81.44, 45.15, 121.10),
(148, '2024-03-28', 'Mañana', 'Carlos Ruiz', 26.69, 97.10, 5.43, 35.87, 252.20, 76.46),
(149, '2024-03-29', 'Tarde', 'Ana Torres', 49.08, 22.45, 65.02, 57.74, 374.55, 949.78),
(150, '2024-03-30', 'Noche', 'Luis Gomez', 93.97, 84.93, 42.72, 58.83, 263.88, 533.70),
(151, '2024-03-31', 'Mañana', 'Juan Perez', 68.94, 84.58, 16.09, 26.70, 341.03, 461.68),
(152, '2024-04-01', 'Tarde', 'Maria Lopez', 75.07, 36.84, 59.01, 84.52, 182.20, 742.03),
(153, '2024-04-02', 'Noche', 'Carlos Ruiz', 34.36, 49.21, 42.98, 67.24, 29.06, 346.06),
(154, '2024-04-03', 'Mañana', 'Ana Torres', 51.24, 52.37, 8.15, 83.61, 374.54, 173.30),
(155, '2024-04-04', 'Tarde', 'Luis Gomez', 5.75, 76.74, 66.47, 2.13, 44.92, 497.67),
(156, '2024-04-05', 'Noche', 'Juan Perez', 15.14, 26.41, 86.62, 53.88, 38.16, 860.60),
(157, '2024-04-06', 'Mañana', 'Maria Lopez', 1.68, 50.20, 45.98, 79.31, 234.48, 551.55),
(158, '2024-04-07', 'Tarde', 'Carlos Ruiz', 99.92, 34.11, 70.83, 51.78, 185.76, 768.52),
(159, '2024-04-08', 'Noche', 'Ana Torres', 44.94, 94.13, 35.83, 96.77, 305.51, 915.65),
(160, '2024-04-09', 'Mañana', 'Luis Gomez', 28.69, 68.76, 57.71, 82.30, 153.49, 449.52);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_productiva_resultado`
--

CREATE TABLE `gestion_productiva_resultado` (
  `id_resultado` int(11) NOT NULL,
  `id_produccion` int(11) NOT NULL,
  `total_gruesas_lisas` decimal(12,2) DEFAULT 0.00,
  `total_gruesas_decoradas` decimal(12,2) DEFAULT 0.00,
  `eficiencia_productiva` decimal(5,2) DEFAULT 0.00,
  `deficiencia_productiva` decimal(5,2) DEFAULT 0.00,
  `observaciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_productiva_resultado`
--

INSERT INTO `gestion_productiva_resultado` (`id_resultado`, `id_produccion`, `total_gruesas_lisas`, `total_gruesas_decoradas`, `eficiencia_productiva`, `deficiencia_productiva`, `observaciones`) VALUES
(1, 1, 48.22, 66.80, 37.87, 49.27, NULL),
(2, 2, 407.30, 297.37, 52.98, 86.50, NULL),
(3, 3, 104.33, 396.96, 34.36, 33.63, NULL),
(4, 4, 135.47, 310.41, 29.13, 59.42, 'Ajuste de maquina en el turno'),
(5, 5, 108.85, 491.79, 26.48, 37.34, NULL),
(6, 6, 498.79, 129.24, 29.97, 72.29, NULL),
(7, 7, 449.74, 134.82, 64.97, 43.98, 'Ajuste de maquina en el turno'),
(8, 8, 449.30, 352.08, 82.50, 1.25, 'Ajuste de maquina en el turno'),
(9, 9, 368.43, 492.40, 71.33, 61.24, 'Revisar producto final'),
(10, 10, 385.83, 46.55, 15.05, 47.31, 'Revisar producto final'),
(11, 11, 75.61, 6.90, 61.53, 3.53, 'Ajuste de maquina en el turno'),
(12, 12, 370.42, 32.44, 10.19, 31.48, NULL),
(13, 13, 89.41, 352.01, 98.37, 80.64, 'Ajuste de maquina en el turno'),
(14, 14, 340.71, 226.45, 22.02, 74.24, NULL),
(15, 15, 496.06, 436.50, 38.87, 32.45, NULL),
(16, 16, 85.80, 466.85, 15.37, 96.73, 'Ajuste de maquina en el turno'),
(17, 17, 373.69, 406.50, 82.28, 67.51, 'Revisar producto final'),
(18, 18, 254.99, 414.35, 61.35, 58.17, 'Ajuste de maquina en el turno'),
(19, 19, 381.71, 18.62, 89.60, 36.81, 'Ajuste de maquina en el turno'),
(20, 20, 416.84, 96.84, 46.73, 75.57, 'Ajuste de maquina en el turno'),
(21, 21, 473.77, 445.74, 61.48, 39.94, 'Ajuste de maquina en el turno'),
(22, 22, 184.24, 73.24, 62.69, 69.52, 'Ajuste de maquina en el turno'),
(23, 23, 333.07, 329.83, 29.99, 52.07, 'Ajuste de maquina en el turno'),
(24, 24, 334.54, 238.72, 38.00, 46.75, 'Ajuste de maquina en el turno'),
(25, 25, 168.70, 464.32, 63.10, 36.90, 'Revisar producto final'),
(26, 26, 326.41, 204.11, 8.27, 18.86, 'Ajuste de maquina en el turno'),
(27, 27, 231.46, 292.86, 53.98, 94.18, 'Ajuste de maquina en el turno'),
(28, 28, 424.17, 185.51, 31.01, 43.74, 'Ajuste de maquina en el turno'),
(29, 29, 41.62, 252.26, 27.29, 85.09, 'Ajuste de maquina en el turno'),
(30, 30, 411.68, 119.21, 72.20, 89.48, 'Ajuste de maquina en el turno'),
(31, 31, 175.87, 96.72, 91.20, 97.98, 'Ajuste de maquina en el turno'),
(32, 32, 442.79, 401.72, 36.05, 39.21, 'Revisar producto final'),
(33, 33, 109.48, 228.80, 63.12, 78.31, 'Ajuste de maquina en el turno'),
(34, 34, 368.74, 202.64, 81.39, 85.39, 'Revisar producto final'),
(35, 35, 287.91, 198.32, 25.58, 8.89, NULL),
(36, 36, 283.15, 236.32, 66.43, 90.37, 'Ajuste de maquina en el turno'),
(37, 37, 1.24, 132.65, 31.90, 79.93, 'Ajuste de maquina en el turno'),
(38, 38, 440.21, 1.31, 37.18, 85.12, NULL),
(39, 39, 161.40, 83.73, 86.89, 84.22, NULL),
(40, 40, 331.99, 416.75, 17.56, 37.73, 'Ajuste de maquina en el turno'),
(41, 41, 127.95, 139.18, 62.41, 28.55, 'Ajuste de maquina en el turno'),
(42, 42, 466.21, 451.62, 71.89, 88.50, 'Ajuste de maquina en el turno'),
(43, 43, 310.41, 24.65, 38.40, 77.22, NULL),
(44, 44, 8.55, 199.40, 94.27, 51.72, NULL),
(45, 45, 458.38, 434.71, 59.68, 37.58, NULL),
(46, 46, 153.96, 297.87, 5.49, 48.75, 'Ajuste de maquina en el turno'),
(47, 47, 343.22, 364.76, 58.83, 75.29, 'Revisar producto final'),
(48, 48, 369.35, 347.55, 25.94, 21.18, 'Ajuste de maquina en el turno'),
(49, 49, 1.55, 353.98, 53.05, 52.85, 'Ajuste de maquina en el turno'),
(50, 50, 99.77, 492.87, 33.00, 69.30, NULL),
(51, 51, 24.34, 179.90, 65.30, 18.54, 'Revisar producto final'),
(52, 52, 141.81, 257.14, 72.05, 5.99, 'Ajuste de maquina en el turno'),
(53, 53, 65.52, 64.36, 25.05, 86.62, NULL),
(54, 54, 379.34, 447.44, 19.83, 30.70, 'Revisar producto final'),
(55, 55, 389.81, 38.85, 4.96, 1.50, 'Revisar producto final'),
(56, 56, 292.97, 75.56, 99.78, 53.55, 'Ajuste de maquina en el turno'),
(57, 57, 8.69, 322.58, 17.37, 93.29, 'Ajuste de maquina en el turno'),
(58, 58, 82.16, 32.30, 83.00, 95.63, 'Ajuste de maquina en el turno'),
(59, 59, 35.26, 292.68, 71.52, 82.01, 'Revisar producto final'),
(60, 60, 156.90, 352.25, 58.11, 79.20, 'Ajuste de maquina en el turno'),
(61, 61, 442.06, 150.22, 84.98, 34.75, 'Ajuste de maquina en el turno'),
(62, 62, 465.16, 477.21, 98.12, 4.25, NULL),
(63, 63, 142.10, 382.95, 97.69, 58.68, NULL),
(64, 64, 136.07, 295.66, 14.02, 92.71, NULL),
(65, 65, 408.64, 104.81, 59.62, 35.23, 'Revisar producto final'),
(66, 66, 403.62, 58.84, 16.67, 48.05, 'Revisar producto final'),
(67, 67, 34.86, 320.97, 0.05, 7.68, 'Ajuste de maquina en el turno'),
(68, 68, 131.72, 135.27, 56.24, 0.05, 'Ajuste de maquina en el turno'),
(69, 69, 464.97, 462.04, 83.06, 38.08, 'Ajuste de maquina en el turno'),
(70, 70, 178.45, 14.17, 7.10, 26.99, 'Ajuste de maquina en el turno'),
(71, 71, 477.89, 79.82, 93.08, 17.52, 'Ajuste de maquina en el turno'),
(72, 72, 106.43, 192.97, 29.11, 29.78, NULL),
(73, 73, 36.38, 406.20, 84.37, 78.14, 'Ajuste de maquina en el turno'),
(74, 74, 275.36, 73.18, 7.96, 95.89, 'Ajuste de maquina en el turno'),
(75, 75, 420.41, 249.72, 97.47, 37.54, 'Revisar producto final'),
(76, 76, 319.12, 166.23, 74.76, 74.04, NULL),
(77, 77, 0.63, 389.26, 88.89, 10.88, 'Revisar producto final'),
(78, 78, 30.22, 335.04, 16.91, 83.52, 'Ajuste de maquina en el turno'),
(79, 79, 91.56, 201.07, 46.13, 10.01, NULL),
(80, 80, 31.03, 231.66, 13.04, 26.21, 'Revisar producto final'),
(81, 81, 404.95, 145.89, 2.93, 27.09, 'Ajuste de maquina en el turno'),
(82, 82, 401.84, 228.08, 86.98, 98.03, 'Ajuste de maquina en el turno'),
(83, 83, 363.48, 36.21, 18.12, 68.85, 'Revisar producto final'),
(84, 84, 215.20, 227.20, 98.08, 54.07, NULL),
(85, 85, 318.16, 314.81, 23.91, 30.68, 'Revisar producto final'),
(86, 86, 81.32, 181.69, 32.90, 55.47, NULL),
(87, 87, 490.42, 50.09, 55.84, 49.15, NULL),
(88, 88, 420.40, 445.56, 93.32, 99.26, 'Ajuste de maquina en el turno'),
(89, 89, 353.94, 10.17, 97.81, 82.94, 'Ajuste de maquina en el turno'),
(90, 90, 120.33, 237.91, 65.72, 85.84, NULL),
(91, 91, 85.20, 386.67, 35.54, 45.72, 'Ajuste de maquina en el turno'),
(92, 92, 487.80, 348.58, 55.90, 70.34, 'Revisar producto final'),
(93, 93, 44.71, 463.69, 36.87, 6.12, 'Ajuste de maquina en el turno'),
(94, 94, 239.42, 473.62, 29.96, 65.65, 'Ajuste de maquina en el turno'),
(95, 95, 293.75, 47.46, 71.21, 27.57, NULL),
(96, 96, 96.43, 406.33, 48.47, 98.56, NULL),
(97, 97, 320.98, 485.77, 93.18, 74.46, 'Revisar producto final'),
(98, 98, 201.88, 118.11, 96.98, 14.05, 'Ajuste de maquina en el turno'),
(99, 99, 171.30, 39.81, 37.03, 61.28, 'Revisar producto final'),
(100, 100, 463.30, 387.01, 9.03, 12.94, NULL),
(101, 101, 165.83, 91.25, 91.75, 4.00, NULL),
(102, 102, 120.97, 429.67, 57.09, 27.63, 'Ajuste de maquina en el turno'),
(103, 103, 286.66, 159.21, 87.21, 40.54, 'Ajuste de maquina en el turno'),
(104, 104, 477.70, 132.18, 45.56, 48.51, 'Ajuste de maquina en el turno'),
(105, 105, 4.35, 266.60, 63.99, 59.98, 'Ajuste de maquina en el turno'),
(106, 106, 373.74, 473.10, 48.86, 60.43, 'Ajuste de maquina en el turno'),
(107, 107, 81.94, 460.28, 11.12, 79.41, 'Ajuste de maquina en el turno'),
(108, 108, 50.66, 49.67, 19.27, 66.55, 'Ajuste de maquina en el turno'),
(109, 109, 251.65, 132.83, 81.84, 29.52, NULL),
(110, 110, 11.76, 233.30, 26.24, 91.24, NULL),
(111, 111, 178.75, 189.26, 82.01, 96.51, 'Ajuste de maquina en el turno'),
(112, 112, 278.46, 496.59, 29.51, 49.61, NULL),
(113, 113, 323.98, 390.04, 95.66, 44.26, NULL),
(114, 114, 458.22, 207.06, 32.13, 36.40, 'Revisar producto final'),
(115, 115, 94.83, 189.63, 32.73, 49.88, NULL),
(116, 116, 392.74, 367.10, 31.46, 37.03, 'Revisar producto final'),
(117, 117, 214.11, 208.79, 80.33, 76.36, 'Ajuste de maquina en el turno'),
(118, 118, 263.25, 190.93, 32.98, 50.34, NULL),
(119, 119, 27.24, 445.10, 28.76, 76.72, 'Revisar producto final'),
(120, 120, 282.71, 453.44, 83.82, 47.01, 'Revisar producto final'),
(121, 121, 385.20, 171.77, 40.65, 0.20, 'Ajuste de maquina en el turno'),
(122, 122, 179.64, 479.05, 71.26, 68.89, NULL),
(123, 123, 204.03, 321.95, 99.53, 4.50, NULL),
(124, 124, 289.89, 360.56, 86.63, 16.82, 'Ajuste de maquina en el turno'),
(125, 125, 399.31, 439.30, 99.71, 34.97, 'Ajuste de maquina en el turno'),
(126, 126, 207.94, 433.30, 8.53, 82.69, 'Revisar producto final'),
(127, 127, 456.28, 463.40, 89.63, 70.09, 'Revisar producto final'),
(128, 128, 488.41, 218.15, 25.11, 94.64, 'Revisar producto final'),
(129, 129, 27.07, 167.36, 51.12, 55.20, NULL),
(130, 130, 349.01, 32.02, 22.61, 93.83, NULL),
(131, 131, 108.67, 166.20, 1.00, 5.28, NULL),
(132, 132, 176.87, 367.74, 61.62, 87.46, 'Ajuste de maquina en el turno'),
(133, 133, 207.00, 39.01, 14.81, 50.66, 'Ajuste de maquina en el turno'),
(134, 134, 175.20, 491.14, 86.02, 35.42, 'Ajuste de maquina en el turno'),
(135, 135, 436.68, 350.13, 88.12, 30.53, 'Revisar producto final'),
(136, 136, 249.19, 421.66, 72.15, 7.75, 'Ajuste de maquina en el turno'),
(137, 137, 371.22, 32.71, 9.98, 30.28, NULL),
(138, 138, 88.77, 197.51, 44.25, 2.76, 'Revisar producto final'),
(139, 139, 484.34, 206.29, 15.69, 54.66, 'Ajuste de maquina en el turno'),
(140, 140, 287.70, 429.64, 57.02, 27.31, NULL),
(141, 141, 154.37, 89.96, 97.34, 32.71, 'Ajuste de maquina en el turno'),
(142, 142, 416.99, 190.82, 40.62, 88.62, NULL),
(143, 143, 187.59, 334.46, 21.91, 8.87, 'Ajuste de maquina en el turno'),
(144, 144, 481.27, 410.18, 21.42, 60.98, NULL),
(145, 145, 397.44, 182.92, 44.46, 12.53, NULL),
(146, 146, 279.58, 266.79, 99.04, 35.12, 'Ajuste de maquina en el turno'),
(147, 147, 497.41, 182.43, 83.98, 10.44, 'Ajuste de maquina en el turno'),
(148, 148, 246.90, 183.91, 35.77, 68.50, 'Ajuste de maquina en el turno'),
(149, 149, 233.54, 110.85, 70.73, 87.13, 'Ajuste de maquina en el turno'),
(150, 150, 48.23, 400.83, 71.90, 18.98, NULL),
(151, 151, 290.87, 366.84, 92.31, 41.47, NULL),
(152, 152, 234.46, 257.98, 17.30, 31.71, NULL),
(153, 153, 352.22, 190.03, 78.69, 79.46, 'Ajuste de maquina en el turno'),
(154, 154, 272.60, 348.65, 85.09, 16.27, 'Ajuste de maquina en el turno'),
(155, 155, 146.48, 9.97, 22.08, 4.44, 'Ajuste de maquina en el turno'),
(156, 156, 320.56, 107.00, 14.67, 9.13, 'Ajuste de maquina en el turno'),
(157, 157, 497.76, 275.21, 76.55, 17.64, NULL),
(158, 158, 117.21, 488.79, 18.46, 99.05, NULL),
(159, 159, 454.72, 242.11, 69.28, 1.15, 'Revisar producto final'),
(160, 160, 430.17, 182.41, 24.31, 12.09, 'Revisar producto final');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_productiva_salida`
--

CREATE TABLE `gestion_productiva_salida` (
  `id_eficiencia` int(11) NOT NULL,
  `modelo_molde` int(11) NOT NULL,
  `id_produccion` int(11) NOT NULL,
  `total_paletas` decimal(10,2) DEFAULT 0.00,
  `cant_paletas_lisas` decimal(10,2) DEFAULT 0.00,
  `cant_camadas_lisas` decimal(10,2) DEFAULT 0.00,
  `cant_envases_lisas` decimal(10,2) DEFAULT 0.00,
  `cant_gruesas_lisas` decimal(10,2) DEFAULT 0.00,
  `cant_paletas_decoradas` decimal(10,2) DEFAULT 0.00,
  `cant_camadas_decoradas` decimal(10,2) DEFAULT 0.00,
  `cant_envases_decoradas` decimal(10,2) DEFAULT 0.00,
  `cant_gruesas_decoradas` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_productiva_salida`
--

INSERT INTO `gestion_productiva_salida` (`id_eficiencia`, `modelo_molde`, `id_produccion`, `total_paletas`, `cant_paletas_lisas`, `cant_camadas_lisas`, `cant_envases_lisas`, `cant_gruesas_lisas`, `cant_paletas_decoradas`, `cant_camadas_decoradas`, `cant_envases_decoradas`, `cant_gruesas_decoradas`) VALUES
(1, 1, 1, 0.73, 22.31, 9.38, 29.95, 21.64, 18.33, 26.72, 28.61, 12.92),
(2, 2, 1, 28.74, 4.93, 38.45, 27.46, 21.93, 27.27, 20.55, 20.96, 43.16),
(3, 1, 2, 2.92, 35.13, 16.87, 28.95, 44.16, 33.96, 37.33, 34.75, 11.78),
(4, 2, 2, 4.63, 37.80, 25.12, 12.20, 35.66, 41.67, 1.38, 31.89, 5.32),
(5, 1, 3, 30.91, 38.59, 0.21, 35.28, 25.77, 23.03, 37.83, 20.05, 36.75),
(6, 2, 3, 23.61, 7.80, 18.19, 17.53, 33.07, 12.79, 14.72, 35.25, 32.07),
(7, 1, 4, 4.59, 26.76, 20.04, 19.92, 39.49, 37.66, 19.84, 36.24, 21.66),
(8, 2, 4, 49.57, 32.89, 15.73, 29.97, 2.66, 23.38, 8.93, 24.52, 45.79),
(9, 1, 5, 5.39, 39.58, 31.74, 39.94, 4.50, 2.66, 49.82, 41.13, 6.16),
(10, 2, 5, 7.41, 18.57, 20.64, 47.47, 25.45, 34.81, 47.72, 34.17, 27.68),
(11, 1, 6, 35.88, 46.38, 24.23, 32.05, 37.53, 41.50, 44.93, 0.14, 15.90),
(12, 2, 6, 29.10, 47.78, 1.61, 14.72, 18.75, 49.61, 41.80, 10.16, 25.40),
(13, 1, 7, 46.53, 6.45, 42.67, 44.00, 42.00, 27.97, 13.85, 35.37, 35.29),
(14, 2, 7, 20.32, 45.74, 17.74, 1.49, 4.23, 16.66, 20.61, 3.07, 3.51),
(15, 1, 8, 8.35, 31.21, 31.00, 11.39, 13.95, 35.58, 36.03, 23.42, 9.00),
(16, 2, 8, 24.77, 46.82, 9.78, 8.45, 12.91, 39.18, 7.20, 18.45, 20.65),
(17, 1, 9, 47.92, 27.61, 44.33, 38.80, 11.01, 38.67, 10.29, 35.45, 46.39),
(18, 2, 9, 25.60, 38.82, 17.31, 20.10, 48.55, 32.48, 16.72, 36.19, 30.77),
(19, 1, 10, 45.27, 34.03, 34.37, 19.74, 45.59, 18.71, 6.81, 27.91, 19.13),
(20, 2, 10, 11.93, 2.23, 25.38, 20.19, 24.84, 13.60, 43.51, 26.75, 3.21),
(21, 1, 11, 35.79, 19.34, 39.34, 38.65, 25.23, 10.21, 25.37, 46.23, 5.03),
(22, 2, 11, 36.46, 17.22, 26.72, 31.93, 29.48, 1.61, 19.61, 43.23, 7.33),
(23, 1, 12, 6.97, 12.83, 43.23, 27.67, 8.68, 10.40, 25.94, 48.49, 14.65),
(24, 2, 12, 27.77, 44.91, 41.24, 21.46, 33.60, 3.60, 17.19, 25.17, 24.29),
(25, 1, 13, 45.91, 6.68, 45.70, 8.43, 5.08, 0.08, 35.18, 25.66, 22.77),
(26, 2, 13, 36.87, 16.03, 19.55, 49.66, 39.64, 49.20, 27.11, 37.95, 8.41),
(27, 1, 14, 28.20, 15.77, 44.25, 23.95, 36.98, 13.05, 4.33, 32.48, 49.43),
(28, 2, 14, 49.72, 0.28, 2.26, 10.46, 45.52, 46.23, 44.59, 34.25, 37.47),
(29, 1, 15, 34.61, 10.63, 49.33, 14.77, 25.85, 34.92, 47.08, 30.61, 11.82),
(30, 2, 15, 17.27, 0.89, 2.66, 10.61, 45.06, 43.46, 32.13, 30.27, 4.96),
(31, 1, 16, 34.00, 5.11, 23.54, 2.38, 41.27, 49.20, 22.20, 13.38, 0.32),
(32, 2, 16, 11.45, 6.31, 47.20, 17.08, 43.79, 17.72, 7.23, 32.97, 43.18),
(33, 1, 17, 17.00, 5.43, 26.17, 14.56, 44.29, 27.79, 6.05, 46.90, 16.34),
(34, 2, 17, 41.02, 6.06, 7.26, 18.11, 18.76, 39.48, 41.10, 37.08, 12.08),
(35, 1, 18, 49.16, 9.58, 0.42, 23.36, 15.53, 7.57, 41.27, 33.62, 44.30),
(36, 2, 18, 20.64, 20.31, 39.62, 37.16, 16.96, 23.33, 15.75, 8.77, 46.62),
(37, 1, 19, 6.76, 43.97, 49.55, 15.84, 30.54, 5.18, 34.27, 5.83, 26.33),
(38, 2, 19, 14.15, 41.77, 16.42, 6.76, 34.57, 2.54, 9.00, 37.40, 9.98),
(39, 1, 20, 37.73, 8.67, 30.18, 24.89, 33.90, 44.83, 22.46, 27.81, 21.65),
(40, 2, 20, 24.83, 9.18, 21.44, 29.63, 33.84, 30.30, 49.99, 9.06, 45.32),
(41, 1, 21, 49.42, 11.14, 7.42, 3.70, 46.24, 20.11, 11.83, 48.80, 8.50),
(42, 2, 21, 46.13, 5.13, 37.28, 21.02, 43.25, 3.19, 36.21, 21.46, 48.68),
(43, 1, 22, 29.02, 49.05, 8.19, 43.82, 44.54, 41.22, 22.47, 38.68, 26.00),
(44, 2, 22, 13.95, 41.75, 16.92, 9.34, 45.92, 1.60, 20.23, 46.34, 21.04),
(45, 1, 23, 16.17, 17.72, 40.09, 47.27, 16.11, 38.72, 45.29, 10.27, 15.49),
(46, 2, 23, 46.66, 36.80, 44.01, 9.68, 16.35, 2.70, 14.48, 14.29, 28.00),
(47, 1, 24, 47.14, 1.69, 17.05, 30.15, 49.61, 7.60, 39.16, 22.99, 47.49),
(48, 2, 24, 18.49, 49.97, 44.36, 21.91, 26.46, 16.55, 3.40, 17.36, 26.58),
(49, 1, 25, 30.84, 24.44, 29.68, 25.07, 36.30, 6.30, 22.61, 44.16, 2.98),
(50, 2, 25, 32.41, 3.09, 18.21, 31.81, 4.41, 26.61, 19.85, 19.39, 37.43),
(51, 1, 26, 28.96, 32.50, 25.64, 30.70, 26.59, 40.83, 24.40, 49.48, 24.22),
(52, 2, 26, 22.68, 40.71, 35.53, 5.51, 20.95, 38.23, 28.29, 26.75, 48.88),
(53, 1, 27, 14.16, 24.16, 28.33, 19.16, 10.81, 46.56, 0.39, 12.26, 10.13),
(54, 2, 27, 13.88, 39.00, 3.34, 49.73, 38.61, 43.87, 3.54, 36.06, 19.67),
(55, 1, 28, 40.19, 41.92, 39.02, 19.37, 29.79, 40.82, 14.73, 1.22, 11.87),
(56, 2, 28, 5.72, 42.98, 47.73, 9.72, 5.42, 47.91, 23.31, 22.82, 44.16),
(57, 1, 29, 2.33, 29.17, 38.88, 6.90, 17.84, 18.52, 39.07, 39.77, 31.66),
(58, 2, 29, 39.01, 0.04, 33.17, 15.74, 29.19, 48.72, 6.05, 34.10, 2.32),
(59, 1, 30, 9.29, 39.50, 19.65, 29.74, 39.75, 9.53, 28.39, 13.36, 31.65),
(60, 2, 30, 18.17, 45.89, 24.94, 37.04, 10.36, 40.69, 22.37, 39.79, 31.84),
(61, 1, 31, 39.82, 3.57, 48.41, 31.33, 11.43, 13.15, 31.47, 17.88, 45.02),
(62, 2, 31, 21.45, 22.20, 46.63, 16.58, 42.97, 15.14, 46.79, 38.54, 2.32),
(63, 1, 32, 45.97, 22.91, 26.63, 14.41, 42.17, 17.60, 11.52, 4.77, 39.31),
(64, 2, 32, 32.24, 43.25, 19.54, 17.96, 31.19, 2.08, 16.80, 27.77, 38.46),
(65, 1, 33, 8.98, 29.50, 20.59, 14.45, 10.48, 9.06, 13.85, 42.06, 18.75),
(66, 2, 33, 17.58, 31.64, 5.46, 32.40, 45.63, 30.93, 17.74, 45.94, 26.47),
(67, 1, 34, 44.55, 43.32, 32.96, 34.85, 25.36, 22.25, 35.18, 9.15, 40.21),
(68, 2, 34, 23.58, 47.28, 15.66, 36.45, 35.26, 16.97, 29.05, 44.35, 34.61),
(69, 1, 35, 40.00, 46.15, 10.78, 15.44, 44.85, 27.93, 5.11, 41.77, 43.49),
(70, 2, 35, 42.17, 30.38, 25.38, 35.77, 2.72, 6.30, 23.32, 47.70, 18.55),
(71, 1, 36, 49.66, 42.63, 14.16, 42.94, 22.20, 32.19, 44.35, 25.17, 42.79),
(72, 2, 36, 38.46, 13.94, 4.30, 29.67, 35.46, 38.31, 35.14, 10.78, 48.49),
(73, 1, 37, 10.12, 5.13, 45.30, 11.08, 19.53, 14.41, 13.44, 23.98, 29.58),
(74, 2, 37, 25.98, 41.13, 27.71, 15.17, 42.72, 18.08, 12.23, 6.92, 47.90),
(75, 1, 38, 18.73, 49.96, 43.61, 18.16, 9.98, 45.42, 47.16, 49.54, 6.24),
(76, 2, 38, 32.56, 44.07, 22.68, 31.20, 37.94, 46.09, 16.65, 44.97, 24.90),
(77, 1, 39, 39.59, 23.24, 47.45, 17.50, 45.18, 23.38, 31.37, 36.70, 39.41),
(78, 2, 39, 36.95, 16.51, 21.69, 8.93, 29.56, 21.02, 16.42, 19.06, 46.01),
(79, 1, 40, 22.87, 26.34, 13.09, 36.43, 42.86, 5.03, 46.56, 17.70, 48.82),
(80, 2, 40, 41.00, 8.53, 19.65, 22.66, 4.35, 3.76, 5.74, 17.44, 19.99),
(81, 1, 41, 47.61, 28.08, 47.58, 3.66, 25.54, 16.73, 7.02, 34.91, 3.49),
(82, 2, 41, 12.71, 3.08, 27.27, 27.13, 3.83, 37.76, 27.29, 23.18, 34.02),
(83, 1, 42, 0.56, 0.76, 2.09, 8.18, 34.64, 48.66, 39.37, 0.86, 36.18),
(84, 2, 42, 28.33, 33.12, 30.61, 3.67, 26.53, 21.65, 28.66, 28.32, 5.66),
(85, 1, 43, 43.32, 49.62, 18.14, 41.82, 4.71, 48.10, 26.34, 37.43, 8.13),
(86, 2, 43, 28.33, 17.29, 1.47, 5.46, 22.90, 48.11, 21.83, 14.85, 8.76),
(87, 1, 44, 49.26, 20.02, 2.29, 1.42, 0.23, 46.89, 33.76, 28.15, 39.44),
(88, 2, 44, 12.74, 45.40, 38.79, 7.75, 22.38, 38.62, 26.00, 14.10, 42.54),
(89, 1, 45, 20.37, 24.25, 10.15, 27.98, 9.47, 13.41, 38.62, 2.88, 48.53),
(90, 2, 45, 34.01, 24.48, 20.36, 28.37, 30.78, 18.77, 1.53, 1.33, 2.05),
(91, 1, 46, 6.26, 25.17, 7.05, 9.76, 27.65, 8.96, 11.86, 32.42, 26.53),
(92, 2, 46, 35.40, 47.38, 30.73, 11.49, 15.27, 41.86, 13.49, 41.88, 18.95),
(93, 1, 47, 19.09, 38.61, 35.79, 13.13, 8.26, 1.93, 34.87, 18.53, 38.07),
(94, 2, 47, 34.76, 9.59, 43.65, 39.47, 16.43, 13.74, 19.41, 5.80, 20.80),
(95, 1, 48, 36.60, 20.61, 43.24, 4.38, 42.19, 47.81, 12.49, 19.01, 7.56),
(96, 2, 48, 30.79, 31.27, 13.98, 26.09, 38.53, 14.34, 6.14, 37.68, 19.97),
(97, 1, 49, 36.81, 24.15, 10.31, 29.09, 14.54, 35.41, 33.43, 10.93, 4.34),
(98, 2, 49, 38.93, 31.61, 41.28, 11.57, 34.02, 35.40, 24.93, 18.44, 17.41),
(99, 1, 50, 31.73, 6.43, 36.97, 15.56, 16.89, 37.77, 38.18, 27.58, 23.35),
(100, 2, 50, 34.02, 0.03, 48.12, 40.49, 8.10, 19.02, 20.79, 46.89, 22.09),
(101, 1, 51, 19.79, 32.68, 4.01, 22.02, 48.05, 24.20, 26.87, 11.75, 28.11),
(102, 2, 51, 5.32, 42.28, 45.44, 0.37, 15.51, 26.47, 35.79, 49.53, 40.29),
(103, 1, 52, 2.84, 43.36, 8.26, 11.22, 31.31, 22.91, 20.62, 34.35, 9.92),
(104, 2, 52, 46.52, 2.87, 24.76, 15.20, 1.73, 13.03, 9.98, 10.81, 24.11),
(105, 1, 53, 38.13, 18.30, 27.12, 30.69, 22.09, 18.38, 25.63, 23.00, 38.11),
(106, 2, 53, 21.57, 43.53, 2.91, 33.97, 11.14, 3.76, 35.40, 15.73, 22.44),
(107, 1, 54, 15.00, 7.67, 43.36, 43.81, 38.96, 13.38, 49.99, 9.83, 49.16),
(108, 2, 54, 16.31, 34.09, 21.50, 5.22, 11.63, 42.47, 27.46, 9.90, 17.11),
(109, 1, 55, 5.87, 27.99, 22.36, 27.83, 22.06, 26.80, 17.81, 8.68, 39.95),
(110, 2, 55, 23.71, 48.69, 22.34, 15.63, 11.12, 8.72, 10.25, 25.07, 44.62),
(111, 1, 56, 47.88, 5.55, 34.08, 3.79, 16.68, 22.04, 10.17, 34.70, 43.03),
(112, 2, 56, 11.02, 26.03, 47.07, 7.25, 45.07, 3.57, 32.67, 2.61, 15.06),
(113, 1, 57, 17.45, 42.08, 8.06, 14.06, 46.13, 38.47, 3.93, 4.27, 9.54),
(114, 2, 57, 34.90, 45.89, 24.74, 36.05, 6.00, 21.86, 41.29, 40.89, 30.57),
(115, 1, 58, 30.18, 9.18, 5.36, 49.27, 30.29, 3.61, 27.18, 25.09, 43.90),
(116, 2, 58, 44.21, 39.38, 14.27, 3.19, 23.14, 6.12, 11.19, 37.59, 4.38),
(117, 1, 59, 9.15, 32.60, 35.56, 29.98, 43.21, 26.14, 1.04, 26.78, 30.79),
(118, 2, 59, 23.59, 25.59, 7.16, 9.07, 23.84, 42.00, 38.46, 16.31, 16.17),
(119, 1, 60, 31.93, 11.15, 9.95, 16.28, 1.56, 8.98, 40.22, 24.14, 0.04),
(120, 2, 60, 27.78, 38.77, 10.50, 36.20, 49.49, 38.87, 45.85, 12.67, 25.77),
(121, 1, 61, 40.86, 26.98, 12.34, 30.74, 16.69, 41.23, 6.09, 6.77, 15.55),
(122, 2, 61, 7.47, 40.69, 31.03, 33.08, 22.33, 12.41, 45.06, 38.08, 5.20),
(123, 1, 62, 11.78, 43.31, 31.18, 25.98, 36.38, 3.93, 10.51, 40.78, 22.38),
(124, 2, 62, 39.56, 30.64, 34.54, 30.79, 0.30, 9.14, 44.79, 46.53, 48.29),
(125, 1, 63, 1.86, 14.41, 16.48, 39.18, 46.45, 14.71, 34.19, 26.82, 31.53),
(126, 2, 63, 27.21, 41.44, 25.58, 3.59, 41.20, 45.22, 2.52, 26.91, 27.01),
(127, 1, 64, 4.32, 40.57, 39.89, 27.76, 19.10, 12.22, 3.81, 32.37, 0.45),
(128, 2, 64, 5.11, 24.23, 5.80, 6.33, 14.23, 2.17, 18.17, 34.35, 17.24),
(129, 1, 65, 33.14, 13.98, 20.46, 10.38, 40.53, 21.51, 35.95, 15.21, 18.23),
(130, 2, 65, 45.49, 22.75, 27.30, 18.26, 9.38, 42.13, 32.49, 36.06, 32.86),
(131, 1, 66, 6.08, 31.86, 41.03, 9.56, 24.72, 44.92, 0.42, 17.38, 35.60),
(132, 2, 66, 25.89, 22.62, 35.46, 9.44, 40.82, 25.77, 6.39, 4.63, 3.97),
(133, 1, 67, 5.97, 17.95, 21.83, 5.32, 11.10, 39.54, 14.41, 3.42, 23.85),
(134, 2, 67, 9.01, 23.50, 40.49, 31.92, 38.13, 44.90, 10.11, 15.86, 48.94),
(135, 1, 68, 47.14, 38.88, 2.99, 48.32, 32.62, 18.12, 42.76, 9.45, 18.96),
(136, 2, 68, 16.43, 25.28, 27.10, 9.66, 17.00, 6.02, 29.08, 27.37, 49.60),
(137, 1, 69, 15.87, 30.56, 5.20, 34.31, 5.96, 26.88, 16.50, 1.85, 9.77),
(138, 2, 69, 43.31, 37.22, 6.19, 19.26, 27.76, 31.02, 21.81, 16.01, 14.59),
(139, 1, 70, 24.94, 30.91, 29.73, 5.93, 40.48, 34.59, 1.51, 3.79, 14.43),
(140, 2, 70, 10.75, 10.47, 20.09, 19.04, 34.94, 17.58, 33.10, 12.73, 14.37),
(141, 1, 71, 33.65, 25.12, 24.68, 48.03, 16.10, 36.41, 33.77, 9.61, 46.75),
(142, 2, 71, 4.91, 34.31, 6.81, 31.11, 35.14, 32.36, 6.40, 34.92, 5.38),
(143, 1, 72, 22.16, 44.67, 6.87, 0.32, 31.00, 4.04, 27.18, 23.79, 37.43),
(144, 2, 72, 15.76, 16.50, 35.25, 26.72, 27.88, 9.22, 12.46, 34.62, 35.76),
(145, 1, 73, 24.90, 17.26, 11.57, 6.06, 45.60, 9.80, 12.23, 31.75, 22.04),
(146, 2, 73, 14.94, 8.59, 48.11, 14.81, 29.70, 4.07, 31.24, 43.99, 26.23),
(147, 1, 74, 49.17, 17.18, 38.38, 40.36, 36.65, 12.19, 0.97, 18.31, 38.63),
(148, 2, 74, 38.20, 25.14, 11.11, 30.10, 17.18, 45.62, 26.54, 45.85, 49.61),
(149, 1, 75, 10.52, 3.77, 37.30, 25.18, 13.98, 44.39, 30.00, 16.81, 44.06),
(150, 2, 75, 19.86, 17.11, 25.99, 28.63, 15.16, 39.91, 4.07, 0.64, 41.00),
(151, 1, 76, 3.05, 42.27, 2.19, 34.15, 14.17, 18.39, 49.44, 42.05, 11.91),
(152, 2, 76, 33.40, 31.26, 6.11, 36.77, 15.52, 17.30, 39.94, 47.78, 19.08),
(153, 1, 77, 2.08, 3.14, 9.49, 38.00, 11.53, 43.65, 33.66, 37.37, 35.86),
(154, 2, 77, 17.18, 28.33, 40.13, 15.63, 7.77, 41.97, 36.52, 6.70, 23.95),
(155, 1, 78, 49.66, 26.42, 33.14, 36.43, 32.72, 4.34, 23.51, 4.54, 2.18),
(156, 2, 78, 47.29, 29.88, 7.56, 48.15, 18.08, 45.95, 25.52, 39.75, 22.18),
(157, 1, 79, 41.66, 41.74, 33.71, 43.34, 15.56, 47.80, 42.32, 18.18, 13.95),
(158, 2, 79, 15.20, 34.16, 25.21, 23.55, 42.13, 39.98, 23.52, 47.67, 17.80),
(159, 1, 80, 45.98, 26.51, 44.62, 43.57, 33.99, 39.24, 44.24, 3.48, 34.69),
(160, 2, 80, 13.01, 10.97, 15.83, 46.22, 33.61, 29.39, 46.10, 42.36, 23.50),
(161, 1, 81, 40.41, 31.54, 36.49, 37.81, 29.59, 34.52, 33.84, 15.64, 26.68),
(162, 2, 81, 36.47, 2.33, 2.22, 4.13, 13.97, 7.45, 45.34, 4.34, 35.71),
(163, 1, 82, 15.50, 20.39, 5.47, 16.15, 14.33, 23.21, 23.06, 45.66, 9.15),
(164, 2, 82, 8.74, 16.25, 5.02, 26.38, 16.81, 4.91, 24.12, 5.89, 7.07),
(165, 1, 83, 17.70, 17.28, 33.31, 14.69, 23.54, 23.61, 47.44, 16.37, 39.51),
(166, 2, 83, 48.47, 23.79, 23.56, 46.44, 11.52, 18.27, 6.79, 29.15, 25.39),
(167, 1, 84, 39.50, 21.34, 38.18, 26.89, 19.90, 18.83, 34.47, 15.84, 25.78),
(168, 2, 84, 31.40, 29.67, 4.16, 31.76, 46.33, 36.39, 42.93, 5.49, 48.66),
(169, 1, 85, 26.83, 38.19, 10.44, 37.62, 6.80, 21.13, 35.26, 12.92, 8.82),
(170, 2, 85, 5.31, 0.12, 34.68, 23.02, 11.08, 36.35, 48.48, 33.38, 21.43),
(171, 1, 86, 7.01, 20.78, 32.86, 1.95, 11.19, 0.11, 16.95, 34.44, 21.36),
(172, 2, 86, 3.47, 3.29, 6.02, 20.21, 33.02, 4.47, 23.30, 3.09, 45.54),
(173, 1, 87, 18.45, 5.60, 22.65, 46.45, 14.29, 32.11, 17.68, 42.08, 7.36),
(174, 2, 87, 10.57, 30.78, 22.18, 18.55, 26.22, 25.45, 48.58, 16.58, 37.13),
(175, 1, 88, 35.90, 18.14, 33.01, 10.61, 4.00, 38.20, 29.01, 30.43, 15.14),
(176, 2, 88, 34.40, 26.58, 29.68, 18.69, 4.40, 15.92, 16.39, 34.21, 21.89),
(177, 1, 89, 6.81, 18.37, 21.42, 2.01, 45.79, 22.93, 27.28, 17.60, 6.14),
(178, 2, 89, 27.92, 21.19, 22.18, 47.31, 20.03, 8.20, 30.94, 30.08, 7.56),
(179, 1, 90, 47.60, 15.29, 33.67, 22.48, 11.40, 39.55, 13.55, 49.12, 4.94),
(180, 2, 90, 27.32, 21.80, 27.05, 19.85, 18.09, 30.90, 0.22, 8.41, 41.38),
(181, 1, 91, 31.68, 34.25, 26.23, 28.38, 13.20, 30.89, 14.83, 31.48, 12.93),
(182, 2, 91, 20.20, 12.22, 0.49, 15.79, 27.48, 40.02, 17.68, 18.31, 38.53),
(183, 1, 92, 37.71, 22.95, 1.61, 39.21, 41.23, 38.50, 18.84, 28.68, 36.87),
(184, 2, 92, 48.32, 31.00, 10.04, 7.19, 5.85, 7.65, 20.72, 30.65, 41.09),
(185, 1, 93, 13.51, 44.27, 30.81, 21.26, 13.84, 5.45, 35.74, 12.33, 4.44),
(186, 2, 93, 35.21, 12.73, 8.03, 1.94, 35.62, 22.28, 4.54, 5.85, 15.62),
(187, 1, 94, 10.58, 6.03, 48.40, 23.92, 24.41, 0.30, 28.26, 40.38, 17.14),
(188, 2, 94, 14.56, 21.36, 13.12, 1.54, 18.34, 37.08, 30.40, 40.73, 12.47),
(189, 1, 95, 40.13, 13.28, 45.98, 40.06, 12.37, 41.67, 21.26, 31.26, 42.54),
(190, 2, 95, 18.90, 16.91, 27.82, 38.37, 8.40, 26.88, 9.21, 15.39, 49.32),
(191, 1, 96, 0.44, 4.26, 19.95, 36.97, 24.99, 14.06, 45.32, 34.42, 36.15),
(192, 2, 96, 27.48, 28.97, 12.40, 25.09, 38.24, 15.95, 15.01, 27.20, 40.98),
(193, 1, 97, 23.30, 43.56, 47.90, 8.82, 0.40, 25.53, 26.47, 5.76, 49.38),
(194, 2, 97, 29.63, 49.99, 11.07, 5.38, 43.70, 2.36, 30.70, 46.41, 39.97),
(195, 1, 98, 10.60, 33.12, 33.77, 19.49, 46.14, 22.23, 22.72, 46.90, 16.35),
(196, 2, 98, 41.04, 6.14, 7.61, 19.63, 25.29, 17.58, 12.05, 7.48, 1.25),
(197, 1, 99, 33.83, 15.39, 25.46, 31.13, 29.29, 3.03, 27.29, 27.36, 4.92),
(198, 2, 99, 42.53, 47.87, 11.79, 15.32, 41.22, 10.15, 27.10, 5.05, 43.95),
(199, 1, 100, 4.61, 41.20, 42.15, 37.17, 9.40, 35.48, 49.21, 39.63, 0.49),
(200, 2, 100, 33.57, 16.36, 31.10, 6.42, 38.81, 24.77, 7.41, 12.75, 41.54),
(201, 1, 101, 19.45, 22.63, 4.81, 6.14, 16.26, 12.91, 15.74, 40.00, 2.77),
(202, 2, 101, 43.83, 10.84, 22.74, 31.15, 37.53, 44.20, 8.40, 9.40, 21.82),
(203, 1, 102, 30.87, 38.91, 1.95, 42.99, 9.12, 16.64, 5.81, 29.15, 28.30),
(204, 2, 102, 4.08, 35.48, 15.18, 19.45, 1.71, 0.21, 45.92, 28.96, 7.06),
(205, 1, 103, 48.43, 20.95, 9.46, 34.45, 43.86, 15.95, 48.16, 42.98, 20.40),
(206, 2, 103, 23.06, 4.10, 1.32, 44.28, 17.46, 4.47, 19.95, 36.33, 21.82),
(207, 1, 104, 0.13, 35.15, 25.40, 21.51, 31.38, 42.36, 17.65, 11.18, 2.94),
(208, 2, 104, 31.17, 47.02, 41.59, 16.87, 9.60, 47.41, 8.22, 48.89, 19.79),
(209, 1, 105, 2.29, 2.08, 3.51, 11.33, 46.10, 46.53, 44.35, 32.13, 27.64),
(210, 2, 105, 41.79, 26.01, 4.72, 45.53, 13.51, 30.97, 14.33, 28.72, 0.61),
(211, 1, 106, 16.89, 32.63, 12.48, 14.50, 35.08, 31.91, 4.30, 25.76, 15.89),
(212, 2, 106, 2.19, 13.26, 9.73, 8.89, 15.24, 49.52, 1.89, 10.91, 48.87),
(213, 1, 107, 11.61, 11.42, 22.31, 27.27, 19.42, 15.30, 18.22, 45.20, 21.36),
(214, 2, 107, 21.21, 41.95, 46.15, 4.86, 35.88, 14.80, 16.38, 37.50, 38.37),
(215, 1, 108, 29.34, 31.58, 19.90, 4.76, 14.08, 6.12, 38.39, 23.56, 2.63),
(216, 2, 108, 42.48, 4.51, 45.12, 12.05, 24.89, 38.32, 16.93, 19.66, 47.55),
(217, 1, 109, 28.74, 1.04, 19.01, 41.91, 2.52, 36.89, 26.88, 23.71, 37.92),
(218, 2, 109, 18.46, 28.55, 37.37, 1.21, 43.95, 16.10, 48.64, 44.92, 28.69),
(219, 1, 110, 8.67, 7.29, 10.45, 30.37, 20.52, 11.47, 45.80, 44.59, 35.54),
(220, 2, 110, 43.93, 13.02, 33.31, 27.48, 37.47, 4.91, 12.14, 45.95, 43.36),
(221, 1, 111, 28.95, 14.65, 36.42, 38.12, 31.37, 42.48, 18.31, 14.08, 15.47),
(222, 2, 111, 35.12, 29.20, 40.62, 15.52, 5.75, 32.16, 43.57, 21.38, 26.18),
(223, 1, 112, 16.77, 5.31, 26.25, 15.29, 47.71, 42.69, 20.32, 23.51, 6.61),
(224, 2, 112, 12.51, 42.71, 26.05, 2.08, 32.29, 5.18, 29.03, 29.63, 11.06),
(225, 1, 113, 16.39, 48.79, 44.78, 27.51, 3.20, 33.48, 7.80, 38.58, 19.49),
(226, 2, 113, 31.71, 0.08, 5.25, 26.01, 14.32, 43.58, 24.92, 43.89, 44.65),
(227, 1, 114, 41.60, 24.06, 45.48, 5.24, 39.73, 32.96, 45.61, 29.16, 8.95),
(228, 2, 114, 7.29, 9.59, 26.10, 1.72, 30.31, 46.39, 41.02, 15.92, 6.55),
(229, 1, 115, 34.99, 5.31, 21.56, 41.87, 44.65, 47.68, 4.42, 29.06, 32.05),
(230, 2, 115, 23.07, 19.20, 26.81, 26.42, 1.69, 29.18, 40.83, 16.61, 10.55),
(231, 1, 116, 2.91, 32.90, 5.78, 30.20, 33.65, 27.66, 37.33, 3.70, 6.50),
(232, 2, 116, 21.40, 37.51, 23.33, 4.13, 0.65, 40.88, 2.43, 39.50, 40.24),
(233, 1, 117, 32.68, 42.69, 15.39, 48.90, 48.32, 44.88, 29.47, 12.71, 25.14),
(234, 2, 117, 37.55, 12.34, 49.05, 8.21, 43.92, 44.98, 43.14, 30.74, 24.29),
(235, 1, 118, 29.25, 23.37, 29.09, 25.36, 39.51, 21.49, 38.92, 30.14, 33.93),
(236, 2, 118, 29.24, 44.40, 34.27, 38.16, 37.99, 25.48, 13.42, 40.68, 13.11),
(237, 1, 119, 43.54, 28.34, 11.10, 20.46, 18.99, 33.59, 10.96, 4.02, 37.25),
(238, 2, 119, 24.19, 9.18, 23.32, 39.09, 25.48, 10.11, 24.12, 40.26, 28.96),
(239, 1, 120, 24.00, 33.13, 43.66, 18.90, 13.53, 10.96, 14.20, 38.14, 48.09),
(240, 2, 120, 26.02, 35.83, 1.09, 47.94, 36.46, 38.47, 32.95, 49.35, 47.90),
(241, 1, 121, 41.45, 13.54, 43.36, 26.18, 0.82, 25.55, 25.29, 49.81, 23.16),
(242, 2, 121, 16.38, 12.41, 12.90, 27.30, 47.78, 6.99, 41.62, 37.14, 10.85),
(243, 1, 122, 42.80, 31.47, 28.96, 0.40, 15.09, 24.27, 26.09, 7.64, 9.93),
(244, 2, 122, 26.74, 3.91, 39.32, 34.86, 6.36, 27.19, 16.89, 2.89, 13.78),
(245, 1, 123, 10.21, 9.71, 17.91, 10.42, 48.40, 10.71, 8.34, 9.59, 22.92),
(246, 2, 123, 35.82, 10.36, 44.33, 40.57, 19.88, 27.68, 28.74, 10.66, 17.09),
(247, 1, 124, 3.48, 16.12, 20.14, 2.37, 1.40, 49.90, 45.31, 26.84, 48.29),
(248, 2, 124, 10.94, 9.80, 16.21, 1.62, 9.50, 42.61, 34.57, 45.00, 21.30),
(249, 1, 125, 21.51, 43.64, 3.67, 37.42, 26.09, 18.20, 12.73, 9.03, 6.98),
(250, 2, 125, 7.81, 18.09, 17.05, 30.97, 3.70, 25.57, 16.77, 7.13, 35.32),
(251, 1, 126, 5.24, 20.23, 35.43, 16.44, 25.93, 30.34, 23.90, 28.47, 20.67),
(252, 2, 126, 17.91, 27.56, 34.07, 37.68, 36.20, 17.94, 31.11, 1.71, 15.25),
(253, 1, 127, 21.12, 9.83, 35.78, 49.42, 39.77, 0.58, 33.61, 16.30, 30.68),
(254, 2, 127, 4.49, 30.42, 38.63, 1.87, 43.46, 11.70, 28.12, 5.52, 43.21),
(255, 1, 128, 49.49, 17.82, 40.62, 49.63, 26.31, 32.68, 34.43, 24.14, 17.38),
(256, 2, 128, 14.51, 20.38, 8.37, 30.74, 28.57, 0.63, 17.44, 35.30, 24.19),
(257, 1, 129, 15.05, 2.66, 18.16, 32.81, 9.59, 49.52, 18.80, 45.47, 20.96),
(258, 2, 129, 18.38, 29.03, 40.01, 12.94, 44.68, 34.57, 38.82, 40.39, 35.51),
(259, 1, 130, 6.35, 25.24, 7.16, 10.05, 28.80, 13.85, 32.84, 22.67, 14.81),
(260, 2, 130, 6.05, 35.81, 10.92, 47.14, 2.95, 23.33, 7.79, 18.97, 21.50),
(261, 1, 131, 0.56, 38.30, 39.81, 34.17, 1.41, 4.53, 18.42, 28.50, 37.23),
(262, 2, 131, 0.69, 41.73, 6.57, 7.69, 18.72, 20.52, 46.47, 20.77, 14.44),
(263, 1, 132, 9.91, 6.22, 1.36, 38.13, 36.60, 18.59, 33.17, 10.09, 0.92),
(264, 2, 132, 24.32, 18.86, 21.32, 0.01, 36.11, 30.51, 44.23, 29.63, 15.45),
(265, 1, 133, 38.35, 45.40, 11.97, 23.63, 32.24, 40.30, 4.80, 3.08, 1.01),
(266, 2, 133, 45.80, 26.00, 42.56, 34.83, 46.46, 27.83, 49.74, 15.24, 26.96),
(267, 1, 134, 39.07, 14.50, 5.25, 32.79, 48.18, 42.54, 18.16, 13.19, 11.46),
(268, 2, 134, 17.73, 4.29, 18.23, 28.31, 36.86, 49.34, 36.13, 32.65, 4.85),
(269, 1, 135, 26.31, 16.99, 6.01, 29.09, 27.41, 49.77, 16.64, 33.90, 19.56),
(270, 2, 135, 46.11, 21.86, 20.97, 39.26, 33.39, 49.17, 45.68, 30.91, 17.52),
(271, 1, 136, 44.84, 21.66, 23.75, 3.81, 47.77, 27.43, 43.86, 37.00, 3.40),
(272, 2, 136, 6.01, 19.86, 31.25, 46.70, 39.72, 8.52, 23.45, 41.69, 38.08),
(273, 1, 137, 15.32, 12.39, 15.97, 42.68, 15.49, 49.41, 0.56, 4.60, 21.30),
(274, 2, 137, 42.71, 49.66, 20.15, 1.79, 48.49, 37.09, 39.96, 38.55, 22.87),
(275, 1, 138, 48.71, 24.93, 28.54, 17.89, 3.84, 15.54, 16.17, 34.23, 22.66),
(276, 2, 138, 10.59, 34.98, 43.12, 10.66, 23.96, 37.82, 17.21, 22.60, 11.34),
(277, 1, 139, 38.93, 10.62, 36.29, 49.60, 39.14, 46.88, 17.00, 44.34, 20.72),
(278, 2, 139, 20.57, 40.68, 41.69, 36.41, 6.98, 25.67, 7.43, 10.14, 28.40),
(279, 1, 140, 11.57, 22.66, 28.61, 25.04, 39.38, 21.79, 40.80, 38.63, 20.76),
(280, 2, 140, 37.89, 27.18, 22.21, 29.53, 31.02, 16.51, 39.50, 47.97, 21.32),
(281, 1, 141, 12.72, 49.64, 10.01, 1.17, 25.79, 25.43, 49.80, 22.70, 14.11),
(282, 2, 141, 2.46, 19.97, 42.45, 2.34, 34.34, 14.69, 20.44, 8.12, 29.28),
(283, 1, 142, 22.04, 22.36, 45.69, 11.34, 19.66, 14.27, 12.36, 18.98, 7.85),
(284, 2, 142, 32.29, 37.91, 42.66, 49.57, 19.89, 0.74, 44.02, 17.86, 7.26),
(285, 1, 143, 32.73, 41.86, 11.10, 29.93, 16.34, 41.89, 10.47, 26.66, 1.88),
(286, 2, 143, 29.44, 41.53, 19.35, 22.17, 2.80, 47.48, 29.01, 2.61, 26.00),
(287, 1, 144, 22.19, 32.96, 48.23, 42.25, 16.55, 6.00, 30.36, 33.82, 28.00),
(288, 2, 144, 38.54, 8.72, 27.95, 13.59, 34.11, 29.78, 46.57, 43.49, 27.77),
(289, 1, 145, 8.38, 8.57, 17.70, 12.82, 10.99, 16.51, 49.54, 48.20, 42.39),
(290, 2, 145, 17.34, 9.55, 45.71, 49.89, 12.34, 12.04, 23.18, 29.76, 29.26),
(291, 1, 146, 7.04, 47.42, 15.96, 37.57, 39.94, 37.01, 15.22, 15.07, 29.70),
(292, 2, 146, 3.28, 27.31, 26.72, 1.65, 28.08, 35.44, 42.99, 8.61, 14.09),
(293, 1, 147, 44.63, 30.89, 20.54, 10.02, 38.48, 12.34, 46.27, 44.33, 32.82),
(294, 2, 147, 31.13, 7.17, 42.47, 40.86, 26.86, 11.75, 28.14, 5.48, 42.98),
(295, 1, 148, 48.45, 13.33, 21.28, 16.44, 18.33, 42.32, 6.61, 6.10, 10.69),
(296, 2, 148, 35.12, 43.53, 12.30, 30.89, 17.55, 45.10, 22.84, 28.91, 26.01),
(297, 1, 149, 43.34, 38.67, 13.33, 0.64, 13.23, 14.20, 31.30, 13.93, 25.72),
(298, 2, 149, 36.82, 6.93, 24.22, 0.29, 28.79, 43.09, 29.07, 16.09, 43.25),
(299, 1, 150, 17.99, 10.18, 46.96, 4.22, 30.24, 38.53, 1.92, 44.01, 14.30),
(300, 2, 150, 39.45, 4.36, 3.44, 4.11, 10.23, 38.84, 13.49, 0.95, 14.29),
(301, 1, 151, 18.57, 0.01, 44.32, 21.57, 24.91, 9.85, 24.49, 42.91, 41.08),
(302, 2, 151, 26.67, 10.11, 20.55, 22.43, 0.49, 35.17, 24.37, 16.36, 8.68),
(303, 1, 152, 44.31, 45.51, 44.64, 36.68, 49.46, 37.28, 38.02, 28.25, 27.21),
(304, 2, 152, 1.28, 24.78, 20.04, 25.88, 19.26, 18.65, 35.48, 21.47, 0.90),
(305, 1, 153, 40.07, 47.65, 18.07, 47.37, 32.64, 21.08, 7.50, 24.25, 48.77),
(306, 2, 153, 21.07, 9.06, 32.10, 33.31, 20.24, 1.26, 45.60, 24.21, 34.23),
(307, 1, 154, 48.54, 40.02, 4.49, 2.37, 48.39, 34.84, 29.02, 40.58, 15.83),
(308, 2, 154, 7.44, 39.69, 26.13, 11.59, 29.56, 13.03, 26.48, 43.31, 37.09),
(309, 1, 155, 5.54, 16.42, 15.48, 28.14, 44.25, 36.84, 1.44, 46.69, 29.12),
(310, 2, 155, 5.53, 40.30, 34.89, 3.55, 13.10, 4.86, 34.98, 10.34, 46.76),
(311, 1, 156, 2.77, 23.55, 9.46, 26.66, 4.93, 44.66, 8.51, 8.56, 17.26),
(312, 2, 156, 10.65, 1.44, 25.27, 22.03, 34.34, 5.63, 25.11, 8.64, 17.90),
(313, 1, 157, 13.59, 14.22, 30.34, 9.03, 4.14, 43.61, 5.62, 47.26, 19.47),
(314, 2, 157, 5.54, 19.28, 29.82, 41.23, 16.68, 9.72, 48.55, 13.58, 22.26),
(315, 1, 158, 20.56, 36.01, 18.36, 33.78, 13.82, 17.76, 47.35, 33.46, 25.27),
(316, 2, 158, 25.95, 3.93, 41.81, 47.26, 10.87, 12.58, 30.29, 13.72, 27.72),
(317, 1, 159, 47.43, 4.02, 27.78, 26.84, 0.87, 23.81, 16.46, 10.86, 4.92),
(318, 2, 159, 42.03, 45.40, 0.91, 18.35, 39.01, 40.02, 33.08, 45.32, 27.35),
(319, 1, 160, 0.81, 22.00, 7.58, 21.89, 36.72, 17.91, 29.41, 43.33, 28.39),
(320, 2, 160, 11.96, 24.62, 37.23, 12.30, 49.82, 12.18, 11.46, 20.76, 19.43);

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
(1, 'GV-2000', 'Pepsi', 10, 5750, 39.93),
(2, 'GV-2000', 'Pepsi', 10, 5750, 39.93);

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
(14, 'gestion_productiva', 'gestion_moldes');

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
(104, 10, 5),
(105, 10, 6),
(106, 10, 11),
(107, 10, 12),
(108, 10, 13),
(109, 10, 14),
(110, 10, 1),
(111, 10, 2),
(112, 10, 3),
(113, 10, 7),
(114, 10, 4);

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
(10, 'string', 'prueba', '$argon2id$v=19$m=65536,t=3,p=4$CkFIaY1RivHeu9e6NyaEsA$rtdZu3HTE9nKFkeXi/QguC7E5wxIKoaruCOY7ojW17U', 'string', 'string', 'string', 'string@d', 'administrador', 1, '2026-08-09 14:46:05');

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
-- Indices de la tabla `gestion_productiva_entrada`
--
ALTER TABLE `gestion_productiva_entrada`
  ADD PRIMARY KEY (`id_produccion`);

--
-- Indices de la tabla `gestion_productiva_resultado`
--
ALTER TABLE `gestion_productiva_resultado`
  ADD PRIMARY KEY (`id_resultado`),
  ADD KEY `fk_resultado_produccion` (`id_produccion`);

--
-- Indices de la tabla `gestion_productiva_salida`
--
ALTER TABLE `gestion_productiva_salida`
  ADD PRIMARY KEY (`id_eficiencia`),
  ADD KEY `fk_salida_molde` (`modelo_molde`),
  ADD KEY `fk_salida_produccion` (`id_produccion`);

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
-- AUTO_INCREMENT de la tabla `gestion_productiva_entrada`
--
ALTER TABLE `gestion_productiva_entrada`
  MODIFY `id_produccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=256;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_resultado`
--
ALTER TABLE `gestion_productiva_resultado`
  MODIFY `id_resultado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=256;

--
-- AUTO_INCREMENT de la tabla `gestion_productiva_salida`
--
ALTER TABLE `gestion_productiva_salida`
  MODIFY `id_eficiencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=512;

--
-- AUTO_INCREMENT de la tabla `moldes`
--
ALTER TABLE `moldes`
  MODIFY `id_molde` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `permisos_modulos`
--
ALTER TABLE `permisos_modulos`
  MODIFY `id_permisom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `permisos_usuarios`
--
ALTER TABLE `permisos_usuarios`
  MODIFY `id_permisou` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

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
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
-- Filtros para la tabla `gestion_productiva_resultado`
--
ALTER TABLE `gestion_productiva_resultado`
  ADD CONSTRAINT `fk_resultado_produccion` FOREIGN KEY (`id_produccion`) REFERENCES `gestion_productiva_entrada` (`id_produccion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `gestion_productiva_salida`
--
ALTER TABLE `gestion_productiva_salida`
  ADD CONSTRAINT `fk_salida_molde` FOREIGN KEY (`modelo_molde`) REFERENCES `moldes` (`id_molde`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_salida_produccion` FOREIGN KEY (`id_produccion`) REFERENCES `gestion_productiva_entrada` (`id_produccion`) ON DELETE CASCADE;

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
