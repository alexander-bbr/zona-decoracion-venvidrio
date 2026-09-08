# backend/modules/gestion_productiva/produccion/models.py

from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from backend.database.conexion import Base
from backend.modules.gestion_productiva.gestion_moldes.models import Molde
from backend.modules.gestion_productiva.gestion_justificantes.models import Justificante


# TABLA: GESTION_PRODUCTIVA_CABECERA (Cabecera)

class GestionProductivaCabecera(Base):
    __tablename__ = "gestion_productiva_cabecera"

    id_cabecera = Column(Integer, primary_key=True, autoincrement=True)
    fecha = Column(Date, nullable=False)
    turno = Column(Integer, nullable=False)
    grupo = Column(String(10), nullable=True)        # NUEVO
    tecnico = Column(String(150), nullable=False)

    cant_envases_d1 = Column(Integer, default=0)
    cant_envases_d2 = Column(Integer, default=0)
    cant_envases_d3 = Column(Integer, default=0)
    cant_envases_d4 = Column(Integer, default=0)

    total_envases = Column(Integer, default=0)
    total_gruesas = Column(Numeric(12, 2), default=0.00)

    # Relaciones
    entradas = relationship("GestionProductivaEntrada", back_populates="cabecera", cascade="all, delete-orphan")
    salidas = relationship("GestionProductivaSalida", back_populates="cabecera", cascade="all, delete-orphan")
    resultado = relationship("GestionProductivaResultado", back_populates="cabecera", uselist=False, cascade="all, delete-orphan")
    produccion_justificantes = relationship("ProduccionJustificante", back_populates="cabecera", cascade="all, delete-orphan")


# TABLA: GESTION_PRODUCTIVA_ENTRADA (Detalle por máquina y molde)

class GestionProductivaEntrada(Base):
    __tablename__ = "gestion_productiva_entrada"

    id_entrada = Column(Integer, primary_key=True, autoincrement=True)
    id_cabecera = Column(Integer, ForeignKey("gestion_productiva_cabecera.id_cabecera", ondelete="CASCADE"), nullable=False)
    maquina = Column(Integer, nullable=False)        # 1, 2, 3 o 4
    id_molde = Column(Integer, ForeignKey("moldes.id_molde"), nullable=False)
    cant_envases = Column(Integer, nullable=False)
    hora_entrada = Column(String(10), nullable=True) # NUEVO

    # Relaciones
    cabecera = relationship("GestionProductivaCabecera", back_populates="entradas")
    molde = relationship("Molde")


# TABLA: GESTION_PRODUCTIVA_SALIDA (Detalle de salida por molde)

class GestionProductivaSalida(Base):
    __tablename__ = "gestion_productiva_salida"

    id_eficiencia = Column(Integer, primary_key=True, autoincrement=True)
    modelo_molde = Column(Integer, ForeignKey("moldes.id_molde"), nullable=False)
    id_cabecera = Column(Integer, ForeignKey("gestion_productiva_cabecera.id_cabecera", ondelete="CASCADE"), nullable=False)

    total_paletas_molde = Column(Integer, default=0) # RENOMBRADO (antes: total_paletas)

    cant_paletas_lisas = Column(Integer, default=0)
    cant_camadas_lisas = Column(Integer, default=0)
    cant_envases_lisas = Column(Integer, default=0)
    cant_gruesas_lisas = Column(Numeric(10, 2), default=0.00)

    cant_paletas_decoradas = Column(Integer, default=0)
    cant_camadas_decoradas = Column(Integer, default=0)
    cant_envases_decoradas = Column(Integer, default=0)
    cant_gruesas_decoradas = Column(Numeric(10, 2), default=0.00)

    # Relaciones
    cabecera = relationship("GestionProductivaCabecera", back_populates="salidas")
    molde = relationship("Molde", back_populates="salidas")


# TABLA: GESTION_PRODUCTIVA_RESULTADO (Consolidado)

class GestionProductivaResultado(Base):
    __tablename__ = "gestion_productiva_resultado"

    id_cabecera = Column(Integer, ForeignKey("gestion_productiva_cabecera.id_cabecera", ondelete="CASCADE"), primary_key=True)

    total_gruesas_lisas = Column(Numeric(12, 2), default=0.00)
    total_gruesas_decoradas = Column(Numeric(12, 2), default=0.00)

    eficiencia_productiva = Column(Numeric(5, 2), default=0.00)
    deficiencia_productiva = Column(Numeric(5, 2), default=0.00)
    observaciones = Column(String(255), nullable=True)

    # Relación
    cabecera = relationship("GestionProductivaCabecera", back_populates="resultado")


# TABLA INTERMEDIA: PRODUCCION_JUSTIFICANTES

class ProduccionJustificante(Base):
    __tablename__ = "produccion_justificantes"

    id_cabecera = Column(Integer, ForeignKey("gestion_productiva_cabecera.id_cabecera", ondelete="CASCADE"), primary_key=True)
    modelo_molde = Column(Integer, ForeignKey("moldes.id_molde"), primary_key=True)
    id_justificante = Column(Integer, ForeignKey("justificantes.id_justificante", ondelete="CASCADE"), primary_key=True)

    # Relaciones
    cabecera = relationship("GestionProductivaCabecera", back_populates="produccion_justificantes")