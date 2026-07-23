# utils/db_funciones.py

# GUÍA DE USO:
# - obtener_inventario_generico: Se usará en los archivos services.py 
#   de cada módulo (ej. backend/modules/pintura/services.py)[cite: 9].
# - filtrar_registros_dashboard: Se usará en services/dashboard_service.py 
#   para alimentar los gráficos de React[cite: 10].

from sqlalchemy.orm import Session

def obtener_inventario_generico(db: Session, modelo):
    """
    Retorna todo el inventario de cualquier modelo de SQLAlchemy.
    """
    try:
        inventario = db.query(modelo).all()
        return {"status": "success", "data": inventario}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def filtrar_registros_dashboard(db: Session, modelo, nombre_columna_fecha: str, from_date: str, to_date: str):
    """
    Filtra registros por fecha usando el ORM de SQLAlchemy y los devuelve 
    como diccionarios para el agrupamiento en el dashboard.
    """
    try:
        # Obtenemos la columna del modelo dinámicamente
        columna_fecha = getattr(modelo, nombre_columna_fecha)
        
        # Consulta con ORM en lugar de SQL crudo
        resultados = db.query(modelo).filter(
            columna_fecha >= from_date,
            columna_fecha <= to_date
        ).order_by(columna_fecha.asc()).all()
        
        # Convertimos los objetos SQLAlchemy a diccionarios limpios
        registros = []
        for fila in resultados:
            fila_dict = fila.__dict__.copy()
            # Eliminamos la llave interna que agrega SQLAlchemy
            fila_dict.pop("_sa_instance_state", None) 
            registros.append(fila_dict)
            
        return {"status": "success", "data": registros}

    except Exception as e:
        return {"status": "error", "message": str(e)}