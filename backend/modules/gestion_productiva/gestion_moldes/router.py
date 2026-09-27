# backend/modules/gestion_productiva/gestion_moldes/router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database.conexion import get_db
from backend.modules.gestion_usuarios.dependencies import require_permiso
from . import services, schemas

router = APIRouter(
    prefix="/api/gestion-moldes",
    tags=["Gestión Productiva - Moldes"]
)


# 1. LISTAR MOLDES
@router.get("/", response_model=List[schemas.MoldeResponde])
def listar_moldes(
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_productiva", "gestion_moldes"))
):
    return services.obtener_lista_moldes(db)


# 2. REGISTRAR MOLDE
@router.post("/", status_code=status.HTTP_201_CREATED)
def registrar_molde(
    datos: schemas.MoldeCrear,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_productiva", "gestion_moldes"))
):
    molde = services.registrar_molde(db, datos)
    return {"status": "Registro insertado con éxito", "id": molde.id_molde}


# 3. OBTENER MOLDE POR ID (Para editar)
@router.get("/{id_molde}", response_model=schemas.MoldeResponde)
def obtener_molde(
    id_molde: int,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_productiva", "gestion_moldes"))
):
    molde = services.obtener_molde_por_id(db, id_molde)
    if not molde:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El molde especificado no existe."
        )
    return molde


# 4. EDITAR MOLDE
@router.put("/{id_molde}")
def editar_molde(
    id_molde: int,
    datos: schemas.MoldeCrear,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_productiva", "gestion_moldes"))
):
    molde_actualizado = services.editar_molde(db, id_molde, datos)
    if not molde_actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se pudo actualizar porque el molde no fue encontrado."
        )
    return {"status": "Registro actualizado con éxito", "id": molde_actualizado.id_molde}