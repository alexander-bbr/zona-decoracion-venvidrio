# backend/modules/inventario/inventario_insumos/router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from backend.database.conexion import get_db
from . import services, schemas

router = APIRouter(
    prefix="/api/inventario-insumos",
    tags=["Inventario - Insumos"]
)

# NOTA: La ruta /historial debe mantenerse siempre antes de /{id_insumo}.
# FastAPI resuelve las rutas de arriba hacia abajo, si /{id_insumo} estuviera
# primero, intentaría interpretar "historial" como un entero y fallaría.




# 1. REGISTRAR ENTRADA DE INSUMO
# Inserta el movimiento en inventario_insumos_entrada y suma al stock actual
@router.post("/entradas", status_code=status.HTTP_201_CREATED)
def registrar_entrada(datos: schemas.MovimientoEntradaCrear, db: Session = Depends(get_db)):
    entrada = services.registrar_entrada(db, datos)
    if not entrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Error en el registro"
        )
    return {"status": "Registro insertado con éxito", "id": entrada.id_inventario_entrada}


# 2. REGISTRAR SALIDA DE INSUMO
# Inserta el movimiento en inventario_insumos_salida y resta del stock actual
@router.post("/salidas", status_code=status.HTTP_201_CREATED)
def registrar_salida(datos: schemas.MovimientoSalidaCrear, db: Session = Depends(get_db)):
    salida = services.registrar_salida(db, datos)
    if not salida:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Error en la salida del insumo"
        )
    return {"status": "Salida registrada con éxito", "id": salida.id_inventario_salida}


# 3. LISTAR INVENTARIO
# Devuelve todos los insumos con estado activo (estado = true)
@router.get("/", response_model=List[schemas.InsumoListaResponde])
def listar_insumos(db: Session = Depends(get_db)):
    insumos = services.obtener_lista_insumos(db)
    if insumos is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo listar el inventario"
        )
    return insumos


# 4. HISTORIAL DE MOVIMIENTOS
# Mezcla entradas y salidas ordenadas por fecha, con paginación por query params
@router.get("/historial", response_model=List[Union[schemas.HistorialEntradaResponde, schemas.HistorialSalidaResponde]])
def obtener_historial(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    historial = services.obtener_historial(db, skip, limit)
    if historial is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo listar el historial de inventario"
        )
    return historial


# 5. CREAR INSUMO
# Registra un insumo nuevo en el catálogo
@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_insumo(datos: schemas.InsumoCrear, db: Session = Depends(get_db)):
    insumo = services.crear_insumo(db, datos)
    if not insumo:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear un insumo"
        )
    return {"status": "Insumo creado con éxito", "id": insumo.id_insumo}


# 6. VER INSUMO POR ID
# Se usa principalmente para cargar los datos antes de editar
@router.get("/{id_insumo}", response_model=schemas.InsumoResponde)
def obtener_insumo(id_insumo: int, db: Session = Depends(get_db)):
    insumo = services.obtener_insumo_por_id(db, id_insumo)
    if not insumo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Insumo no encontrado"
        )
    return insumo


# 7. EDITAR INSUMO
# Actualiza todos los campos del insumo excepto el ID
@router.put("/{id_insumo}")
def editar_insumo(id_insumo: int, datos: schemas.InsumoEditar, db: Session = Depends(get_db)):
    insumo = services.editar_insumo(db, id_insumo, datos)
    if not insumo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Error al editar el insumo"
        )
    return {"status": "Insumo editado con éxito", "id": insumo.id_insumo}