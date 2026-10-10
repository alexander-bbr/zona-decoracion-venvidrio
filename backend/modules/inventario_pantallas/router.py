# backend/modules/inventario/inventario_pantallas/router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from backend.database.conexion import get_db
from . import services, schemas

router = APIRouter(
    prefix="/api/inventario-pantallas",
    tags=["Inventario - Pantallas"]
)

# NOTA: La ruta /historial debe mantenerse siempre antes de /{id_pantalla}.
# FastAPI resuelve las rutas de arriba hacia abajo, si /{id_pantalla} estuviera
# primero, intentaría interpretar "historial" como un entero y fallaría.


# 1. REGISTRAR ENTRADA DE PANTALLA
# Inserta el movimiento en inventario_pantallas_entrada y suma al stock actual
@router.post("/entradas", status_code=status.HTTP_201_CREATED)
def registrar_entrada(datos: schemas.MovimientoEntradaCrear, db: Session = Depends(get_db)):
    entrada = services.registrar_entrada(db, datos)
    if not entrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Error en el registro"
        )
    return {"status": "Registro insertado con éxito", "id": entrada.id_inventario_entrada}


# 2. REGISTRAR SALIDA DE PANTALLA
# Inserta el movimiento en inventario_pantallas_salida y resta del stock actual
@router.post("/salidas", status_code=status.HTTP_201_CREATED)
def registrar_salida(datos: schemas.MovimientoSalidaCrear, db: Session = Depends(get_db)):
    salida = services.registrar_salida(db, datos)
    if not salida:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Error en la salida"
        )
    return {"status": "Salida registrada con éxito", "id": salida.id_inventario_salida}


# 3. LISTAR INVENTARIO
# Devuelve todas las pantallas con estado activo (estado = true)
@router.get("/", response_model=List[schemas.PantallaListaResponde])
def listar_pantallas(db: Session = Depends(get_db)):
    pantallas = services.obtener_lista_pantallas(db)
    if pantallas is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo listar el inventario"
        )
    return pantallas


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


# 5. CREAR PANTALLA
# Registra una pantalla nueva en el catálogo
@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_pantalla(datos: schemas.PantallaCrear, db: Session = Depends(get_db)):
    pantalla = services.crear_pantalla(db, datos)
    if not pantalla:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear la pantalla"
        )
    return {"status": "Pantalla creada con éxito", "id": pantalla.id_pantalla}


# 6. VER PANTALLA POR ID
# Se usa principalmente para cargar los datos antes de editar
@router.get("/{id_pantalla}", response_model=schemas.PantallaResponde)
def obtener_pantalla(id_pantalla: int, db: Session = Depends(get_db)):
    pantalla = services.obtener_pantalla_por_id(db, id_pantalla)
    if not pantalla:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pantalla no encontrada"
        )
    return pantalla


# 7. EDITAR PANTALLA
# Actualiza todos los campos de la pantalla excepto el ID
@router.put("/{id_pantalla}")
def editar_pantalla(id_pantalla: int, datos: schemas.PantallaEditar, db: Session = Depends(get_db)):
    pantalla = services.editar_pantalla(db, id_pantalla, datos)
    if not pantalla:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Error al editar la pantalla"
        )
    return {"status": "Pantalla editada con éxito", "id": pantalla.id_pantalla}