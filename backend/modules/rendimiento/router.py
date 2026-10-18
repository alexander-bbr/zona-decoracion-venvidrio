# backend/modules/rendimiento/router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from backend.database.conexion import get_db
from . import services, schemas


router = APIRouter(
    prefix="/api/rendimiento",
    tags=["Rendimiento"]
)


# 1. LISOS POR FECHA
@router.get("/lisos")
def obtener_lisos(
    desde: date,
    hasta: date,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver_rendimiento"))
):
    """
    Retorna el total de envases y gruesas lisas agrupados por fecha.
    """
    return services.obtener_lisos_por_fecha(db, desde, hasta)


# 2. DECORADOS POR FECHA
@router.get("/decorados")
def obtener_decorados(
    desde: date,
    hasta: date,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver_rendimiento"))
):
    """
    Retorna el total de envases y gruesas decoradas agrupados por fecha.
    """
    return services.obtener_decorados_por_fecha(db, desde, hasta)


# 3. PERDIDOS POR FECHA
@router.get("/perdidos")
def obtener_perdidos(
    desde: date,
    hasta: date,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver_rendimiento"))
):
    """
    Retorna el total de envases y gruesas perdidas agrupados por fecha.
    """
    return services.obtener_perdidos_por_fecha(db, desde, hasta)


# 4. PANTALLAS FABRICADAS Y CONSUMIDAS POR FECHA
@router.get("/pantallas")
def obtener_pantallas(
    desde: date,
    hasta: date,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver"))
):
    """
    Retorna el total de pantallas fabricadas (entradas) y consumidas (salidas) agrupados por fecha.
    """
    return services.obtener_pantallas_por_fecha(db, desde, hasta)


# 5. EFICIENCIA Y DEFICIENCIA POR FECHA
@router.get("/eficiencia-deficiencia")
def obtener_eficiencia_deficiencia(
    desde: date,
    hasta: date,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver"))
):
    return services.obtener_eficiencia_deficiencia_por_fecha(db, desde, hasta)

# 6. LISTAR METAS
@router.get("/metas", response_model=List[schemas.MetaResponde])
def listar_metas(
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver"))
):
    try:
        return services.obtener_lista_metas(db)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se puedieron listar las metas"
        )


# 7. AGREGAR META
@router.post("/metas", status_code=status.HTTP_201_CREATED)
def registrar_meta(
    datos: schemas.MetaCrear,
    db: Session = Depends(get_db),
):
    meta = services.registrar_meta(db, datos)
    return {"status": "Meta registrada con éxito", "id": meta.id_meta}


#8. OBTENER RENDIMIENTO DE MOLDES
@router.get("/moldes", response_model=List[schemas.RendimientoMoldeResponde])
def obtener_rendimiento_moldes(
    desde: date,
    hasta: date,
    db: Session = Depends(get_db),
):
    return services.obtener_rendimiento_moldes(db, desde, hasta)


# 9. VER META POR ID (para editar)
@router.get("/{id_meta}", response_model=schemas.MetaResponde)
def obtener_meta(
    id_meta: int,
    db: Session = Depends(get_db),
    # _=Depends(require_permiso("rendimiento", "ver"))
):
    meta = services.obtener_meta_por_id(db, id_meta)
    if not meta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La meta especificada no existe."
        )
    return meta


# 10. EDITAR META
@router.put("/{id_meta}")
def editar_meta(
    id_meta: int,
    datos: schemas.MetaCrear,
    db: Session = Depends(get_db),
):
    meta_actualizada = services.editar_meta(db, id_meta, datos)
    if not meta_actualizada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se pudo actualizar porque la meta no fue encontrada."
        )
    return {"status": "Meta actualizada con éxito", "id": meta_actualizada.id_meta}
