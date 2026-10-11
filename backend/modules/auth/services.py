# backend/modules/auth/services.py

from dotenv import load_dotenv
load_dotenv()

import os
from datetime import datetime, timedelta
import jwt
from sqlalchemy.orm import Session

from backend.modules.gestion_usuarios.models import Usuario, PermisoUsuario, PermisoModulo
from .schemas import LoginRequest
from backend.utils.seguridad import verificar_contrasena

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
EXPIRATION_MINUTES = int(os.environ.get("JWT_EXPIRATION_MINUTES", 60))


#COMENTARIO: GENERAR TOKEN
def crear_token_acceso(datos: dict):
    datos_a_codificar = datos.copy()
    expiracion = datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES)
    datos_a_codificar.update({"exp": expiracion})
    token = jwt.encode(datos_a_codificar, SECRET_KEY, algorithm=ALGORITHM)
    token = token if isinstance(token, str) else token.decode("utf-8")
    return token


#COMENTARIO: LOGIN
def login_usuario(db: Session, datos: LoginRequest):
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

    #COMENTARIO: consulta los permisos del usuario para incluirlos en la respuesta del login
    permisos = (
        db.query(PermisoModulo)
        .join(PermisoUsuario, PermisoUsuario.id_permisom == PermisoModulo.id_permisom)
        .filter(PermisoUsuario.id_usuario == usuario.id_usuario)
        .all()
    )

    return {
        "status": "success",
        "access_token": token,
        "rol": usuario.rol,
        "nombres": usuario.nombres,
        "apellidos": usuario.apellidos,
        "permisos": [{"modulo": p.modulo, "accion": p.accion} for p in permisos]
    }