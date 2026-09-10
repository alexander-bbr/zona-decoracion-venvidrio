# backend/modules/gestion_productiva/produccion/services.py

from sqlalchemy.orm import Session
from .models import (
    GestionProductivaCabecera,
    GestionProductivaEntrada,
    GestionProductivaSalida,
    GestionProductivaResultado,
    ProduccionJustificante,
    Molde
)
from backend.modules.gestion_productiva.gestion_justificantes.models import Justificante
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

def obtener_lista_moldes(db: Session):
    moldes = db.query(Molde).order_by(Molde.id_molde.desc()).all()

    resultado = []
    for molde in moldes:
        resultado.append({
            "id_molde": molde.id_molde,
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


def obtener_registros_produccion(db: Session, skip: int = 0, limit: int = 50):
    registros = db.query(
        GestionProductivaCabecera.id_cabecera,
        GestionProductivaCabecera.fecha,
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
    ).order_by(
        GestionProductivaCabecera.id_cabecera.desc()
    ).offset(skip).limit(limit).all()

    resultado = []
    for reg in registros:
        resultado.append({
            "id_cabecera": reg.id_cabecera,
            "fecha": reg.fecha,
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
            tecnico=datos.tecnico,
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
            total_gruesas_lisas=datos.resultado.total_gruesas_lisas,
            total_gruesas_decoradas=datos.resultado.total_gruesas_decoradas,
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

        # 🔁 CAMBIO AQUÍ: devolver solo el status y el ID
        return {
            "status": "Registro insertado con éxito",
            "id": nueva_cabecera.id_cabecera
        }

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Error: Ya existe un registro duplicado o un justificante repetido para este molde."
        )



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
        cabecera_actual.tecnico = datos.tecnico
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
            cabecera_actual.resultado.total_gruesas_lisas = datos.resultado.total_gruesas_lisas
            cabecera_actual.resultado.total_gruesas_decoradas = datos.resultado.total_gruesas_decoradas
            cabecera_actual.resultado.eficiencia_productiva = datos.resultado.eficiencia_productiva
            cabecera_actual.resultado.deficiencia_productiva = datos.resultado.deficiencia_productiva
            cabecera_actual.resultado.observaciones = datos.resultado.observaciones
        else:
            nuevo_resultado = GestionProductivaResultado(
                id_cabecera=id_cabecera,
                total_gruesas_lisas=datos.resultado.total_gruesas_lisas,
                total_gruesas_decoradas=datos.resultado.total_gruesas_decoradas,
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
        return {
            "status": "Registro actualizado con éxito",
            "id": id_cabecera
        }

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Error: No se pudo actualizar el registro debido a un conflicto de datos o restricciones en la base de datos."
        )