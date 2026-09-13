# backend/modules/inventario/inventario_insumos/models.py

from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.conexion import Base


# TABLA: INVENTARIO_INSUMOS
class Insumo(Base):
    __tablename__ = "inventario_insumos"

    id_insumo       = Column(Integer, primary_key=True, autoincrement=True)
    tipo            = Column(String(50), nullable=False)
    articulo        = Column(String(150), nullable=False)
    unidad          = Column(String(20), nullable=False)
    cantidad_actual = Column(Numeric(10, 2), nullable=False, default=0.00)
    cantidad_minima = Column(Numeric(10, 2), nullable=False, default=0.00)
    estado          = Column(Boolean, nullable=False, default=True)

    entradas = relationship("InsumoEntrada", back_populates="insumo")
    salidas  = relationship("InsumoSalida",  back_populates="insumo")


# TABLA: INVENTARIO_INSUMOS_ENTRADA
class InsumoEntrada(Base):
    __tablename__ = "inventario_insumos_entrada"

    id_inventario_entrada = Column(Integer, primary_key=True, autoincrement=True)
    id_insumo             = Column(Integer, ForeignKey("inventario_insumos.id_insumo"), nullable=False)
    fecha                 = Column(DateTime, nullable=False)
    encargado             = Column(String(100), nullable=False)
    turno                 = Column(String(20), nullable=False)
    grupo                 = Column(String(20), nullable=False)
    cantidad              = Column(Numeric(10, 2), nullable=False)

    insumo = relationship("Insumo", back_populates="entradas")


# TABLA: INVENTARIO_INSUMOS_SALIDA
class InsumoSalida(Base):
    __tablename__ = "inventario_insumos_salida"

    id_inventario_salida = Column(Integer, primary_key=True, autoincrement=True)
    id_insumo            = Column(Integer, ForeignKey("inventario_insumos.id_insumo"), nullable=False)
    fecha                = Column(DateTime, nullable=False)
    encargado            = Column(String(100), nullable=False)
    turno                = Column(String(20), nullable=False)
    grupo                = Column(String(20), nullable=False)
    cantidad             = Column(Numeric(10, 2), nullable=False)

    insumo = relationship("Insumo", back_populates="salidas")