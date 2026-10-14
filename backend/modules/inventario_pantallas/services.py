# backend/modules/inventario/inventario_pantallas/services.py

from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime

from .models import Pantalla, PantallaEntrada, PantallaSalida


def registrar_entrada(db: Session, datos):
    pantalla = db.query(Pantalla).filter(Pantalla.id_pantalla == datos.id_pantalla).first()
    if not pantalla or not pantalla.estado:
        return None

    nueva_entrada = PantallaEntrada(
        id_pantalla = datos.id_pantalla,
        fecha       = datetime.now(),
        encargado   = datos.encargado,
        turno       = datos.turno,
        grupo       = datos.grupo,
        cantidad    = datos.cantidad
    )
    db.add(nueva_entrada)

    pantalla.cantidad_actual += datos.cantidad

    db.commit()
    db.refresh(nueva_entrada)
    return nueva_entrada


def registrar_salida(db: Session, datos):
    pantalla = db.query(Pantalla).filter(Pantalla.id_pantalla == datos.id_pantalla).first()
    if not pantalla or not pantalla.estado:
        return None

    if pantalla.cantidad_actual < datos.cantidad:
        return None

    nueva_salida = PantallaSalida(
        id_pantalla = datos.id_pantalla,
        fecha       = datetime.now(),
        encargado   = datos.encargado,
        turno       = datos.turno,
        grupo       = datos.grupo,
        cantidad    = datos.cantidad
    )
    db.add(nueva_salida)

    pantalla.cantidad_actual -= datos.cantidad

    db.commit()
    db.refresh(nueva_salida)
    return nueva_salida


def obtener_lista_pantallas(db: Session):
    pantallas = db.query(Pantalla).filter(Pantalla.estado == True).order_by(Pantalla.tipo.asc(), Pantalla.nombre.asc()).all()

    return [
        {
            "id_pantalla":     p.id_pantalla,
            "nombre":          p.nombre,
            "descripcion":     p.descripcion,
            "tipo":            p.tipo,
            "cantidad_actual": p.cantidad_actual
        }
        for p in pantallas
    ]


def obtener_historial(db: Session, skip: int, limit: int):
    # Se usa SQL nativo con UNION ALL porque necesitamos mezclar dos tablas
    # distintas, ordenarlas por fecha y paginar en una sola consulta.
    # Hacerlo en Python implicaría traer todos los registros a memoria
    # antes de poder paginar, lo cual no escala bien.
    query = """
        SELECT 'entrada'              AS tipo_movimiento,
               e.id_inventario_entrada AS id_movimiento,
               p.id_pantalla,
               p.nombre,
               p.descripcion,
               p.tipo,
               e.fecha,
               e.encargado,
               e.turno,
               e.grupo,
               e.cantidad
        FROM inventario_pantallas_entrada e
        JOIN inventario_pantallas p ON e.id_pantalla = p.id_pantalla

        UNION ALL

        SELECT 'salida'               AS tipo_movimiento,
               s.id_inventario_salida AS id_movimiento,
               p.id_pantalla,
               p.nombre,
               p.descripcion,
               p.tipo,
               s.fecha,
               s.encargado,
               s.turno,
               s.grupo,
               s.cantidad
        FROM inventario_pantallas_salida s
        JOIN inventario_pantallas p ON s.id_pantalla = p.id_pantalla

        ORDER BY fecha DESC
        LIMIT :limit OFFSET :skip
    """

    filas = db.execute(text(query), {"skip": skip, "limit": limit}).fetchall()

    historial = []
    for fila in filas:
        if fila.tipo_movimiento == "entrada":
            historial.append({
                "id_inventario_entrada": fila.id_movimiento,
                "nombre":                fila.nombre,
                "descripcion":           fila.descripcion,
                "tipo":                  fila.tipo,
                "fecha":                 fila.fecha.strftime("%Y-%m-%d"),
                "encargado":             fila.encargado,
                "turno":                 fila.turno,
                "grupo":                 fila.grupo,
                "cantidad":              fila.cantidad
            })
        else:
            historial.append({
                "id_inventario_salida": fila.id_movimiento,
                "nombre":               fila.nombre,
                "descripcion":          fila.descripcion,
                "tipo":                 fila.tipo,
                "fecha":                fila.fecha.strftime("%Y-%m-%d"),
                "encargado":            fila.encargado,
                "turno":                fila.turno,
                "grupo":                fila.grupo,
                "cantidad":             fila.cantidad
            })

    return historial


def crear_pantalla(db: Session, datos):
    nueva_pantalla = Pantalla(
        nombre          = datos.nombre,
        descripcion     = datos.descripcion,
        tipo            = datos.tipo,
        cantidad_actual = 0,
        estado          = datos.estado
    )
    db.add(nueva_pantalla)
    db.commit()
    db.refresh(nueva_pantalla)
    return nueva_pantalla


def obtener_pantalla_por_id(db: Session, id_pantalla: int):
    return db.query(Pantalla).filter(Pantalla.id_pantalla == id_pantalla).first()


def editar_pantalla(db: Session, id_pantalla: int, datos):
    pantalla = db.query(Pantalla).filter(Pantalla.id_pantalla == id_pantalla).first()
    if not pantalla:
        return None

    pantalla.nombre      = datos.nombre
    pantalla.descripcion = datos.descripcion
    pantalla.tipo        = datos.tipo
    pantalla.estado      = datos.estado

    db.commit()
    db.refresh(pantalla)
    return pantalla