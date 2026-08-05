# backend/modules/dashboard/services.py

# Importamos la función ORM nueva y le asignamos un alias
from backend.utils.db_funciones import filtrar_registros_dashboard as filtrar_registros_orm
# Importamos tu función vieja para mantener lo de envases intacto
from backend.utils.funciones import filtrar_registros_dashboard as filtrar_registros_viejo

from collections import defaultdict
from sqlalchemy.orm import Session

# Importamos tu modelo real de producción lisa
from backend.modules.produccion.produccion_lisa.models import RegistroProduccionLisa

def obtener_datos_dashboard(db: Session, fromDate: str, toDate: str):
    """
    Obtiene y agrupa los datos usando el ORM para producción lisa y 
    la lógica vieja para envases decorados y defectuosos.
    """
    
    # 1. PRODUCCIÓN LISA: Usa la lógica nueva del ORM (pide la sesión 'db' y el Modelo)
    res_lisa = filtrar_registros_orm(db, RegistroProduccionLisa, "fecha_registro", fromDate, toDate)
    
    # ENVASES: Siguen usando la lógica vieja por strings (sin pasar la 'db')
    res_decorados = filtrar_registros_viejo("envases_decorados", "fecha_decorada", fromDate, toDate)
    res_defectuosos = filtrar_registros_viejo("envases_defectuoso", "fecha_produccion", fromDate, toDate)

    # Si alguna de las consultas falló, retornamos el error inmediatamente
    if res_lisa["status"] == "error": return res_lisa
    if res_decorados["status"] == "error": return res_decorados
    if res_defectuosos["status"] == "error": return res_defectuosos

    # 2. Agrupamos los datos por fecha
    agrupado = defaultdict(lambda: {
        "produceLisa": 0,
        "envasesDecorados": 0,
        "envasesDefectuosos": 0
    })

    # Procesamos Producción Lisa (Con el mapeo de tu nuevo modelo del ORM)
    for fila in res_lisa["data"]:
        fecha_str = str(fila["fecha_registro"])
        agrupado[fecha_str]["produceLisa"] += fila["cantidad_registrada"]
        agrupado[fecha_str]["date"] = fecha_str 

    # Procesamos Envases Decorados (Se queda igual que antes)
    for fila in res_decorados["data"]:
        fecha_str = str(fila["fecha_decorada"])
        agrupado[fecha_str]["envasesDecorados"] += fila["cantidad_decorada"]
        agrupado[fecha_str]["date"] = fecha_str

    # Procesamos Envases Defectuosos (Se queda igual que antes)
    for fila in res_defectuosos["data"]:
        fecha_str = str(fila["fecha_produccion"])
        agrupado[fecha_str]["envasesDefectuosos"] += fila["cantidad_defectuosa"]
        agrupado[fecha_str]["date"] = fecha_str

    # 3. Convertimos el diccionario agrupado en una lista ordenada
    resultado_final = list(agrupado.values())
    resultado_final.sort(key=lambda x: x["date"])

    return {
        "status": "success",
        "data": resultado_final
    }