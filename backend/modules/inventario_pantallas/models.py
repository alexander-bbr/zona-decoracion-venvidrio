# backend/modules/inventario/inventario_pantallas/models.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.conexion import Base


# TABLA: INVENTARIO_PANTALLAS
class Pantalla(Base):
    __tablename__ = "inventario_pantallas"

    id_pantalla     = Column(Integer, primary_key=True, autoincrement=True)
    nombre          = Column(String(150), nullable=False)
    descripcion     = Column(String(255), nullable=False)
    tipo            = Column(String(50),  nullable=False)
    cantidad_actual = Column(Integer,     nullable=False, default=0)
    estado          = Column(Boolean,     nullable=False, default=True)

    entradas = relationship("PantallaEntrada", back_populates="pantalla")
    salidas  = relationship("PantallaSalida",  back_populates="pantalla")


# TABLA: INVENTARIO_PANTALLAS_ENTRADA
class PantallaEntrada(Base):
    __tablename__ = "inventario_pantallas_entrada"

    id_inventario_entrada = Column(Integer, primary_key=True, autoincrement=True)
    id_pantalla           = Column(Integer, ForeignKey("inventario_pantallas.id_pantalla"), nullable=False)
    fecha                 = Column(DateTime, nullable=False)
    encargado             = Column(String(100), nullable=False)
    turno                 = Column(String(20),  nullable=False)
    grupo                 = Column(String(20),  nullable=False)
    cantidad              = Column(Integer,     nullable=False)

    pantalla = relationship("Pantalla", back_populates="entradas")


# TABLA: INVENTARIO_PANTALLAS_SALIDA
class PantallaSalida(Base):
    __tablename__ = "inventario_pantallas_salida"

    id_inventario_salida = Column(Integer, primary_key=True, autoincrement=True)
    id_pantalla          = Column(Integer, ForeignKey("inventario_pantallas.id_pantalla"), nullable=False)
    fecha                = Column(DateTime, nullable=False)
    encargado            = Column(String(100), nullable=False)
    turno                = Column(String(20),  nullable=False)
    grupo                = Column(String(20),  nullable=False)
    cantidad             = Column(Integer,     nullable=False)

    pantalla = relationship("Pantalla", back_populates="salidas")