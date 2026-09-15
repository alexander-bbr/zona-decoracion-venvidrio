# backend/modules/inventario/inventario_insumos/services.py
from sqlalchemy import text
from datetime import datetime
from sqlalchemy.orm import Session
from .models import Insumo, InsumoEntrada, InsumoSalida


def registrar_entrada(db: Session, datos):
    # Verificar que el insumo existe
    insumo = db.query(Insumo).filter(Insumo.id_insumo == datos.id_insumo).first()
    if not insumo or not insumo.estado:
        return None

    # Registrar el movimiento de entrada
    nueva_entrada = InsumoEntrada(
        id_insumo = datos.id_insumo,
        fecha     = datetime.now(),
        encargado = datos.encargado,
        turno     = datos.turno,
        grupo     = datos.grupo,
        cantidad  = datos.cantidad
    )
    db.add(nueva_entrada)

    # Sumar la cantidad al stock actual
    insumo.cantidad_actual += datos.cantidad

    db.commit()
    db.refresh(nueva_entrada)
    return nueva_entrada


def registrar_salida(db: Session, datos):
    # Verificar que el insumo existe
    insumo = db.query(Insumo).filter(Insumo.id_insumo == datos.id_insumo).first()
    if not insumo or not insumo.estado:
        return None

    if insumo.cantidad_actual < datos.cantidad:
        return None

    # Registrar el movimiento de salida
    nueva_salida = InsumoSalida(
        id_insumo = datos.id_insumo,
        fecha     = datetime.now(),
        encargado = datos.encargado,
        turno     = datos.turno,
        grupo     = datos.grupo,
        cantidad  = datos.cantidad
    )
    db.add(nueva_salida)

    # Restar la cantidad del stock actual
    insumo.cantidad_actual -= datos.cantidad

    db.commit()
    db.refresh(nueva_salida)
    return nueva_salida


def obtener_lista_insumos(db: Session):
    # Solo se listan los insumos activos
    insumos = db.query(Insumo).filter(Insumo.estado == True).order_by(Insumo.id_insumo.asc()).all()

    resultado = []
    for insumo in insumos:
        resultado.append({
            "id_insumo":       insumo.id_insumo,
            "tipo":            insumo.tipo,
            "articulo":        insumo.articulo,
            "unidad":          insumo.unidad,
            "cantidad_actual": insumo.cantidad_actual,
            "cantidad_minima": insumo.cantidad_minima
        })

    return resultado


def obtener_historial(db: Session, skip: int, limit: int):
    # Se usa SQL nativo con UNION ALL en lugar de ORM porque necesitamos
    # mezclar dos tablas distintas, ordenarlas y paginar todo en una sola
    # consulta. Hacerlo en Python implicaría traer todos los registros a
    # memoria antes de poder paginar, lo cual no escala bien.
    query = """
        SELECT 'entrada'              AS tipo,
               id_inventario_entrada  AS id_movimiento,
               id_insumo,
               fecha,
               encargado,
               turno,
               grupo,
               cantidad
        FROM inventario_insumos_entrada

        UNION ALL

        SELECT 'salida'              AS tipo,
               id_inventario_salida  AS id_movimiento,
               id_insumo,
               fecha,
               encargado,
               turno,
               grupo,
               cantidad
        FROM inventario_insumos_salida

        ORDER BY fecha DESC
        LIMIT :limit OFFSET :skip
    """

    filas = db.execute(text(query), {"skip": skip, "limit": limit}).fetchall()

    historial = []
    for fila in filas:
        if fila.tipo == "entrada":
            historial.append({
                "id_inventario_entrada": fila.id_movimiento,
                "id_insumo":             fila.id_insumo,
                "fecha":                 fila.fecha.strftime("%Y-%m-%d"),
                "encargado":             fila.encargado,
                "turno":                 fila.turno,
                "grupo":                 fila.grupo,
                "cantidad":              fila.cantidad
            })
        else:
            historial.append({
                "id_inventario_salida": fila.id_movimiento,
                "id_insumo":            fila.id_insumo,
                "fecha":                fila.fecha.strftime("%Y-%m-%d"),
                "encargado":            fila.encargado,
                "turno":                fila.turno,
                "grupo":                fila.grupo,
                "cantidad":             fila.cantidad
            })

    return historial


def crear_insumo(db: Session, datos):
    nuevo_insumo = Insumo(
        tipo            = datos.tipo,
        articulo        = datos.articulo,
        unidad          = datos.unidad,
        cantidad_actual = 0.00,
        cantidad_minima = datos.cantidad_minima,
        estado          = datos.estado
    )
    db.add(nuevo_insumo)
    db.commit()
    db.refresh(nuevo_insumo)
    return nuevo_insumo


def obtener_insumo_por_id(db: Session, id_insumo: int):
    return db.query(Insumo).filter(Insumo.id_insumo == id_insumo).first()


def editar_insumo(db: Session, id_insumo: int, datos):
    insumo = db.query(Insumo).filter(Insumo.id_insumo == id_insumo).first()

    if not insumo:
        return None

    insumo.tipo            = datos.tipo
    insumo.articulo        = datos.articulo
    insumo.unidad          = datos.unidad
    insumo.cantidad_minima = datos.cantidad_minima
    insumo.estado          = datos.estado

    db.commit()
    db.refresh(insumo)
    return insumo