# backend/modules/gestion_productiva/produccion/models.py

from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship

from backend.database.conexion import Base
from backend.modules.gestion_productiva.gestion_moldes.models import Molde


# TABLA: GESTION_PRODUCTIVA_ENTRADA (Cabecera)

class GestionProductivaEntrada(Base):
    __tablename__ = "gestion_productiva_entrada"

    id_produccion = Column(Integer, primary_key=True, autoincrement=True)
    fecha = Column(Date, nullable=False)
    turno = Column(String(10), nullable=False)
    tecnico = Column(String(150), nullable=False)
    
    cant_envases_d1 = Column(Numeric(10, 2), default=0.00)
    cant_envases_d2 = Column(Numeric(10, 2), default=0.00)
    cant_envases_d3 = Column(Numeric(10, 2), default=0.00)
    cant_envases_d4 = Column(Numeric(10, 2), default=0.00)
    
    total_envases = Column(Numeric(12, 2), default=0.00)
    total_gruesas = Column(Numeric(12, 2), default=0.00)

    # Relaciones
    # Una entrada tiene muchas salidas (1 a N)
    salidas = relationship("GestionProductivaSalida", back_populates="entrada", cascade="all, delete-orphan")
    # Una entrada tiene un solo consolidado de resultado (1 a 1)
    resultado = relationship("GestionProductivaResultado", back_populates="entrada", uselist=False, cascade="all, delete-orphan")



# TABLA: GESTION_PRODUCTIVA_SALIDA (Detalle)

class GestionProductivaSalida(Base):
    __tablename__ = "gestion_productiva_salida"

    id_eficiencia = Column(Integer, primary_key=True, autoincrement=True)
    # Hace referencia a la tabla "moldes" que ahora vive en su propio módulo
    modelo_molde = Column(Integer, ForeignKey("moldes.id_molde"), nullable=False)
    id_produccion = Column(Integer, ForeignKey("gestion_productiva_entrada.id_produccion", ondelete="CASCADE"), nullable=False)
    
    total_paletas = Column(Numeric(10, 2), default=0.00)
    
    cant_paletas_lisas = Column(Numeric(10, 2), default=0.00)
    cant_camadas_lisas = Column(Numeric(10, 2), default=0.00)
    cant_envases_lisas = Column(Numeric(10, 2), default=0.00)
    cant_gruesas_lisas = Column(Numeric(10, 2), default=0.00)
    
    cant_paletas_decoradas = Column(Numeric(10, 2), default=0.00)
    cant_camadas_decoradas = Column(Numeric(10, 2), default=0.00)
    cant_envases_decoradas = Column(Numeric(10, 2), default=0.00)
    cant_gruesas_decoradas = Column(Numeric(10, 2), default=0.00)

    # Relaciones
    entrada = relationship("GestionProductivaEntrada", back_populates="salidas")
    # SQLAlchemy enlazará este string "Molde" con la clase que creaste en el archivo del otro módulo
    molde = relationship("Molde", back_populates="salidas")



# TABLA: GESTION_PRODUCTIVA_RESULTADO (Consolidado)

class GestionProductivaResultado(Base):
    __tablename__ = "gestion_productiva_resultado"

    # La PK es al mismo tiempo la FK hacia la entrada (Relación 1 a 1)
    id_produccion = Column(Integer, ForeignKey("gestion_productiva_entrada.id_produccion", ondelete="CASCADE"), primary_key=True)
    
    total_gruesas_lisas = Column(Numeric(12, 2), default=0.00)
    total_gruesas_decoradas = Column(Numeric(12, 2), default=0.00)
    
    eficiencia_productiva = Column(Numeric(5, 2), default=0.00)
    deficiencia_productiva = Column(Numeric(5, 2), default=0.00)
    observaciones = Column(String(255), nullable=True)

    # Relación
    entrada = relationship("GestionProductivaEntrada", back_populates="resultado")