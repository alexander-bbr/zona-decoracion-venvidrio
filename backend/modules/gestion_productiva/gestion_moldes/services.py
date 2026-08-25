# backend/modules/gestion_productiva/moldes/services.py

from sqlalchemy.orm import Session
from .models import Molde


def obtener_lista_moldes(db: Session):
    moldes = db.query(Molde).order_by(Molde.id_molde.desc()).all()

    resultado = []
    for molde in moldes:
        resultado.append({
            "id_molde": molde.id_molde,
            "nombre": molde.nombre,
            "descripcion": molde.descripcion,
            "numero_camadas": molde.numero_camadas,
            "numero_envases": molde.numero_envases,
            "numero_gruesas": molde.numero_gruesas
        })

    return resultado


def obtener_molde_por_id(db: Session, id_molde: int):
    return db.query(Molde).filter(Molde.id_molde == id_molde).first()


def registrar_molde(db: Session, datos):
    nuevo_molde = Molde(
        nombre=datos.nombre,
        descripcion=datos.descripcion,
        numero_camadas=datos.numero_camadas,
        numero_envases=datos.numero_envases,
        numero_gruesas=datos.numero_gruesas
    )
    db.add(nuevo_molde)
    db.commit()
    db.refresh(nuevo_molde)
    return nuevo_molde


def editar_molde(db: Session, id_molde: int, datos):
    molde_actual = db.query(Molde).filter(Molde.id_molde == id_molde).first()

    if not molde_actual:
        return None

    molde_actual.nombre = datos.nombre
    molde_actual.descripcion = datos.descripcion
    molde_actual.numero_camadas = datos.numero_camadas
    molde_actual.numero_envases = datos.numero_envases
    molde_actual.numero_gruesas = datos.numero_gruesas

    db.commit()
    db.refresh(molde_actual)
    return molde_actual