# backend/modules/exportacion/router.py
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO

from backend.database.conexion import get_db
from backend.modules.exportacion.schemas import FiltroFechas
from backend.modules.exportacion.services import (
    exportar_gestion_productiva,
    exportar_movimientos_inventario,
    exportar_moldes,
    exportar_justificantes,
    exportar_insumos
)

router = APIRouter(prefix="/api/exportacion", tags=["Exportación"])


@router.post("/gestion-productiva")
def exportar_historial_gestion_productiva(filtro: FiltroFechas, db: Session = Depends(get_db)):
    archivo = exportar_gestion_productiva(db, filtro.fechaDesde, filtro.fechaHasta)
    return StreamingResponse(
        BytesIO(archivo),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=historial_gestion_productiva.xlsx"}
    )


@router.post("/movimientos-inventario")
def exportar_historial_movimientos_inventario(filtro: FiltroFechas, db: Session = Depends(get_db)):
    archivo = exportar_movimientos_inventario(db, filtro.fechaDesde, filtro.fechaHasta)
    return StreamingResponse(
        BytesIO(archivo),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=historial_movimientos_inventario.xlsx"}
    )


@router.post("/moldes")
def exportar_listado_moldes(db: Session = Depends(get_db)):
    archivo = exportar_moldes(db)
    return StreamingResponse(
        BytesIO(archivo),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=listado_moldes.xlsx"}
    )


@router.post("/justificantes")
def exportar_listado_justificantes(db: Session = Depends(get_db)):
    archivo = exportar_justificantes(db)
    return StreamingResponse(
        BytesIO(archivo),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=listado_justificantes.xlsx"}
    )


@router.post("/insumos")
def exportar_listado_insumos(db: Session = Depends(get_db)):
    archivo = exportar_insumos(db)
    return StreamingResponse(
        BytesIO(archivo),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=listado_insumos.xlsx"}
    )