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


def obtener_eficiencia_deficiencia_por_fecha(db: Session, desde: str, hasta: str):
    registros = db.query(
        GestionProductivaCabecera.fecha,
        func.sum(GestionProductivaCabecera.total_envases).label("total_envases"),
        func.sum(GestionProductivaResultado.total_envases_decorados).label("total_envases_decorados"),
        func.sum(GestionProductivaResultado.total_envases_perdidos).label("total_envases_perdidos")
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

    rendimiento = []
    total_envases_rango = 0
    total_decorados_rango = 0
    total_perdidos_rango = 0

    for reg in registros:
        total_envases_rango += reg.total_envases
        total_decorados_rango += reg.total_envases_decorados
        total_perdidos_rango += reg.total_envases_perdidos

        eficiencia = round((reg.total_envases_decorados / reg.total_envases) * 100, 2)
        deficiencia = round((reg.total_envases_perdidos / reg.total_envases) * 100, 2)

        rendimiento.append({
            "fecha": str(reg.fecha),
            "eficiencia": eficiencia,
            "deficiencia": deficiencia
        })

    eficiencia_general = round((total_decorados_rango / total_envases_rango) * 100, 2)
    deficiencia_general = round((total_perdidos_rango / total_envases_rango) * 100, 2)

    return {
        "rendimiento": rendimiento,
        "eficienciaGeneral": eficiencia_general,
        "deficienciaGeneral": deficiencia_general
    }