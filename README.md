# Zona de Decoración - Aplicación de Gestión Administrativa

## Proyecto Socio Tecnológico IV (PST) - Programa Nacional de Formación en Informática (PNFI)

### Universidad Politécnica Territorial del Estado Trujillo "Mario Briceño Iragorry" (UPTTMBI)

## Título del Proyecto

Desarrollo de una Aplicación Administrativa para la Zona de Decoración en Venezolana del Vidrio C.A (Venvidrio)

<p align="center">
  <img src="public/favicon.ico" alt="Logo Venvidrio" width="120" />
</p>

## Descripción general

Aplicación web para la gestión administrativa y operativa de la Zona de Decoración en la Venezolana del Vidrio C.A (Venvidrio), diseñada para optimizar el control de inventarios, producción, rendimiento, usuarios y procesos gerenciales de la organización.

Este proyecto tiene como propósito digitalizar y fortalecer la gestión interna de la empresa mediante una solución integral basada en tecnologías modernas. El sistema permite supervisar operaciones clave en la cadena de producción y logística, facilitar la toma de decisiones y mejorar la trazabilidad de las actividades diarias.

## Módulos de la Aplicación

### 1. Sección de Inicio de Sesión

- Panel de acceso exclusivo para los trabajadores registrados de la planta.

### 2. Análisis de Rendimiento

- Visualización de indicadores claves de desempeño.
- Establecimiento de metas de máximos de deficiencia en diferentes períodos de tiempo.

### 3. Inventario de insumos

- Registro de entradas y salidas.
- Consulta del stock disponible.
- Historial de movimientos.

### 4. Inventario de pantallas

- Control del inventario de pantallas para la decoración.
- Registro de entradas/salidas.
- Consulta histórica para auditoría.

### 5. Gestión productiva

- Control y registro de la producción diaria en la línea de decoración.
- Exportación de los registros de producción para auditoría gerencial.

### 6. Gestión de Moldeas

- Registro y edición de los moldes operativos de la planta.

### 7. Gestión de Justificantes

- Administración de las justificantes que pueden asociar los trabajadores en las pérdidas de envases durante el proceso de decorado.

### 8. Gestión de usuarios

- Registro de usuarios.
- Administración de permisos y accesos.
- Control de autenticación y autorización del sistema.

### 9. Sistema de Notificaciones

- Envío de notificaciones mediante correo electrónico sobre stock bajo de inventario y sobre el rendimiento de la Zona de Decoración cuando esté por debajo de estándares establecidos.

### 10. Exportación de reportes

- Generación de reportes Excel en los módulos más importantes de la aplicación.

## Stack tecnológico

### Stack Frontend

- React
- TypeScript
- Vite
- React Router DOM
- Recharts

### Stack Backend

- Python
- FastAPI
- SQLAlchemy
- PyMySQL
- JWT para autenticación
- OpenPyXL para trabajo con archivos Excel

### Base de datos

- MySQL
- Script SQL de estructura y carga inicial disponible en la carpeta `db/`

## Estructura general del proyecto

```text
zona-decoracion-venvidrio/
├── backend/
│   ├── database/
│   ├── modules/
│   ├── utils/
│   └── main.py
├── db/
│   └── venvidrio_zona_decoracion.sql
├── docs/
│   ├── endpoints/
│   └── GUIA.txt
├── public/
├── src/
│   ├── components/
│   ├── config/
│   ├── contexts/
│   ├── hooks/
│   ├── layout/
│   ├── modules/
│   └── types/
├── README.md
├── package.json
├── requirements.txt
├── vite.config.ts
├── tsconfig.json
├── index.html
└── eslint.config.js
```

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Python 3.10 o superior
- Node.js 18 o superior
- MySQL o un servidor compatible con la base de datos del proyecto
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/alexander-bbr/zona-decoracion-venvidrio.git
cd zona-decoracion-venvidrio
```

O si lo tienes, también puedes utilizar el código fuente directamente.

### 2. Instalar dependencias del backend

Por Terminal, introduce los siguientes comandos.

```bash
python -m venv venv
```

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\venv\Scripts\Activate.ps1
```

```bash
pip install -r requirements.txt
```

### 3. Instalar dependencias del frontend

```bash
npm install
```

### 4. Configurar la base de datos

Importa el script SQL ubicado en:

```text
db/venvidrio_zona_decoracion.sql
```

Asegúrate de que la configuración de conexión a la base de datos en el backend coincida con tu entorno local.

## Ejecución del proyecto

### Backend

```bash
uvicorn backend.main:app --reload
```

o

```bash
python -m uvicorn backend.main:app --reload
```

La API estará disponible en:

- [http://localhost:8000](http://localhost:8000)
- Documentación Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend

```bash
npm run dev
```

La aplicación web se abrirá en el navegador y quedará disponible en el puerto de Vite, generalmente:

- [http://localhost:5173](http://localhost:5173)

## Equipo de desarrollo

- Miguel Bethancourt
- Daniel Pérez
- Jose Faria
- Fabio Romero

## Nota final

Este proyecto representa una solución aplicada dentro del marco del Proyecto Socio Tecnológico IV, integrando los conocimientos adquiridos a lo largo del Programa Nacional de Formación en Informática: Algorítmica y Programación, Bases de Datos, Ingeniería del Software, Gestión de Proyecto, Seguridad Informática, Auditoría Informática y más.

Este proyecto es el reflejo de un sueño colectivo de cuatro estudiantes, de una juventud que decidió construir futuro desde las aulas, con código, con esfuerzo y con amor por Venezuela y por la Tecnología. La ingeniería informática no solo nos formó como profesionales: nos enseñó a creer que lo difícil o imposible solo tarda un poco más.

> _Que este proyecto sea solo el primero de muchos triunfos, y que nunca nos falte la suerte para encontrarnos, la valentía para intentarlo y el éxito para celebrarlo juntos._
