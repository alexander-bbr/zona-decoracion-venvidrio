# backend/modules/rendimiento/services.py

from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from decimal import Decimal

from backend.modules.gestion_productiva.produccion.models import (
    GestionProductivaCabecera,
    GestionProductivaResultado
)


def obtener_lisos_por_fecha(db: Session, desde: str, hasta: str):
    registros = db.query(
        GestionProductivaCabecera.fecha,
        func.sum(GestionProductivaResultado.total_envases_lisos).label("total_envases_lisos"),
        func.sum(GestionProductivaResultado.total_gruesas_lisas).label("total_gruesas_lisas")
    ).join(
        GestionProductivaResultado,
        GestionProductivaCabecera.id_cabecera == GestionProductivaResultado.id_cabecera
    ).filter(
        GestionProductivaCabecera.fecha >= desde,
        GestionProductivaCabecera.fecha <= hasta
    ).group_by(
        GestionProductivaCabecera.fecha
    ).order_by(
        GestionProductivaCabecera.fecha.asc()
    ).all()

    if not registros:
        raise HTTPException(status_code=404, detail="No se encontraron registros en el rango de fechas indicado.")

    registros_lisos = [
        {
            "fecha": str(reg.fecha),
            "totalEnvasesLisos": reg.total_envases_lisos,
            "totalGruesasLisas": str(reg.total_gruesas_lisas)
        }
        for reg in registros
    ]

    return {
        "registrosLisos": registros_lisos,
        "totalEnvasesLisos": sum(r["totalEnvasesLisos"] for r in registros_lisos),
        "totalGruesasLisas": str(sum(Decimal(r["totalGruesasLisas"]) for r in registros_lisos))
    }


def obtener_decorados_por_fecha(db: Session, desde: str, hasta: str):
    registros = db.query(
        GestionProductivaCabecera.fecha,
        func.sum(GestionProductivaResultado.total_envases_decorados).label("total_envases_decorados"),
        func.sum(GestionProductivaResultado.total_gruesas_decoradas).label("total_gruesas_decoradas")
    ).join(
        GestionProductivaResultado,
        GestionProductivaCabecera.id_cabecera == GestionProductivaResultado.id_cabecera
    ).filter(
        GestionProductivaCabecera.fecha >= desde,
        GestionProductivaCabecera.fecha <= hasta
    ).group_by(
        GestionProductivaCabecera.fecha
    ).order_by(
        GestionProductivaCabecera.fecha.asc()
    ).all()

    if not registros:
        raise HTTPException(status_code=404, detail="No se encontraron registros en el rango de fechas indicado.")

    registros_decorados = [
        {
            "fecha": str(reg.fecha),
            "totalEnvasesDecorados": reg.total_envases_decorados,
            "totalGruesasDecoradas": str(reg.total_gruesas_decoradas)
        }
        for reg in registros
    ]

    return {
        "registrosDecorados": registros_decorados,
        "totalEnvasesDecorados": sum(r["totalEnvasesDecorados"] for r in registros_decorados),
        "totalGruesasDecoradas": str(sum(Decimal(r["totalGruesasDecoradas"]) for r in registros_decorados))
    }


def obtener_perdidos_por_fecha(db: Session, desde: str, hasta: str):
    registros = db.query(
        GestionProductivaCabecera.fecha,
        func.sum(GestionProductivaResultado.total_envases_perdidos).label("total_envases_perdidos"),
        func.sum(GestionProductivaResultado.total_gruesas_perdidas).label("total_gruesas_perdidas")
    ).join(
        GestionProductivaResultado,
        GestionProductivaCabecera.id_cabecera == GestionProductivaResultado.id_cabecera
    ).filter(
        GestionProductivaCabecera.fecha >= desde,
        GestionProductivaCabecera.fecha <= hasta
    ).group_by(
        GestionProductivaCabecera.fecha
    ).order_by(
        GestionProductivaCabecera.fecha.asc()
    ).all()

    if not registros:
        raise HTTPException(status_code=404, detail="No se encontraron registros en el rango de fechas indicado.")

    registros_perdidos = [
        {
            "fecha": str(reg.fecha),
            "totalEnvasesPerdidos": reg.total_envases_perdidos,
            "totalGruesasPerdidas": str(reg.total_gruesas_perdidas)
        }
        for reg in registros
    ]

    return {
        "registrosPerdidos": registros_perdidos,
        "totalEnvasesPerdidos": sum(r["totalEnvasesPerdidos"] for r in registros_perdidos),
        "totalGruesasPerdidas": str(sum(Decimal(r["totalGruesasPerdidas"]) for r in registros_perdidos))
    }