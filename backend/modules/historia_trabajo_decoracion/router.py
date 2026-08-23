# router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from backend.database.conexion import get_db
from backend.modules.gestion_usuarios.dependencies import require_permiso
from . import schemas, services

router = APIRouter(
    prefix="/api/historia-trabajo",
    tags=["Historia de Trabajo Decoración"]
)


#CREAR
@router.post("/crear/historia-trabajo")
def crear_historia_trabajo(
    datos: schemas.CabeceraCrear,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("historia_trabajo_decoracion", "Crear Historia de Trabajo"))
):
    resultado = services.crear_historia_trabajo(db, datos)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return resultado


#LISTAR
@router.get("/historial/historia-trabajo")
def listar_historias_trabajo(
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("historia_trabajo_decoracion", "ver_historial"))
):
    resultado = services.listar_historias_trabajo(db)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return {"data": jsonable_encoder(resultado["data"])}


#OBTENER
@router.get("/obtener_registro/historia-trabajo/{id_htd_cabecera}")
def obtener_historia_trabajo(
    id_htd_cabecera: int,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("historia_trabajo_decoracion", "Editar Historia de Trabajo"))
):
    resultado = services.obtener_historia_trabajo(db, id_htd_cabecera)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return {"data": jsonable_encoder(resultado["data"])}


#EDITAR
@router.put("/editar/historia-trabajo/{id_htd_cabecera}")
def editar_historia_trabajo(
    id_htd_cabecera: int,
    datos: schemas.CabeceraCrear,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("historia_trabajo_decoracion", "Editar Historia de Trabajo"))
):
    resultado = services.editar_historia_trabajo(db, id_htd_cabecera, datos)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return resultado

#EXPORTAR
@router.get("/exportar/historia-trabajo/{id_htd_cabecera}")
def exportar_historia_trabajo(
    id_htd_cabecera: int,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("historia_trabajo_decoracion", "Editar Historia de Trabajo"))
):
    resultado = services.exportar_historia_trabajo(db, id_htd_cabecera)
    if isinstance(resultado, dict) and resultado.get("status") == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return resultado