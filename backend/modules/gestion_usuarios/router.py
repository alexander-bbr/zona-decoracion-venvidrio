# backend/modules/gestion_usuarios/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from backend.database.conexion import get_db

from .services import (
    crear_usuario_completo,
    listar_usuarios,
    obtener_usuario_completo,
    editar_usuario_completo,
    listar_permisos_modulos
)

from .schemas import UsuarioCrear, UsuarioEditar
from .dependencies import require_permiso

router = APIRouter(
    prefix="/api/usuarios",
    tags=["Gestión de Usuarios"]
)

# ENDPOINT: CREAR USUARIO (Requiere permiso de crear/editar)
@router.post("", response_model=dict)
def crear_usuario_endpoint(
    datos: UsuarioCrear,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_usuarios", "crear_editar"))
):
    resultado = crear_usuario_completo(db, datos)

    if resultado.get("status") == "error":
        raise HTTPException(status_code=400, detail=resultado.get("message"))

    return {
        "mensaje": "Usuario creado con éxito",
        "id": resultado.get("id")
    }


# ENDPOINT: LISTAR USUARIOS (Requiere permiso de ver usuarios)
@router.get("")
def listar_usuarios_endpoint(
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_usuarios", "ver_usuarios"))
):
    resultado = listar_usuarios(db)
    return {"data": jsonable_encoder(resultado)}


# ENDPOINT: LISTAR CATÁLOGO DE PERMISOS (Colocado antes de /{id_usuario} para evitar conflictos)
@router.get("/permisos/catalogo")
def listar_permisos_modulos_endpoint(
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_usuarios", "ver_usuarios"))
):
    resultado = listar_permisos_modulos(db)
    return {"data": jsonable_encoder(resultado)}


# ENDPOINT: OBTENER USUARIO PARA EDITAR (Requiere permiso de ver usuarios)
@router.get("/{id_usuario}")
def obtener_usuario_endpoint(
    id_usuario: int,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_usuarios", "ver_usuarios"))
):
    resultado = obtener_usuario_completo(db, id_usuario)

    if resultado.get("status") == "error":
        raise HTTPException(status_code=404, detail=resultado.get("message"))

    return {
        "data": {
            "usuario": jsonable_encoder(resultado.get("usuario")),
            "permisos": jsonable_encoder(resultado.get("permisos"))
        }
    }


# ENDPOINT: EDITAR USUARIO (Requiere permiso de crear/editar)
@router.put("/{id_usuario}")
def editar_usuario_endpoint(
    id_usuario: int,
    datos: UsuarioEditar,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_usuarios", "crear_editar"))
):
    resultado = editar_usuario_completo(db, id_usuario, datos)

    if resultado.get("status") == "error":
        raise HTTPException(status_code=400, detail=resultado.get("message"))

    return {
        "mensaje": "Usuario actualizado con éxito",
        "id": resultado.get("id")
    }