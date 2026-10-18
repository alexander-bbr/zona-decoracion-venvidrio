# backend/modules/exportacion/services.py
from sqlalchemy.orm import Session
from sqlalchemy import text, func, or_
from fastapi import HTTPException
from datetime import date
from decimal import Decimal

from backend.modules.rendimiento.services import obtener_rendimiento_moldes as obtener_rendimiento_moldes_db
from backend.modules.inventario_insumos.services import obtener_lista_insumos
from backend.modules.inventario_pantallas.services import obtener_lista_pantallas
from backend.modules.gestion_productiva.produccion.models import (
    GestionProductivaCabecera, 
    GestionProductivaResultado,
    GestionProductivaEntrada,
    GestionProductivaSalida
)

from backend.modules.gestion_productiva.gestion_moldes.services import obtener_lista_moldes
from backend.modules.gestion_productiva.gestion_justificantes.services import obtener_lista_justificantes
from backend.utils.excel import crear_libro, escribir_cabecera, escribir_filas, libro_a_bytes, escribir_totales


#CONSULTA EL HISTORIAL DE GESTION PRODUCTIVA FILTRADO POR RANGO DE FECHAS
#NO USA PAGINACION PORQUE SE NECESITAN TODOS LOS REGISTROS PARA EL EXCEL
def obtener_produccion_por_fechas(
    db: Session, fecha_desde: date, fecha_hasta: date,
    tecnico: str = None, turno: int = None, totalGruesas: Decimal = None,
    totalGruesasLisas: Decimal = None, totalGruesasDecoradas: Decimal = None,
    eficiencia: Decimal = None, item: str = None
):
    query = db.query(
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

    query = query.filter(
        func.date(GestionProductivaCabecera.fecha) >= fecha_desde,
        func.date(GestionProductivaCabecera.fecha) <= fecha_hasta
    )

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
        GestionProductivaCabecera.fecha.desc()
    ).all()

    ids_cabeceras = [reg.id_cabecera for reg in registros]
    
    moldes_dict = {}
    if ids_cabeceras:
        moldes_query = db.query(
            GestionProductivaEntrada.id_cabecera,
            GestionProductivaEntrada.id_molde
        ).filter(
            GestionProductivaEntrada.id_cabecera.in_(ids_cabeceras)
        ).distinct().all()

        for id_cab, molde_item in moldes_query:
            if id_cab not in moldes_dict:
                moldes_dict[id_cab] = []
            if molde_item not in moldes_dict[id_cab]:
                moldes_dict[id_cab].append(molde_item)

    return [
        {
            "Fecha":                reg.fecha.strftime("%d/%m/%Y") if reg.fecha else None,
            "Turno":                reg.turno,
            "Grupo":                reg.grupo,
            "Técnico":              reg.tecnico,
            "Moldes":               "\n".join(moldes_dict.get(reg.id_cabecera, [])),
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
def exportar_gestion_productiva(
    db: Session, fecha_desde: date, fecha_hasta: date,
    tecnico: str = None, turno: int = None, totalGruesas: Decimal = None,
    totalGruesasLisas: Decimal = None, totalGruesasDecoradas: Decimal = None,
    eficiencia: Decimal = None, item: str = None
) -> bytes:
    datos = obtener_produccion_por_fechas(
        db, fecha_desde, fecha_hasta, tecnico, turno, 
        totalGruesas, totalGruesasLisas, totalGruesasDecoradas, eficiencia, item
    )

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron registros en el rango de fechas indicado.")

    # Formateamos las fechas para el título
    desde_str = fecha_desde.strftime("%d/%m/%Y")
    hasta_str = fecha_hasta.strftime("%d/%m/%Y")
    titulo = f"Historial de Gestión Productiva | Desde: {desde_str} Hasta: {hasta_str}"

    columnas = ["Fecha", "Turno", "Grupo", "Técnico", "Moldes", "Total Gruesas", "Gruesas Lisas", "Gruesas Decoradas", "Eficiencia", "Deficiencia"]

    libro, hoja = crear_libro("Gestión Productiva")
    
    # Título en la fila 1, cabeceras en la 2
    escribir_cabecera(hoja, columnas, titulo=titulo, fila_inicio=1)
    
    # Datos empiezan en la fila 3
    escribir_filas(hoja, datos, columnas, fila_inicio=3)
    
    # Totales empiezan a calcularse desde la fila 3
    escribir_totales(hoja, columnas, len(datos), fila_inicio=3)

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
    datos_originales = obtener_lista_moldes(db)
    
    # Convertimos True/False a texto para el Excel
    datos = []
    for d in datos_originales:
        d_copy = d.copy()
        d_copy["estado"] = "Activo" if d_copy.get("estado") else "Inactivo"
        datos.append(d_copy)

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron moldes registrados.")

    columnas = ["item", "nombre", "descripcion", "numero_camadas", "numero_envases", "numero_gruesas", "estado"]
    cabeceras = ["Item", "Nombre", "Descripción", "N° Camadas", "N° Envases", "N° Gruesas", "Estado"]

    libro, hoja = crear_libro("Moldes")
    escribir_cabecera(hoja, cabeceras)
    escribir_filas(hoja, datos, columnas)

    return libro_a_bytes(libro)



#GENERA EL ARCHIVO EXCEL DEL LISTADO DE JUSTIFICANTES
def exportar_justificantes(db: Session) -> bytes:
    datos_originales = obtener_lista_justificantes(db)
    
    # Convertimos True/False a texto para el Excel
    datos = []
    for d in datos_originales:
        d_copy = d.copy()
        d_copy["estado"] = "Activo" if d_copy.get("estado") else "Inactivo"
        datos.append(d_copy)

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron justificantes registrados.")

    columnas = ["etiqueta", "descripcion", "estado"]
    cabeceras = ["Etiqueta", "Descripción", "Estado"]

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

#GENERA EL ARCHIVO EXCEL DEL RENDIMIENTO DE MOLDES
def exportar_rendimiento_moldes_service(db: Session, fecha_desde: date, fecha_hasta: date) -> bytes:
    datos = obtener_rendimiento_moldes_db(db, fecha_desde, fecha_hasta)

    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron moldes con producción o activos en el rango de fechas indicado.")

    # Formateamos las fechas para el título
    desde_str = fecha_desde.strftime("%d/%m/%Y")
    hasta_str = fecha_hasta.strftime("%d/%m/%Y")
    titulo = f"Rendimiento por Molde | Desde: {desde_str} Hasta: {hasta_str}"

    columnas = [
        "item", "nombre", "descripcion", 
        "gruesas_lisas", "entradas_gruesas", "gruesas_decoradas", 
        "gruesas_defectuosas", "eficiencia", "deficiencia"
    ]
    
    cabeceras = [
        "Item", "Nombre", "Descripción", 
        "Gruesas Lisas", "Entradas (Gruesas)", "Gruesas Decoradas", 
        "Gruesas Defectuosas", "Eficiencia (%)", "Deficiencia (%)"
    ]

    libro, hoja = crear_libro("Rendimiento por Molde")
    
    # Le pasamos el título y decimos que empiece en la fila 1
    escribir_cabecera(hoja, cabeceras, titulo=titulo, fila_inicio=1)
    
    # Le decimos que los datos empiecen en la fila 3 (porque la 2 es la cabecera)
    escribir_filas(hoja, datos, columnas, fila_inicio=3)

    return libro_a_bytes(libro)