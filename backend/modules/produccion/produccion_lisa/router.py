from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from typing import Optional

from backend.database.conexion import get_db
from . import schemas, services

router = APIRouter(
    prefix="/api/produccion-lisa",
    tags=["Producción Lisa"]
)


#INVENTARIO
@router.get("/inventario")
def listar_inventario(db: Session = Depends(get_db)):
    resultado = services.obtener_inventario(db)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return {"data": jsonable_encoder(resultado["data"])}


#REGISTRO
@router.post("/registro")
def crear_registro(datos: schemas.RegistroCrear, db: Session = Depends(get_db)):
    resultado = services.registrar_produccion(db, datos)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return resultado


#SALIDA
@router.post("/salida")
def crear_salida(datos: schemas.SalidaCrear, db: Session = Depends(get_db)):
    resultado = services.registrar_salida(db, datos)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return resultado


#HISTORIAL
@router.get("/historial")
def listar_historial(
    from_date: Optional[date] = Query(None, description="Fecha desde (YYYY-MM-DD)"),
    to_date:   Optional[date] = Query(None, description="Fecha hasta (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    resultado = services.obtener_historial(db, from_date, to_date)
    if resultado["status"] == "error":
        raise HTTPException(status_code=400, detail=resultado["message"])
    return {"data": jsonable_encoder(resultado["data"])}