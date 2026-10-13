# backend/modules/rendimiento/services.py

from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from decimal import Decimal
from datetime import date

from .models import MetaRendimiento
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

def obtener_pantallas_por_fecha(db: Session, desde: date, hasta: date):
    from backend.modules.inventario_pantallas.models import PantallaEntrada, PantallaSalida
    from sqlalchemy import func, cast, Date

    # Fabricadas (entradas)
    fabricadas = db.query(
        cast(PantallaEntrada.fecha, Date).label("fecha"),
        func.sum(PantallaEntrada.cantidad).label("total_fabricadas")
    ).filter(
        cast(PantallaEntrada.fecha, Date) >= desde,
        cast(PantallaEntrada.fecha, Date) <= hasta
    ).group_by(
        cast(PantallaEntrada.fecha, Date)
    ).all()

    # Consumidas (salidas)
    consumidas = db.query(
        cast(PantallaSalida.fecha, Date).label("fecha"),
        func.sum(PantallaSalida.cantidad).label("total_consumidas")
    ).filter(
        cast(PantallaSalida.fecha, Date) >= desde,
        cast(PantallaSalida.fecha, Date) <= hasta
    ).group_by(
        cast(PantallaSalida.fecha, Date)
    ).all()

    # Unir por fecha
    datos = {}

    for reg in fabricadas:
        fecha_str = str(reg.fecha)
        datos[fecha_str] = {
            "fecha": fecha_str,
            "totalFabricadas": int(reg.total_fabricadas or 0),
            "totalConsumidas": 0
        }

    for reg in consumidas:
        fecha_str = str(reg.fecha)
        if fecha_str in datos:
            datos[fecha_str]["totalConsumidas"] = int(reg.total_consumidas or 0)
        else:
            datos[fecha_str] = {
                "fecha": fecha_str,
                "totalFabricadas": 0,
                "totalConsumidas": int(reg.total_consumidas or 0)
            }

    if not datos:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron registros en el rango de fechas indicado."
        )

    registros = sorted(datos.values(), key=lambda x: x["fecha"], reverse=True)

    return {
        "registrosPantallas": registros,
        "totalFabricadas": sum(r["totalFabricadas"] for r in registros),
        "totalConsumidas": sum(r["totalConsumidas"] for r in registros)
    }

#FUNCIONES PARA METAS DE RENDIMIENTO

def obtener_lista_metas(db: Session):
    # Ordenar por año y luego por mes
    orden_meses = {
        "enero": 1, "febrero": 2, "marzo": 3, "abril": 4,
        "mayo": 5, "junio": 6, "julio": 7, "agosto": 8,
        "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12
    }

    metas = db.query(MetaRendimiento).all()

    # Ordenamos en Python porque el mes es texto
    metas_ordenadas = sorted(
        metas,
        key=lambda m: (m.anio, orden_meses.get(m.mes.lower(), 99)),
        reverse=True
    )

    return metas_ordenadas


def obtener_meta_por_id(db: Session, id_meta: int):
    return db.query(MetaRendimiento).filter(MetaRendimiento.id_meta == id_meta).first()


def registrar_meta(db: Session, datos):
    if datos.estado is True:
        db.query(MetaRendimiento).update({MetaRendimiento.estado: False})
        db.flush()

    nueva_meta = MetaRendimiento(
        anio=datos.anio,
        mes=datos.mes.lower(),
        deficiencia=datos.deficiencia,
        estado=datos.estado
    )
    db.add(nueva_meta)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una meta para ese año y mes."
        )
    db.refresh(nueva_meta)
    return nueva_meta

def editar_meta(db: Session, id_meta: int, datos):
    meta_actual = db.query(MetaRendimiento).filter(MetaRendimiento.id_meta == id_meta).first()

    if not meta_actual:
        return None

    if datos.estado is True:
        db.query(MetaRendimiento).filter(
            MetaRendimiento.id_meta != id_meta
        ).update({MetaRendimiento.estado: False})
        db.flush()

    meta_actual.anio = datos.anio
    meta_actual.mes = datos.mes.lower()
    meta_actual.deficiencia = datos.deficiencia
    meta_actual.estado = datos.estado

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una meta para ese año y mes."
        )
    db.refresh(meta_actual)
    return meta_actual