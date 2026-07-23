# backend/modules/produccion_lisa/router.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from fastapi.encoders import jsonable_encoder

# Importa tu conexión a la BD y las dependencias de este módulo
from backend.database.conexion import get_db
from . import schemas, services

router = APIRouter(
    prefix="/api/produccion-lisa",
    tags=["Producción Lisa"]
)

# ENDPOINT: OBTENER INVENTARIO CON FILTROS
@router.get("/inventario")
def listar_inventario(
    fromDate: Optional[str] = Query(None, description="Fecha Desde"),
    toDate: Optional[str] = Query(None, description="Fecha Hasta"),
    model: Optional[str] = Query(None, description="Modelo de producción"),
    db: Session = Depends(get_db)
):
    resultado = services.obtener_inventario_lisa(db, fromDate, toDate, model)
    # jsonable_encoder traduce los objetos SQLAlchemy al formato JSON
    return {"data": jsonable_encoder(resultado["data"])}


# ENDPOINT: OBTENER HISTORIAL (SIN ID)
@router.get("/historial")
def listar_historial(
    fromDate: Optional[str] = Query(None, description="Fecha Desde"),
    toDate: Optional[str] = Query(None, description="Fecha Hasta"),
    model: Optional[str] = Query(None, description="Modelo de producción"),
    db: Session = Depends(get_db)
):
    resultado = services.listar_historial_salidas(db, fromDate, toDate, model)
    
    # Mapeamos los datos de salida a la estructura del frontend que omite el ID
    # Usamos el esquema HistorialSalidaFrontendResponde
    datos_limpios = [
        schemas.HistorialSalidaFrontendResponde.model_validate(fila) 
        for fila in resultado["data"]
    ]
    
    # by_alias=True asegura que las claves salgan en camelCase (nroLote, fechaSalida)
    return {"data": [dato.model_dump(by_alias=True) for dato in datos_limpios]}


# ENDPOINT: REGISTRAR NUEVO LOTE (ENTRADA)
@router.post("/registro")
def crear_registro(
    datos: schemas.RegistroProduccionLisaCrear,
    db: Session = Depends(get_db)
):
    resultado = services.registrar_produccion_lisa(db, datos)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return resultado


# ENDPOINT: REGISTRAR SALIDA
@router.post("/salida")
def crear_salida(
    datos: schemas.SalidaProduccionLisaCrear,
    db: Session = Depends(get_db)
):
    resultado = services.registrar_salida_lisa(db, datos)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return resultado


# ENDPOINT: ELIMINAR LOTE
@router.delete("/registro/{id_registro}")
def eliminar_registro(
    id_registro: int,
    db: Session = Depends(get_db)
):
    resultado = services.eliminar_registro_lisa(db, id_registro)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return resultado