# backend/modules/gestion_usuarios/dependencies.py

from dotenv import load_dotenv
load_dotenv()

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
import os

from backend.database.conexion import get_db
from .models import Usuario, PermisoUsuario, PermisoModulo

# Define el esquema para extraer el token Bearer del header Authorization.
# Apunta al endpoint de login del módulo auth para la documentación de Swagger.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")


def obtener_usuario_actual(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> Usuario:
    """
    1. Lee el token del request.
    2. Verifica que sea válido y no haya expirado.
    3. Consulta si el usuario existe y está activo en la base de datos.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales o la sesión ha expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # decodifica el JWT y extrae el id del usuario
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_usuario: int = payload.get("id_usuario")
        
        if id_usuario is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    
    if usuario is None or not usuario.activo_usuario:
        raise credentials_exception
        
    return usuario


def require_permiso(modulo_nombre: str, accion_nombre: str):
    """
    Fábrica de dependencias que valida si el usuario autenticado cuenta 
    con el permiso específico para el módulo y la acción solicitada.
    """
    def permiso_dependency(
        usuario_actual: Usuario = Depends(obtener_usuario_actual),
        db: Session = Depends(get_db)
    ) -> Usuario:
        
        # Si el usuario es administrador, tiene acceso global por defecto
        if usuario_actual.rol == "administrador":
            return usuario_actual

        # Consulta en la tabla permisos_usuarios si posee el permiso requerido
        tiene_permiso = (
            db.query(PermisoUsuario)
            .join(PermisoModulo, PermisoUsuario.id_permisom == PermisoModulo.id_permisom)
            .filter(
                PermisoUsuario.id_usuario == usuario_actual.id_usuario,
                PermisoModulo.modulo == modulo_nombre,
                PermisoModulo.accion == accion_nombre
            )
            .first()
        )

        # Si no lo tiene, bloquea el endpoint inmediatamente con un código 403
        if not tiene_permiso:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos suficientes para realizar esta acción"
            )

        return usuario_actual

    return permiso_dependency