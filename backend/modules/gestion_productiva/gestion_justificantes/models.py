# backend/modules/gestion_productiva/gestion_justificantes/models.py

from sqlalchemy import Column, Integer, String, Boolean
from backend.database.conexion import Base


# TABLA: JUSTIFICANTES

class Justificante(Base):
    __tablename__ = "justificantes"

    id_justificante = Column(Integer, primary_key=True, autoincrement=True)
    etiqueta = Column(String(150), nullable=False)
    descripcion = Column(String(255), nullable=True)
    estado = Column(Boolean, nullable=False, default=True)