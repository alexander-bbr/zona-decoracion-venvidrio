# backend/modules/gestion_productiva/produccion/services.py

from sqlalchemy.orm import Session
from .models import (
    GestionProductivaEntrada,
    GestionProductivaSalida,
    GestionProductivaResultado,
    Molde
)
# from .schemas import ProduccionCreate, ProduccionUpdate (asumiendo que tendrás tus schemas)


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


def obtener_registros_produccion(db: Session, skip: int = 0, limit: int = 50):
    """
    Obtiene el listado de movimientos de producción paginado (50 en 50),
    extrayendo solo los campos específicos de Entrada y Resultado 
    necesarios para la vista principal del frontend.
    """
    total = db.query(GestionProductivaEntrada).count()

    registros = db.query(
        GestionProductivaEntrada.id_produccion,
        GestionProductivaEntrada.fecha,
        GestionProductivaEntrada.turno,
        GestionProductivaEntrada.tecnico,
        GestionProductivaEntrada.total_gruesas,
        GestionProductivaResultado.total_gruesas_lisas,
        GestionProductivaResultado.total_gruesas_decoradas,
        GestionProductivaResultado.eficiencia_productiva,
        GestionProductivaResultado.deficiencia_productiva
    ).join(
        GestionProductivaResultado, 
        GestionProductivaEntrada.id_produccion == GestionProductivaResultado.id_produccion,
        isouter=True  # LEFT JOIN por seguridad, asegura que traiga la entrada aunque falte el resultado
    ).order_by(
        GestionProductivaEntrada.id_produccion.desc()
    ).offset(skip).limit(limit).all()

    # Formatear la salida como una lista de diccionarios para facilitar su envío como JSON
    resultado = []
    for reg in registros:
        resultado.append({
            "id_produccion": reg.id_produccion,
            "fecha": reg.fecha,
            "turno": reg.turno,
            "tecnico": reg.tecnico,
            "total_gruesas": reg.total_gruesas,
            "total_gruesas_lisas": reg.total_gruesas_lisas,
            "total_gruesas_decoradas": reg.total_gruesas_decoradas,
            "eficiencia_productiva": reg.eficiencia_productiva,
            "deficiencia_productiva": reg.deficiencia_productiva
        })
    
    return {
        "data": resultado,
        "total": total
    }


def obtener_produccion_por_id(db: Session, id_produccion: int):
    """
    Consulta un movimiento específico por su ID.
    Al estar configuradas las relaciones en models.py, esto también
    te dará acceso a 'entrada.salidas' y 'entrada.resultado'.
    """
    return db.query(GestionProductivaEntrada)\
             .filter(GestionProductivaEntrada.id_produccion == id_produccion)\
             .first()


def crear_registro_produccion(db: Session, datos):
    """
    Registra la cabecera (Entrada), los múltiples modelos (Salida) 
    y las métricas (Resultado) en una sola transacción.
    """
    # 1. Crear la cabecera del turno (Entrada)
    nueva_entrada = GestionProductivaEntrada(
        fecha=datos.fecha,
        turno=datos.turno,
        tecnico=datos.tecnico,
        cant_envases_d1=datos.cant_envases_d1,
        cant_envases_d2=datos.cant_envases_d2,
        cant_envases_d3=datos.cant_envases_d3,
        cant_envases_d4=datos.cant_envases_d4,
        total_envases=datos.total_envases,
        total_gruesas=datos.total_gruesas
    )
    db.add(nueva_entrada)
    db.flush() # Sincroniza temporalmente para generar el id_produccion

    # 2. Iterar sobre la lista de modelos para crear los detalles (Salida)
    for salida_data in datos.salidas:
        nueva_salida = GestionProductivaSalida(
            id_produccion=nueva_entrada.id_produccion,
            modelo_molde=salida_data.modelo_molde,
            total_paletas=salida_data.total_paletas,
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

    # 3. Crear el consolidado final (Resultado)
    nuevo_resultado = GestionProductivaResultado(
        id_produccion=nueva_entrada.id_produccion,
        total_gruesas_lisas=datos.resultado.total_gruesas_lisas,
        total_gruesas_decoradas=datos.resultado.total_gruesas_decoradas,
        eficiencia_productiva=datos.resultado.eficiencia_productiva,
        deficiencia_productiva=datos.resultado.deficiencia_productiva,
        observaciones=datos.resultado.observaciones
    )
    db.add(nuevo_resultado)

    # Confirmar todos los cambios juntos
    db.commit()
    db.refresh(nueva_entrada)
    return nueva_entrada


def actualizar_registro_produccion(db: Session, id_produccion: int, datos):
    """
    Actualiza el registro. Modifica la cabecera, actualiza los totales de 
    resultado y reemplaza la lista de modelos.
    """
    # Buscar el registro principal
    entrada_actual = db.query(GestionProductivaEntrada).filter(GestionProductivaEntrada.id_produccion == id_produccion).first()
    
    if not entrada_actual:
        return None

    # 1. Actualizar campos de la Entrada
    entrada_actual.fecha = datos.fecha
    entrada_actual.turno = datos.turno
    entrada_actual.tecnico = datos.tecnico
    entrada_actual.cant_envases_d1 = datos.cant_envases_d1
    entrada_actual.cant_envases_d2 = datos.cant_envases_d2
    entrada_actual.cant_envases_d3 = datos.cant_envases_d3
    entrada_actual.cant_envases_d4 = datos.cant_envases_d4
    entrada_actual.total_envases = datos.total_envases
    entrada_actual.total_gruesas = datos.total_gruesas

    # 2. Actualizar el Resultado (1 a 1)
    if entrada_actual.resultado:
        entrada_actual.resultado.total_gruesas_lisas = datos.resultado.total_gruesas_lisas
        entrada_actual.resultado.total_gruesas_decoradas = datos.resultado.total_gruesas_decoradas
        entrada_actual.resultado.eficiencia_productiva = datos.resultado.eficiencia_productiva
        entrada_actual.resultado.deficiencia_productiva = datos.resultado.deficiencia_productiva
        entrada_actual.resultado.observaciones = datos.resultado.observaciones

    # 3. Sincronizar las Salidas (Modelos)
    db.query(GestionProductivaSalida).filter(GestionProductivaSalida.id_produccion == id_produccion).delete()
    
    for salida_data in datos.salidas:
        nueva_salida = GestionProductivaSalida(
            id_produccion=id_produccion,
            modelo_molde=salida_data.modelo_molde,
            total_paletas=salida_data.total_paletas,
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

    db.commit()
    db.refresh(entrada_actual)
    return entrada_actual