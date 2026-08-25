# backend/modules/gestion_productiva/gestion_moldes/router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database.conexion import get_db
from . import services, schemas

router = APIRouter(
    prefix="/moldes",
    tags=["Gestión Productiva - Moldes"]
)


# 1. LISTAR MOLDES
@router.get("/", response_model=List[schemas.MoldeResponde])
def listar_moldes(db: Session = Depends(get_db)):
    return services.obtener_lista_moldes(db)


# 2. REGISTRAR MOLDE
@router.post("/", response_model=schemas.MoldeResponde, status_code=status.HTTP_201_CREATED)
def registrar_molde(datos: schemas.MoldeCrear, db: Session = Depends(get_db)):
    return services.registrar_molde(db, datos)


# 3. OBTENER MOLDE POR ID (Para editar)
@router.get("/{id_molde}", response_model=schemas.MoldeResponde)
def obtener_molde(id_molde: int, db: Session = Depends(get_db)):
    molde = services.obtener_molde_por_id(db, id_molde)
    if not molde:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El molde especificado no existe."
        )
    return molde


# 4. EDITAR MOLDE
@router.put("/{id_molde}", response_model=schemas.MoldeResponde)
def editar_molde(id_molde: int, datos: schemas.MoldeCrear, db: Session = Depends(get_db)):
    molde_actualizado = services.editar_molde(db, id_molde, datos)
    if not molde_actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se pudo actualizar porque el molde no fue encontrado."
        )
    return molde_actualizado