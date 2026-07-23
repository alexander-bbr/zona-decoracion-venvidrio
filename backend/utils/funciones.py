# utils/funciones.py

# Importamos el motor de tu nueva conexión y la utilidad text de SQLAlchemy
from backend.database.conexion import engine
from sqlalchemy import text

def insertar_registro(nombre_tabla: str, datos: dict):
    # zona contra errores
    try:
        # Le pedimos al motor que abra una conexión segura.
        # Con el bloque 'with', la conexión se cerrará SOLA automáticamente al terminar.
        with engine.connect() as conexion:

            # Extraemos los nombres de las columnas separados por comas
            columnas = ', '.join(datos.keys())

            # Creamos los comodines con dos puntos (estilo SQLAlchemy)
            comodines = ", ".join([f":{llave}" for llave in datos.keys()])

            # Armamos la consulta SQL (Sigue siendo la misma lógica que armaste)
            query = f"INSERT INTO {nombre_tabla} ({columnas}) VALUES ({comodines})"

            # Ejecutamos la consulta pasando el diccionario directo.
            # 'text(query)' le da el formato que SQLAlchemy exige y 'datos' inyecta los valores de forma segura.
            resultado = conexion.execute(text(query), datos)
            
            # Guardamos los cambios físicamente en la base de datos 
            conexion.commit()
            
            # Retornamos éxito al router
            return {
                "status": "success", 
                "message": "Registro insertado exitosamente con SQLAlchemy", 
                "id": resultado.lastrowid  # SQLAlchemy también te da el último ID insertado
            }

    # Si algo falla en el proceso de arriba, saltamos aquí
    except Exception as e:
        return {"status": "error", "message": f"Error en la base de datos: {str(e)}"}
    


def obtener_registros(nombre_tabla: str, desde_id: int = None):
    """
    - Si NO recibe 'desde_id': Trae absolutamente todos los registros (Uso: Módulo de Pintura).
    - Si SÍ recibe 'desde_id': Trae solo los registros más nuevos a partir de ese ID (Uso: Dashboard).
    
    """
    try:
        with engine.connect() as conexion:
            
            # Verificamos si el servicio solicitó un filtro por ID
            if desde_id is not None:
                # Traemos solo los registros cuyo ID sea mayor al último visto en el frontend
                query = f"SELECT * FROM {nombre_tabla} WHERE id > :desde_id ORDER BY id ASC"
                resultado = conexion.execute(text(query), {"desde_id": desde_id})
            else:
                # Si desde_id es None, mantenemos el comportamiento original de traer todo
                query = f"SELECT * FROM {nombre_tabla}"
                resultado = conexion.execute(text(query))
            
            # Convertimos las filas de MySQL en diccionarios limpios de Python
            registros = [dict(fila) for fila in resultado.mappings()]
            
            return {"status": "success", "data": registros}

    except Exception as e:
        return {"status": "error", "message": f"Error al obtener datos: {str(e)}"}



def filtrar_registros_dashboard(nombre_tabla: str, columna_fecha: str, fromDate: str, toDate: str):
    """
    Filtra registros de cualquier tabla basándose en un rango de fechas.
    Ideal para alimentar los gráficos del frontend.
    """
    try:
        with engine.connect() as conexion:
            # Usamos BETWEEN para buscar entre las dos fechas dadas por el frontend.
            # Inyectamos el nombre de la tabla y la columna de fecha dinámicamente,
            # y usamos comodines de SQLAlchemy para las fechas por seguridad.
            query = f"SELECT * FROM {nombre_tabla} WHERE {columna_fecha} BETWEEN :fromDate AND :toDate ORDER BY {columna_fecha} ASC"
            
            resultado = conexion.execute(text(query), {
                "fromDate": fromDate, 
                "toDate": toDate
            })
            
            # Convertimos las filas a diccionarios
            registros = [dict(fila) for fila in resultado.mappings()]
            
            return {"status": "success", "data": registros}

    except Exception as e:
        return {"status": "error", "message": f"Error al filtrar datos en {nombre_tabla}: {str(e)}"} 




#funcion generica para generar alertas de notificacion
#funcion generica para filtrar en el dashboard cantidades de tablas
# funcio generica para pedir inventario de cualquier insumo
# funcion generica para convertir el ecxel en un pdf y descasrgarlo



