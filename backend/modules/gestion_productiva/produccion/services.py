# backend/modules/gestion_productiva/produccion/services.py
from typing import Optional
from datetime import date
from decimal import Decimal
from sqlalchemy import or_

from sqlalchemy.orm import Session
from .models import (
    GestionProductivaCabecera,
    GestionProductivaEntrada,
    GestionProductivaSalida,
    GestionProductivaResultado,
    ProduccionJustificante,
    Molde
)
from backend.modules.rendimiento.models import MetaRendimiento
from backend.utils.notificaciones.alertas import verificar_deficiencia_produccion
from backend.modules.gestion_productiva.gestion_justificantes.models import Justificante
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

def obtener_lista_moldes(db: Session):
    moldes = db.query(Molde).filter(Molde.estado == True).order_by(Molde.item.asc()).all()

    resultado = []
    for molde in moldes:
        resultado.append({
            "item": molde.item,
            "nombre": molde.nombre,
            "descripcion": molde.descripcion,
            "numero_camadas": molde.numero_camadas,
            "numero_envases": molde.numero_envases,
            "numero_gruesas": molde.numero_gruesas
        })

    return resultado


def obtener_lista_justificantes(db: Session):
    justificantes = db.query(Justificante).order_by(Justificante.id_justificante.asc()).all()

    resultado = []
    for justificante in justificantes:
        resultado.append({
            "id_justificante": justificante.id_justificante,
            "etiqueta": justificante.etiqueta,
            "descripcion": justificante.descripcion
        })

    return resultado


def obtener_registros_produccion(
    db: Session, skip: int = 0, limit: int = 50,
    desde: Optional[date] = None, hasta: Optional[date] = None,
    tecnico: Optional[str] = None, turno: Optional[int] = None,
    totalGruesas: Optional[Decimal] = None, totalGruesasLisas: Optional[Decimal] = None,
    totalGruesasDecoradas: Optional[Decimal] = None, eficiencia: Optional[Decimal] = None,
    item: Optional[str] = None
):
    query = db.query(
        GestionProductivaCabecera.id_cabecera,
        GestionProductivaCabecera.fecha,
        GestionProductivaCabecera.tipo_turno,
        GestionProductivaCabecera.turno,
        GestionProductivaCabecera.grupo,
        GestionProductivaCabecera.tecnico,
        GestionProductivaCabecera.total_gruesas,
        GestionProductivaResultado.total_gruesas_lisas,
        GestionProductivaResultado.total_gruesas_decoradas,
        GestionProductivaResultado.eficiencia_productiva,
        GestionProductivaResultado.deficiencia_productiva
    ).join(
        GestionProductivaResultado,
        GestionProductivaCabecera.id_cabecera == GestionProductivaResultado.id_cabecera,
        isouter=True
    )

    if item:
        query = query.outerjoin(
            GestionProductivaEntrada, GestionProductivaCabecera.id_cabecera == GestionProductivaEntrada.id_cabecera
        ).outerjoin(
            GestionProductivaSalida, GestionProductivaCabecera.id_cabecera == GestionProductivaSalida.id_cabecera
        ).filter(or_(
            GestionProductivaEntrada.id_molde.ilike(f"%{item}%"),
            GestionProductivaSalida.modelo_molde.ilike(f"%{item}%")
        ))

    if desde:
        query = query.filter(GestionProductivaCabecera.fecha >= desde)
    if hasta:
        query = query.filter(GestionProductivaCabecera.fecha <= hasta)
    if tecnico:
        query = query.filter(GestionProductivaCabecera.tecnico.ilike(f"%{tecnico}%"))
    if turno:
        query = query.filter(GestionProductivaCabecera.turno == turno)
    if totalGruesas is not None:
        query = query.filter(GestionProductivaCabecera.total_gruesas <= totalGruesas)
    if totalGruesasLisas is not None:
        query = query.filter(GestionProductivaResultado.total_gruesas_lisas <= totalGruesasLisas)
    if totalGruesasDecoradas is not None:
        query = query.filter(GestionProductivaResultado.total_gruesas_decoradas <= totalGruesasDecoradas)
    if eficiencia is not None:
        query = query.filter(GestionProductivaResultado.eficiencia_productiva <= eficiencia)

    registros = query.distinct().order_by(
        GestionProductivaCabecera.id_cabecera.desc()
    ).offset(skip).limit(limit).all()

    resultado = []
    for reg in registros:
        resultado.append({
            "id_cabecera": reg.id_cabecera,
            "fecha": reg.fecha,
            "tipo_turno": reg.tipo_turno,
            "turno": reg.turno,
            "grupo": reg.grupo,
            "tecnico": reg.tecnico,
            "total_gruesas": reg.total_gruesas,
            "total_gruesas_lisas": reg.total_gruesas_lisas,
            "total_gruesas_decoradas": reg.total_gruesas_decoradas,
            "eficiencia_productiva": reg.eficiencia_productiva,
            "deficiencia_productiva": reg.deficiencia_productiva
        })
    return resultado


def obtener_produccion_por_id(db: Session, id_cabecera: int):
    cabecera = db.query(GestionProductivaCabecera)\
                 .filter(GestionProductivaCabecera.id_cabecera == id_cabecera)\
                 .first()

    if not cabecera:
        return None

    # Agrupar entradas por máquina
    cabecera.maquina1 = [e for e in cabecera.entradas if e.maquina == 1]
    cabecera.maquina2 = [e for e in cabecera.entradas if e.maquina == 2]
    cabecera.maquina3 = [e for e in cabecera.entradas if e.maquina == 3]
    cabecera.maquina4 = [e for e in cabecera.entradas if e.maquina == 4]

    # Agrupar justificantes por modelo_molde
    justificantes_agrupados = {}
    for pj in cabecera.produccion_justificantes:
        if pj.modelo_molde not in justificantes_agrupados:
            justificantes_agrupados[pj.modelo_molde] = []
        justificantes_agrupados[pj.modelo_molde].append(pj.id_justificante)

    cabecera.justificantes = [
        {
            "modelo_molde": modelo_molde,
            "justificaciones": ids
        }
        for modelo_molde, ids in justificantes_agrupados.items()
    ]

    return cabecera


def crear_registro_produccion(db: Session, datos):
    try:
        # 1. Crear la cabecera del turno
        nueva_cabecera = GestionProductivaCabecera(
            fecha=datos.fecha,
            tipo_turno=datos.tipo_turno,
            turno=datos.turno,
            grupo=datos.grupo,
            tecnico=datos.tecnico.upper(),
            cant_envases_d1=datos.cant_envases_d1,
            cant_envases_d2=datos.cant_envases_d2,
            cant_envases_d3=datos.cant_envases_d3,
            cant_envases_d4=datos.cant_envases_d4,
            total_envases=datos.total_envases,
            total_gruesas=datos.total_gruesas
        )
        db.add(nueva_cabecera)
        db.flush()

        # 2. Insertar detalles de entrada por máquina
        maquinas = {
            1: datos.maquina1,
            2: datos.maquina2,
            3: datos.maquina3,
            4: datos.maquina4
        }
        for numero_maquina, detalles in maquinas.items():
            for detalle in detalles:
                nueva_entrada = GestionProductivaEntrada(
                    id_cabecera=nueva_cabecera.id_cabecera,
                    maquina=numero_maquina,
                    id_molde=detalle.id_molde,
                    cant_envases=detalle.cant_envases,
                    hora_entrada=detalle.hora_entrada
                )
                db.add(nueva_entrada)

        # 3. Insertar salidas por molde
        for salida_data in datos.salidas:
            nueva_salida = GestionProductivaSalida(
                id_cabecera=nueva_cabecera.id_cabecera,
                modelo_molde=salida_data.modelo_molde,
                total_paletas_molde=salida_data.total_paletas_molde,
                cant_paletas_lisas=salida_data.cant_paletas_lisas,
                cant_camadas_lisas=salida_data.cant_camadas_lisas,
                cant_envases_lisas=salida_data.cant_envases_lisas,
                cant_gruesas_lisas=salida_data.cant_gruesas_lisas,
                cant_paletas_decoradas=salida_data.cant_paletas_decoradas,
                cant_camadas_decoradas=salida_data.cant_camadas_decoradas,
                cant_envases_decoradas=salida_data.cant_envases_decoradas,
                cant_gruesas_decoradas=salida_data.cant_gruesas_decoradas
            )
            db.add(nueva_salida)

        # 4. Crear el consolidado final
        nuevo_resultado = GestionProductivaResultado(
            id_cabecera=nueva_cabecera.id_cabecera,
            total_envases_lisos=datos.resultado.total_envases_lisos,
            total_gruesas_lisas=datos.resultado.total_gruesas_lisas,
            total_envases_decorados=datos.resultado.total_envases_decorados,
            total_gruesas_decoradas=datos.resultado.total_gruesas_decoradas,
            total_envases_perdidos=datos.resultado.total_envases_perdidos,
            total_gruesas_perdidas=datos.resultado.total_gruesas_perdidas,
            eficiencia_productiva=datos.resultado.eficiencia_productiva,
            deficiencia_productiva=datos.resultado.deficiencia_productiva,
            observaciones=datos.resultado.observaciones
        )
        db.add(nuevo_resultado)

        # 5. Insertar justificantes
        for item in datos.justificantes:
            for id_j in set(item.justificaciones):
                nueva_relacion = ProduccionJustificante(
                    id_cabecera=nueva_cabecera.id_cabecera,
                    modelo_molde=item.modelo_molde,
                    id_justificante=id_j
                )
                db.add(nueva_relacion)

        db.commit()
        db.refresh(nueva_cabecera)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Error: Ya existe un registro duplicado o un justificante repetido para este molde."
        )

    # NOTIFICACIÓN DE DEFICIENCIA
    meta_activa = db.query(MetaRendimiento).filter(MetaRendimiento.estado == True).first()
    if meta_activa and float(datos.resultado.deficiencia_productiva) >= float(meta_activa.deficiencia):
        justificantes_notif = []
        for item in datos.justificantes:
            etiquetas = []
            for id_j in item.justificaciones:
                justificante = db.query(Justificante).filter(Justificante.id_justificante == id_j).first()
                if justificante:
                    etiquetas.append(f"{justificante.etiqueta} - {justificante.descripcion}")
            molde = db.query(Molde).filter(Molde.item == item.modelo_molde).first()
            nombre_molde = f"{molde.nombre} - {molde.descripcion}" if molde else str(item.modelo_molde)
            justificantes_notif.append({"molde": nombre_molde, "justificaciones": etiquetas})

        verificar_deficiencia_produccion(
            id_cabecera      = nueva_cabecera.id_cabecera,
            fecha            = str(datos.fecha),
            turno            = datos.turno,
            grupo            = datos.grupo,
            tecnico          = datos.tecnico,
            deficiencia      = float(datos.resultado.deficiencia_productiva),
            total_gruesas    = float(datos.total_gruesas),
            justificantes    = justificantes_notif,
            meta_deficiencia = float(meta_activa.deficiencia),
            meta_periodo     = f"{meta_activa.mes.capitalize()} {meta_activa.anio}"
        )

    return {
        "status": "Registro insertado con éxito",
        "id": nueva_cabecera.id_cabecera
    }





def actualizar_registro_produccion(db: Session, id_cabecera: int, datos):
    cabecera_actual = db.query(GestionProductivaCabecera)\
                        .filter(GestionProductivaCabecera.id_cabecera == id_cabecera)\
                        .first()

    if not cabecera_actual:
        return None

    try:
        # 1. Actualizar cabecera
        cabecera_actual.fecha = datos.fecha
        cabecera_actual.tipo_turno = datos.tipo_turno
        cabecera_actual.turno = datos.turno
        cabecera_actual.grupo = datos.grupo
        cabecera_actual.tecnico = datos.tecnico.upper()
        cabecera_actual.cant_envases_d1 = datos.cant_envases_d1
        cabecera_actual.cant_envases_d2 = datos.cant_envases_d2
        cabecera_actual.cant_envases_d3 = datos.cant_envases_d3
        cabecera_actual.cant_envases_d4 = datos.cant_envases_d4
        cabecera_actual.total_envases = datos.total_envases
        cabecera_actual.total_gruesas = datos.total_gruesas

        # 2. Reemplazar entradas
        db.query(GestionProductivaEntrada)\
          .filter(GestionProductivaEntrada.id_cabecera == id_cabecera)\
          .delete()

        maquinas = {
            1: datos.maquina1,
            2: datos.maquina2,
            3: datos.maquina3,
            4: datos.maquina4
        }
        for numero_maquina, detalles in maquinas.items():
            for detalle in detalles:
                nueva_entrada = GestionProductivaEntrada(
                    id_cabecera=id_cabecera,
                    maquina=numero_maquina,
                    id_molde=detalle.id_molde,
                    cant_envases=detalle.cant_envases,
                    hora_entrada=detalle.hora_entrada
                )
                db.add(nueva_entrada)

        # 3. Sincronizar salidas
        db.query(GestionProductivaSalida)\
          .filter(GestionProductivaSalida.id_cabecera == id_cabecera)\
          .delete()

        for salida_data in datos.salidas:
            nueva_salida = GestionProductivaSalida(
                id_cabecera=id_cabecera,
                modelo_molde=salida_data.modelo_molde,
                total_paletas_molde=salida_data.total_paletas_molde,
                cant_paletas_lisas=salida_data.cant_paletas_lisas,
                cant_camadas_lisas=salida_data.cant_camadas_lisas,
                cant_envases_lisas=salida_data.cant_envases_lisas,
                cant_gruesas_lisas=salida_data.cant_gruesas_lisas,
                cant_paletas_decoradas=salida_data.cant_paletas_decoradas,
                cant_camadas_decoradas=salida_data.cant_camadas_decoradas,
                cant_envases_decoradas=salida_data.cant_envases_decoradas,
                cant_gruesas_decoradas=salida_data.cant_gruesas_decoradas
            )
            db.add(nueva_salida)

        # 4. Actualizar resultado
        if cabecera_actual.resultado:
            cabecera_actual.resultado.total_envases_lisos = datos.resultado.total_envases_lisos
            cabecera_actual.resultado.total_gruesas_lisas = datos.resultado.total_gruesas_lisas
            cabecera_actual.resultado.total_envases_decorados = datos.resultado.total_envases_decorados
            cabecera_actual.resultado.total_gruesas_decoradas = datos.resultado.total_gruesas_decoradas
            cabecera_actual.resultado.total_envases_perdidos = datos.resultado.total_envases_perdidos
            cabecera_actual.resultado.total_gruesas_perdidas = datos.resultado.total_gruesas_perdidas
            cabecera_actual.resultado.eficiencia_productiva = datos.resultado.eficiencia_productiva
            cabecera_actual.resultado.deficiencia_productiva = datos.resultado.deficiencia_productiva
            cabecera_actual.resultado.observaciones = datos.resultado.observaciones
        else:
            nuevo_resultado = GestionProductivaResultado(
                id_cabecera=id_cabecera,
                total_envases_lisos=datos.resultado.total_envases_lisos,
                total_gruesas_lisas=datos.resultado.total_gruesas_lisas,
                total_envases_decorados=datos.resultado.total_envases_decorados,
                total_gruesas_decoradas=datos.resultado.total_gruesas_decoradas,
                total_envases_perdidos=datos.resultado.total_envases_perdidos,
                total_gruesas_perdidas=datos.resultado.total_gruesas_perdidas,
                eficiencia_productiva=datos.resultado.eficiencia_productiva,
                deficiencia_productiva=datos.resultado.deficiencia_productiva,
                observaciones=datos.resultado.observaciones
            )
            db.add(nuevo_resultado)

        # 5. Sincronizar justificantes
        db.query(ProduccionJustificante)\
          .filter(ProduccionJustificante.id_cabecera == id_cabecera)\
          .delete()

        for item in datos.justificantes:
            for id_j in set(item.justificaciones):
                nueva_relacion = ProduccionJustificante(
                    id_cabecera=id_cabecera,
                    modelo_molde=item.modelo_molde,
                    id_justificante=id_j
                )
                db.add(nueva_relacion)

        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Error: Ya existe un registro duplicado o un justificante repetido para este molde."
        )

    # NOTIFICACIÓN DE DEFICIENCIA
    meta_activa = db.query(MetaRendimiento).filter(MetaRendimiento.estado == True).first()
    if meta_activa and float(datos.resultado.deficiencia_productiva) >= float(meta_activa.deficiencia):
        justificantes_notif = []
        for item in datos.justificantes:
            etiquetas = []
            for id_j in item.justificaciones:
                justificante = db.query(Justificante).filter(Justificante.id_justificante == id_j).first()
                if justificante:
                    etiquetas.append(f"{justificante.etiqueta} - {justificante.descripcion}")
            molde = db.query(Molde).filter(Molde.item == item.modelo_molde).first()
            nombre_molde = f"{molde.nombre} - {molde.descripcion}" if molde else str(item.modelo_molde)
            justificantes_notif.append({"molde": nombre_molde, "justificaciones": etiquetas})

        verificar_deficiencia_produccion(
            id_cabecera      = id_cabecera,
            fecha            = str(datos.fecha),
            turno            = datos.turno,
            grupo            = datos.grupo,
            tecnico          = datos.tecnico,
            deficiencia      = float(datos.resultado.deficiencia_productiva),
            total_gruesas    = float(datos.total_gruesas),
            justificantes    = justificantes_notif,
            meta_deficiencia = float(meta_activa.deficiencia),
            meta_periodo     = f"{meta_activa.mes.capitalize()} {meta_activa.anio}"
        )

    return {
        "status": "Registro actualizado con éxito",
        "id": id_cabecera
    }
