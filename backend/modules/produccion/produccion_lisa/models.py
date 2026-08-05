from sqlalchemy import Column, Integer, String, Date, ForeignKey, SmallInteger
from sqlalchemy.orm import relationship

from backend.database.conexion import Base


class InventarioProduccionLisa(Base):
    __tablename__ = "produccion_lisa_inventario"

    id_inventariopl = Column(Integer, primary_key=True, autoincrement=True)
    modelo          = Column(String(100), nullable=False)
    cantidad_actual = Column(Integer, nullable=False, default=0)
    estado          = Column(SmallInteger, default=1)

    registros = relationship("RegistroProduccionLisa", back_populates="inventario")
    salidas   = relationship("SalidaProduccionLisa", back_populates="inventario")


class RegistroProduccionLisa(Base):
    __tablename__ = "produccion_lisa_registro"

    id_registro         = Column(Integer, primary_key=True, autoincrement=True)
    fecha_registro      = Column(Date, nullable=False)
    id_inventariopl     = Column(Integer, ForeignKey("produccion_lisa_inventario.id_inventariopl"), nullable=False)
    cantidad_registrada = Column(Integer, nullable=False)

    inventario = relationship("InventarioProduccionLisa", back_populates="registros")


class SalidaProduccionLisa(Base):
    __tablename__ = "produccion_lisa_salida"

    id_salida       = Column(Integer, primary_key=True, autoincrement=True)
    fecha_salida    = Column(Date, nullable=False)
    id_inventariopl = Column(Integer, ForeignKey("produccion_lisa_inventario.id_inventariopl"), nullable=False)
    cantidad_sacada = Column(Integer, nullable=False)

    inventario = relationship("InventarioProduccionLisa", back_populates="salidas")