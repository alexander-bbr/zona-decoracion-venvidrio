# backend/database/conexion.py
import os
from pathlib import Path
from dotenv import load_dotenv

# Importamos las herramientas clave de SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Esto le dice a Python: "Busca el .env en la misma carpeta donde está este script"
#BASE_DIR = Path(__file__).resolve().parent
#load_dotenv(dotenv_path=BASE_DIR / ".env")
load_dotenv()  # <--- AGREGA ESTO para leer el archivo .env

# Ahora las variables deberían cargar correctamente
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_NAME = os.getenv('DB_NAME')

# DEBUG: Imprimir variables para asegurar que cargan
print(f"DEBUG: Intentando conectar a {DB_HOST} con usuario {DB_USER} en BD {DB_NAME}")

# 2. CONSTRUIR LA RUTA: SQLAlchemy necesita una "URL" específica para saber a dónde ir.
# El formato es: mysql+pymysql://usuario:contraseña@servidor:puerto/nombre_base_datos
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# 3. CREAR EL MOTOR (Engine): Es el "corazón" de SQLAlchemy que hace el trabajo pesado de conectarse a MySQL.
# pool_pre_ping=True -> verifica que la conexión siga viva antes de usarla (evita conexiones "muertas")
# pool_recycle=280 -> recicla las conexiones antes de que MySQL las cierre por inactividad (wait_timeout)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=280
)

# 4. FÁBRICA DE SESIONES (SessionLocal): Es como una operadora telefónica. 
# Cada vez que FastAPI necesite hablar con la base de datos, le pedirá una línea (sesión) a esta fábrica.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. LA BASE (¡EL SELLO OFICIAL!): Esta es la variable que importarás en tu archivo models.py
Base = declarative_base()

# ---------------------------------------------------------
# 6. FUNCIÓN DE DEPENDENCIA PARA FastAPI
# ---------------------------------------------------------
def get_db():
    """
    Función que se usará como dependencia en los endpoints de FastAPI.
    Proporciona una sesión de base de datos y la cierra automáticamente al finalizar.
    """
    db = SessionLocal()
    try:
        # Forzamos una comprobación de la conexión para detectar errores antes de la petición
        db.connection() 
        yield db
    except Exception as e:
        print(f"--- ERROR CRÍTICO AL CONECTAR A LA BD ---")
        print(f"Detalle del error: {e}")
        print(f"----------------------------------------")
        raise e # Esto lanzará el error en la consola y mantendrá el 500
    finally:
        db.close()

# ---------------------------------------------------------
# CÓDIGO DE PRUEBA LOCAL (Solo se ejecuta si le das a "Play" a este archivo)
# ---------------------------------------------------------
if __name__ == "__main__":
    try:
        # Intentamos encender el motor y tocar la puerta de la base de datos
        with engine.connect() as connection:
            print("¡Éxito total! Conexión a la base de datos establecida con SQLAlchemy.")
    except Exception as e:
        print(f"Uy, hubo un error al conectar: {e}")