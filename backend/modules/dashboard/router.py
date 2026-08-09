# backend/modules/dashboard/router.py
from backend.modules.gestion_usuarios.dependencies import require_permiso
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session

# Importamos get_db desde tu archivo de conexión
from backend.database.conexion import get_db 
from .services import obtener_datos_dashboard

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

@router.get("/datos")
def consultar_datos_dashboard(
    fromDate: str = Query(..., description="Fecha de inicio en formato YYYY-MM-DD"),
    toDate: str = Query(..., description="Fecha de fin en formato YYYY-MM-DD"),
    db: Session = Depends(get_db), # <--- Inyectamos la sesión para el ORM de producción lisa
    #_=Depends(require_permiso("dashboard", "ver"))

):
    """
    Endpoint único para el dashboard.
    Devuelve los datos de producción lisa (ORM), decorados y defectuosos (Tablas viejas) 
    ya agrupados y listos para los gráficos de React.
    """
    # Pasamos la 'db' como primer parámetro
    resultado = obtener_datos_dashboard(db, fromDate, toDate)
    
    if resultado.get("status") == "error":
        raise HTTPException(status_code=500, detail=resultado.get("message"))
        
    return resultado