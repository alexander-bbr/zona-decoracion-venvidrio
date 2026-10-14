# backend/modules/exportacion/services.py
from sqlalchemy.orm import Session
from sqlalchemy import text, func
from fastapi import HTTPException
from datetime import date

from backend.modules.gestion_productiva.produccion.services import obtener_lista_moldes, obtener_lista_justificantes
from backend.modules.inventario_insumos.services import obtener_lista_insumos
from backend.modules.inventario_pantallas.services import obtener_lista_pantallas
from backend.modules.gestion_productiva.produccion.models import GestionProductivaCabecera, GestionProductivaResultado
from backend.utils.excel import crear_libro, escribir_cabecera, escribir_filas, libro_a_bytes


#CONSULTA EL HISTORIAL DE GESTION PRODUCTIVA FILTRADO POR RANGO DE FECHAS
#NO USA PAGINACION PORQUE SE NECESITAN TODOS LOS REGISTROS PARA EL EXCEL
def obtener_produccion_por_fechas(db: Session, fecha_desde: date, fecha_hasta: date):
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
    ).filter(
        func.date(GestionProductivaCabecera.fecha) >= fecha_desde,
        func.date(GestionProductivaCabecera.fecha) <= fecha_hasta
    ).order_by(
        GestionProductivaCabecera.fecha.desc()
    ).all()

    return [
        {
            "Fecha":                reg.fecha.strftime("%d/%m/%Y") if reg.fecha else None,
            "Turno":                reg.turno,
            "Grupo":                reg.grupo,
            "Técnico":              reg.tecnico,
            "Total Gruesas":        reg.total_gruesas,
            "Gruesas Lisas":        reg.total_gruesas_lisas,
            "Gruesas Decoradas":    reg.total_gruesas_decoradas,
            "Eficiencia":           reg.eficiencia_productiva,
            "Deficiencia":          reg.deficiencia_productiva
        }
        for reg in registros
    ]


#CONSULTA EL HISTORIAL DE MOVIMIENTOS DE INVENTARIO FILTRADO POR RANGO DE FECHAS
#USA SQL NATIVO CON UNION ALL IGUAL QUE LA FUNCION EXISTENTE PERO SIN PAGINACION Y CON FILTRO DE FECHAS
def obtener_movimientos_inventario_por_fechas(db: Session, fecha_desde: date, fecha_hasta: date):
    query = """
        SELECT 'Entrada'              AS tipo_movimiento,
               i.tipo                 AS tipo_insumo,
               i.articulo,
               e.fecha,
               e.encargado,
               e.turno,
               e.grupo,
               e.cantidad
        FROM inventario_insumos_entrada e
        JOIN inventario_insumos i ON e.id_insumo = i.id_insumo
        WHERE DATE(e.fecha) >= :fecha_desde AND DATE(e.fecha) <= :fecha_hasta

        UNION ALL

        SELECT 'Salida'              AS tipo_movimiento,
               i.tipo                AS tipo_insumo,
               i.articulo,
               s.fecha,
               s.encargado,
               s.turno,
               s.grupo,
               s.cantidad
        FROM inventario_insumos_salida s
        JOIN inventario_insumos i ON s.id_insumo = i.id_insumo
        WHERE DATE(s.fecha) >= :fecha_desde AND DATE(s.fecha) <= :fecha_hasta

        ORDER BY fecha DESC
    """

    filas = db.execute(text(query), {"fecha_desde": fecha_desde, "fecha_hasta": fecha_hasta}).fetchall()

    return [
        {
            "Tipo Movimiento":  fila.tipo_movimiento,
            "Tipo Insumo":      fila.tipo_insumo,
            "Artículo":         fila.articulo,
            "Fecha":            fila.fecha.strftime("%d/%m/%Y") if fila.fecha else None,
            "Encargado":        fila.encargado,
            "Turno":            fila.turno,
            "Grupo":            fila.grupo,
            "Cantidad":         fila.cantidad
        }
        for fila in filas
    ]


#CONSULTA EL HISTORIAL DE MOVIMIENTOS DE PANTALLAS FILTRADO POR RANGO DE FECHAS
#USA SQL NATIVO CON UNION ALL SIN PAGINACION Y CON FILTRO DE FECHAS
def obtener_movimientos_pantallas_por_fechas(db: Session, fecha_desde: date, fecha_hasta: date):
    query = """
        SELECT 'Entrada'              AS tipo_movimiento,
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
        WHERE DATE(e.fecha) >= :fecha_desde AND DATE(e.fecha) <= :fecha_hasta

        UNION ALL

        SELECT 'Salida'               AS tipo_movimiento,
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
        WHERE DATE(s.fecha) >= :fecha_desde AND DATE(s.fecha) <= :fecha_hasta

        ORDER BY fecha DESC
    """

    filas = db.execute(text(query), {"fecha_desde": fecha_desde, "fecha_hasta": fecha_hasta}).fetchall()

    return [
        {
            "Tipo Movimiento":  fila.tipo_movimiento,
            "Nombre":           fila.nombre,
            "Descripción":      fila.descripcion,
            "Tipo":             fila.tipo,
            "Fecha":            fila.fecha.strftime("%d/%m/%Y") if fila.fecha else None,
            "Encargado":        fila.encargado,
            "Turno":            fila.turno,
            "Grupo":            fila.grupo,
            "Cantidad":         fila.cantidad
        }
        for fila in filas
    ]


#GENERA EL ARCHIVO EXCEL DE HISTORIAL DE GESTION PRODUCTIVA
def exportar_gestion_productiva(db: Session, fecha_desde: date, fecha_hasta: date) -> bytes:
    datos = obtener_produccion_por_fechas(db, fecha_desde, fecha_hasta)

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron registros en el rango de fechas indicado.")

    columnas = ["Fecha", "Turno", "Grupo", "Técnico", "Total Gruesas", "Gruesas Lisas", "Gruesas Decoradas", "Eficiencia", "Deficiencia"]

    libro, hoja = crear_libro("Gestión Productiva")
    escribir_cabecera(hoja, columnas)
    escribir_filas(hoja, datos, columnas)

    return libro_a_bytes(libro)


#GENERA EL ARCHIVO EXCEL DE HISTORIAL DE MOVIMIENTOS DE INVENTARIO
def exportar_movimientos_inventario(db: Session, fecha_desde: date, fecha_hasta: date) -> bytes:
    datos = obtener_movimientos_inventario_por_fechas(db, fecha_desde, fecha_hasta)

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron registros en el rango de fechas indicado.")

    columnas = ["Tipo Movimiento", "Tipo Insumo", "Artículo", "Fecha", "Encargado", "Turno", "Grupo", "Cantidad"]

    libro, hoja = crear_libro("Movimientos Inventario")
    escribir_cabecera(hoja, columnas)
    escribir_filas(hoja, datos, columnas)

    return libro_a_bytes(libro)



#GENERA EL ARCHIVO EXCEL DEL LISTADO DE MOLDES
def exportar_moldes(db: Session) -> bytes:
    datos = sorted(obtener_lista_moldes(db), key=lambda x: x["id_molde"])

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron moldes registrados.")

    columnas = ["nombre", "descripcion", "numero_camadas", "numero_envases", "numero_gruesas"]
    cabeceras = ["Nombre", "Descripción", "N° Camadas", "N° Envases", "N° Gruesas"]

    libro, hoja = crear_libro("Moldes")
    escribir_cabecera(hoja, cabeceras)
    escribir_filas(hoja, datos, columnas)

    return libro_a_bytes(libro)


#GENERA EL ARCHIVO EXCEL DEL LISTADO DE JUSTIFICANTES
def exportar_justificantes(db: Session) -> bytes:
    datos = obtener_lista_justificantes(db)

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron justificantes registrados.")

    columnas = ["etiqueta", "descripcion"]
    cabeceras = ["Etiqueta", "Descripción"]

    libro, hoja = crear_libro("Justificantes")
    escribir_cabecera(hoja, cabeceras)
    escribir_filas(hoja, datos, columnas)

    return libro_a_bytes(libro)


#GENERA EL ARCHIVO EXCEL DEL LISTADO DE INSUMOS
def exportar_insumos(db: Session) -> bytes:
    datos = sorted(obtener_lista_insumos(db), key=lambda x: (x["tipo"].lower(), x["articulo"].lower()))

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron insumos registrados.")

    columnas = ["tipo", "articulo", "unidad", "cantidad_actual", "cantidad_minima"]
    cabeceras = ["Tipo", "Artículo", "Unidad", "Cantidad Actual", "Cantidad Mínima"]

    libro, hoja = crear_libro("Insumos")
    escribir_cabecera(hoja, cabeceras)
    escribir_filas(hoja, datos, columnas)

    return libro_a_bytes(libro)

#GENERA EL ARCHIVO EXCEL DE HISTORIAL DE MOVIMIENTOS DE PANTALLAS
def exportar_movimientos_pantallas(db: Session, fecha_desde: date, fecha_hasta: date) -> bytes:
    datos = obtener_movimientos_pantallas_por_fechas(db, fecha_desde, fecha_hasta)

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron registros en el rango de fechas indicado.")

    columnas = ["Tipo Movimiento", "Nombre", "Descripción", "Tipo", "Fecha", "Encargado", "Turno", "Grupo", "Cantidad"]

    libro, hoja = crear_libro("Movimientos Pantallas")
    escribir_cabecera(hoja, columnas)
    escribir_filas(hoja, datos, columnas)

    return libro_a_bytes(libro)


#GENERA EL ARCHIVO EXCEL DEL LISTADO DE PANTALLAS
def exportar_pantallas(db: Session) -> bytes:
    datos = sorted(obtener_lista_pantallas(db), key=lambda x: (x["tipo"].lower(), x["nombre"].lower()))

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron pantallas registradas.")

    columnas = ["tipo", "nombre", "descripcion", "cantidad_actual"]
    cabeceras = ["Tipo", "Nombre", "Descripción", "Cantidad Actual"]

    libro, hoja = crear_libro("Pantallas")
    escribir_cabecera(hoja, cabeceras)
    escribir_filas(hoja, datos, columnas)

    return libro_a_bytes(libro)