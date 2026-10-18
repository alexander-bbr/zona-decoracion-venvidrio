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
    # Validación de duplicado
    existe = services.obtener_molde_por_item(db, datos.item)
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un molde con ese item."
        )

    molde = services.registrar_molde(db, datos)
    return {"status": "Registro insertado con éxito", "item": molde.item}


# 3. OBTENER MOLDE POR ITEM (Para editar)
@router.get("/{item}", response_model=schemas.MoldeResponde)
def obtener_molde(
    item: str,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_productiva", "gestion_moldes"))
):
    molde = services.obtener_molde_por_item(db, item)
    if not molde:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El molde especificado no existe."
        )
    return molde


# 4. EDITAR MOLDE
@router.put("/{item}")
def editar_molde(
    item: str,
    datos: schemas.MoldeCrear,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("gestion_productiva", "gestion_moldes"))
):
    # Validación de duplicado (solo si el usuario está cambiando el item)
    if datos.item != item:
        existe = services.obtener_molde_por_item(db, datos.item)
        if existe:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un molde con ese item."
            )

    molde_actualizado = services.editar_molde(db, item, datos)
    if not molde_actualizado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se pudo actualizar porque el molde no fue encontrado."
        )
    return {"status": "Registro actualizado con éxito", "item": molde_actualizado.item}