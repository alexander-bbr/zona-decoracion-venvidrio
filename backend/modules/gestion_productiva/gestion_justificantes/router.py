# backend/modules/gestion_productiva/gestion_justificantes/router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database.conexion import get_db
from backend.modules.gestion_usuarios.dependencies import require_permiso
from . import services, schemas

router = APIRouter(
    prefix="/api/gestion-justificantes",
    tags=["Gestión Productiva - Justificantes"]
)


# 1. LISTAR JUSTIFICANTES
@router.get("/", response_model=List[schemas.JustificanteResponde])
def listar_justificantes(
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("gestion_productiva", "gestion_justificantes"))
):
    return services.obtener_lista_justificantes(db)


# 2. REGISTRAR JUSTIFICANTE
@router.post("/", status_code=status.HTTP_201_CREATED)
def registrar_justificante(
    datos: schemas.JustificanteCrear,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("gestion_productiva", "gestion_justificantes"))
):
    justificante = services.registrar_justificante(db, datos)
    return {"status": "Registro insertado con éxito", "id": justificante.id_justificante}


# 3. OBTENER JUSTIFICANTE POR ID (Para editar)
@router.get("/{id_justificante}", response_model=schemas.JustificanteResponde)
def obtener_justificante(
    id_justificante: int,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("gestion_productiva", "gestion_justificantes"))
):
    justificante = services.obtener_justificante_por_id(db, id_justificante)
    if not justificante:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El Justificante especificado no existe."
        )
    return justificante


# 4. EDITAR JUSTIFICANTE
@router.put("/{id_justificante}")
def editar_justificante(
    id_justificante: int,
    datos: schemas.JustificanteCrear,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("gestion_productiva", "gestion_justificantes"))
):
    justificante_actualizado = services.editar_justificante(db, id_justificante, datos)
    if not justificante_actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se pudo actualizar porque el Justificante no fue encontrado."
        )
    return {"status": "Registro actualizado con éxito", "id": justificante_actualizado.id_justificante}