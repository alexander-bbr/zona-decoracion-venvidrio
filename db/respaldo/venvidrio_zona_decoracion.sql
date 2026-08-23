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
(4, 'insumo_pintura', 'crear_registro'),
(5, 'insumo_pintura', 'crear_consumo'),
(6, 'produccion_lisa', 'ver_inventario'),
(7, 'produccion_lisa', 'ver_historial'),
(8, 'produccion_lisa', 'crear_registro'),
(9, 'produccion_lisa', 'crear_salida'),
(16, 'dashboard', 'ver'),
(17, 'gestion_usuarios', 'ver_usuarios'),
(18, 'gestion_usuarios', 'crear_editar'),
(19, 'insumo_pintura', 'ver_historial_consumo');

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
(47, 10, 1),
(48, 10, 4),
(49, 10, 5),
(50, 10, 6),
(51, 10, 7),
(52, 10, 8),
(53, 10, 9),
(54, 10, 17),
(55, 10, 18),
(56, 10, 19),
(57, 10, 16);

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
-- AUTO_INCREMENT de la tabla `permisos_modulos`
--
ALTER TABLE `permisos_modulos`
  MODIFY `id_permisom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `permisos_usuarios`
--
ALTER TABLE `permisos_usuarios`
  MODIFY `id_permisou` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

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
