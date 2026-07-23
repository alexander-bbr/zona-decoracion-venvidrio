# backend/modules/auth/services.py

from dotenv import load_dotenv
load_dotenv()

import os
from datetime import datetime, timedelta
from jose import jwt
from sqlalchemy.orm import Session

from backend.modules.gestion_usuarios.models import Usuario
from .schemas import LoginRequest
from backend.utils.seguridad import verificar_contrasena

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
EXPIRATION_MINUTES = int(os.environ.get("JWT_EXPIRATION_MINUTES", 60))



# GENERAR TOKEN

def crear_token_acceso(datos: dict):
    """
    Genera el JWT firmado con los datos del usuario y su fecha de expiración.
    """
    datos_a_codificar = datos.copy()
    expiracion = datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES)
    datos_a_codificar.update({"exp": expiracion})

    token = jwt.encode(datos_a_codificar, SECRET_KEY, algorithm=ALGORITHM)
    return token



# LOGIN

def login_usuario(db: Session, datos: LoginRequest):
    """
    Valida carnet + contraseña y retorna el token si todo es correcto.
    """
    usuario = db.query(Usuario).filter(Usuario.carnet_usuario == datos.carnet_usuario).first()

    if not usuario:
        return {"status": "error", "message": "Carnet o contraseña incorrectos"}

    if not usuario.activo_usuario:
        return {"status": "error", "message": "Usuario desactivado, contacte al administrador"}

    if not verificar_contrasena(datos.contrasena, usuario.contrasena):
        return {"status": "error", "message": "Carnet o contraseña incorrectos"}

    token = crear_token_acceso({
        "id_usuario": usuario.id_usuario,
        "carnet_usuario": usuario.carnet_usuario,
        "rol": usuario.rol
    })

    return {
        "status": "success",
        "access_token": token,
        "rol": usuario.rol,
        "nombres": usuario.nombres,
        "apellidos": usuario.apellidos
    }