# El main.py es el cerebro ejecutable de todo el sistema


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importamos el router desde tu módulo de insumos
from backend.modules.inventario_insumos.router import router as insumos_router

# Importamos el router desde tu módulo de pantallas
from backend.modules.inventario_pantallas.router import router as pantallas_router

# Importamos el router desde tu módulo de rendimiento
from backend.modules.rendimiento.router import router as rendimiento_router

# Importamos el router del módulo de gestión de usuarios
from backend.modules.gestion_usuarios.router import router as gestion_usuarios_router

# Importamos el router del módulo de autenticación
from backend.modules.auth.router import router as auth_router

# Importamos el router del nuevo módulo de gestión productiva
from backend.modules.gestion_productiva.produccion.router import router as gestion_productiva_router

# Importamos el router del módulo de moldes
from backend.modules.gestion_productiva.gestion_moldes.router import router as moldes_router

# Importamos el router del módulo de justificantes
from backend.modules.gestion_productiva.gestion_justificantes.router import router as justificantes_router

# Importamos el router del módulo de exportación
from backend.modules.exportacion.router import router as exportacion_router


# Inicializamos la aplicación FastAPI
app = FastAPI(
    title="API Venvidrio Zona Decoración",
    description="Backend para el control de insumos y producción",
    version="1.0.0"
)

# Configuración de CORS: Vital para que el frontend (React)
# pueda hacer peticiones sin que el navegador lo bloquee.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos las rutas del módulo de insumos
app.include_router(insumos_router)

# Registramos las rutas del módulo de pantallas
app.include_router(pantallas_router)

# Registramos las rutas del módulo del rendimiento
app.include_router(rendimiento_router)

# Registramos las rutas del módulo de gestión de usuarios
app.include_router(gestion_usuarios_router)

# Registramos las rutas del módulo de autenticación
app.include_router(auth_router)

# Registramos las rutas del módulo de gestión productiva
app.include_router(gestion_productiva_router)

# Registramos las rutas del módulo de moldes
app.include_router(moldes_router)

# Registramos las rutas del módulo de justificantes
app.include_router(justificantes_router)

# Registramos las rutas del módulo de exportación
app.include_router(exportacion_router)

# Ruta base de prueba
@app.get("/")
def ruta_raiz():
    return {"mensaje": "¡El servidor de la Zona de Decoración está funcionando correctamente!"}