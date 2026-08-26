# backend/modules/gestion_productiva/produccion/router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database.conexion import get_db
from . import services, schemas

router = APIRouter(
    prefix="/produccion",
    tags=["Gestión Productiva"]
)


# 1. LISTAR MOLDES (Para llenar el select en el frontend)
@router.get("/moldes", response_model=List[schemas.MoldeResponde])
def listar_moldes_para_select(db: Session = Depends(get_db)):
    """
    Obtiene el catálogo resumido de moldes (ID, nombre y descripción).
    """
    return services.obtener_lista_moldes(db)


# 2. LISTAR REGISTROS DE PRODUCCIÓN (Vista principal con paginación de 50 en 50)
@router.get("/", response_model=schemas.ProduccionListaPaginadaResponde)
def listar_produccion(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """
    Retorna la lista de movimientos recientes de producción paginados.
    """
    return services.obtener_registros_produccion(db, skip=skip, limit=limit)


# 3. CREAR NUEVO REGISTRO DE PRODUCCIÓN
@router.post("/", response_model=schemas.ProduccionResponde, status_code=status.HTTP_201_CREATED)
def crear_produccion(datos: schemas.ProduccionCrear, db: Session = Depends(get_db)):
    """
    Recibe la cabecera, la lista de modelos de salida y el resultado consolidado
    para guardarlos en una sola transacción.
    """
    return services.crear_registro_produccion(db, datos)


# 4. OBTENER UN REGISTRO POR ID (Para los módulos de VER y EDITAR)
@router.get("/{id_produccion}", response_model=schemas.ProduccionResponde)
def obtener_produccion(id_produccion: int, db: Session = Depends(get_db)):
    """
    Busca un turno específico por su ID y devuelve toda su estructura anidada 
    para rellenar el formulario.
    """
    registro = services.obtener_produccion_por_id(db, id_produccion)
    if not registro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El registro de producción especificado no existe."
        )
    return registro


# 5. ACTUALIZAR REGISTRO DE PRODUCCIÓN
@router.put("/{id_produccion}", response_model=schemas.ProduccionResponde)
def actualizar_produccion(
    id_produccion: int, 
    datos: schemas.ProduccionCrear, 
    db: Session = Depends(get_db)
):
    """
    Actualiza la cabecera, los resultados y sincroniza la lista de modelos de salida.
    """
    registro_actualizado = services.actualizar_registro_produccion(db, id_produccion, datos)
    if not registro_actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se pudo actualizar porque el registro no fue encontrado."
        )
    return registro_actualizado