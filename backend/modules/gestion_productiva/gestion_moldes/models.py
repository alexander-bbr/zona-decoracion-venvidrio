# backend/modules/gestion_productiva/moldes/models.py

from sqlalchemy import Column, Integer, String, Numeric, Boolean
from sqlalchemy.orm import relationship

from backend.database.conexion import Base


# TABLA: MOLDES

class Molde(Base):
    __tablename__ = "moldes"

    item = Column(String(20), primary_key=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(String(255), nullable=True)
    numero_camadas = Column(Integer, nullable=False)
    numero_envases = Column(Integer, nullable=False)
    numero_gruesas = Column(Numeric(10, 2), nullable=False)
    estado = Column(Boolean, nullable=False, default=True)

    # Relación con las salidas en el módulo de gestión productiva (1 a N)
    # Al usar un string, SQLAlchemy buscará la clase en el registro de Base
    salidas = relationship("GestionProductivaSalida", back_populates="molde")