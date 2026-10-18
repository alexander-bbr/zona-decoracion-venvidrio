# backend/modules/exportacion/router.py
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO

from backend.database.conexion import get_db
from backend.modules.exportacion.schemas import FiltroFechas, FiltroProduccion
from backend.modules.exportacion.services import (
    exportar_gestion_productiva,
    exportar_movimientos_inventario,
    exportar_moldes,
    exportar_justificantes,
    exportar_insumos,
    exportar_movimientos_pantallas,
    exportar_pantallas,
    exportar_rendimiento_moldes_service 
)

router = APIRouter(prefix="/api/exportacion", tags=["Exportación"])


@router.post("/gestion-productiva")
def exportar_historial_gestion_productiva(filtro: FiltroProduccion, db: Session = Depends(get_db)):
    archivo = exportar_gestion_productiva(
        db, filtro.fechaDesde, filtro.fechaHasta,
        filtro.tecnico, filtro.turno, filtro.totalGruesas,
        filtro.totalGruesasLisas, filtro.totalGruesasDecoradas,
        filtro.eficiencia, filtro.item
    )
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

@router.post("/movimientos-pantallas")
def exportar_historial_movimientos_pantallas(filtro: FiltroFechas, db: Session = Depends(get_db)):
    archivo = exportar_movimientos_pantallas(db, filtro.fechaDesde, filtro.fechaHasta)
    return StreamingResponse(
        BytesIO(archivo),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=historial_movimientos_pantallas.xlsx"}
    )


@router.post("/pantallas")
def exportar_listado_pantallas(db: Session = Depends(get_db)):
    archivo = exportar_pantallas(db)
    return StreamingResponse(
        BytesIO(archivo),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=listado_pantallas.xlsx"}
    )


@router.post("/rendimiento-moldes")
def exportar_rendimiento_moldes(filtro: FiltroFechas, db: Session = Depends(get_db)):
    archivo = exportar_rendimiento_moldes_service(db, filtro.fechaDesde, filtro.fechaHasta)
    return StreamingResponse(
        BytesIO(archivo),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=rendimiento_moldes.xlsx"}
    )