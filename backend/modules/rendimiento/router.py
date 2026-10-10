# backend/modules/rendimiento/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from backend.database.conexion import get_db
from . import services

router = APIRouter(
    prefix="/api/rendimiento",
    tags=["Rendimiento"]
)


# 1. LISOS POR FECHA
@router.get("/lisos")
def obtener_lisos(
    desde: date,
    hasta: date,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver_rendimiento"))
):
    """
    Retorna el total de envases y gruesas lisas agrupados por fecha.
    """
    return services.obtener_lisos_por_fecha(db, desde, hasta)


# 2. DECORADOS POR FECHA
@router.get("/decorados")
def obtener_decorados(
    desde: date,
    hasta: date,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver_rendimiento"))
):
    """
    Retorna el total de envases y gruesas decoradas agrupados por fecha.
    """
    return services.obtener_decorados_por_fecha(db, desde, hasta)


# 3. PERDIDOS POR FECHA
@router.get("/perdidos")
def obtener_perdidos(
    desde: date,
    hasta: date,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver_rendimiento"))
):
    """
    Retorna el total de envases y gruesas perdidas agrupados por fecha.
    """
    return services.obtener_perdidos_por_fecha(db, desde, hasta)

@router.get("/eficiencia-deficiencia")
def obtener_eficiencia_deficiencia(
    desde: date,
    hasta: date,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver"))
):
    return services.obtener_eficiencia_deficiencia_por_fecha(db, desde, hasta)