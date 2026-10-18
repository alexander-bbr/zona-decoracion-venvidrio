# backend/modules/gestion_productiva/gestion_justificantes/services.py

from sqlalchemy.orm import Session
from .models import Justificante


def obtener_lista_justificantes(db: Session):
    justificantes = db.query(Justificante).order_by(
        Justificante.estado.desc(), 
        Justificante.etiqueta.asc(), 
        Justificante.descripcion.asc()
    ).all()

    resultado = []
    for justificante in justificantes:
        resultado.append({
            "id_justificante": justificante.id_justificante,
            "etiqueta": justificante.etiqueta,
            "descripcion": justificante.descripcion,
            "estado": justificante.estado

        })

    return resultado


def obtener_justificante_por_id(db: Session, id_justificante: int):
    return db.query(Justificante).filter(Justificante.id_justificante == id_justificante).first()


def registrar_justificante(db: Session, datos):
    nuevo_justificante = Justificante(
        etiqueta=datos.etiqueta,
        descripcion=datos.descripcion,
        estado=datos.estado
    )
    db.add(nuevo_justificante)
    db.commit()
    db.refresh(nuevo_justificante)
    return nuevo_justificante


def editar_justificante(db: Session, id_justificante: int, datos):
    justificante_actual = db.query(Justificante).filter(Justificante.id_justificante == id_justificante).first()

    if not justificante_actual:
        return None

    justificante_actual.etiqueta = datos.etiqueta
    justificante_actual.descripcion = datos.descripcion
    justificante_actual.estado = datos.estado

    db.commit()
    db.refresh(justificante_actual)
    return justificante_actual