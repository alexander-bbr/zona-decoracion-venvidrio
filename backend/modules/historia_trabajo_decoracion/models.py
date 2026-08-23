# models.py
from sqlalchemy import Column, Integer, String, Date, Text, SmallInteger, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.database.conexion import Base


class FHistoriaTrabajoDecoracionCabecera(Base):
    __tablename__ = "f_historia_trabajo_decoracion_cabecera"

    id_htd_cabecera       = Column(Integer, primary_key=True, autoincrement=True)
    fecha_elaboracion     = Column(Date, nullable=False)
    molde                 = Column(String(50), nullable=False)
    no_plano              = Column(String(50), default=None)
    identificador_maquina = Column(String(20), nullable=False)
    tipo_decorado         = Column(String(100), default=None)
    no_archa              = Column(String(50), default=None)
    cant_ranuras          = Column(Integer, default=None)
    no_tazas              = Column(Integer, default=None)
    velocidad_bpm         = Column(Integer, default=None)
    tiempo_malla_seg      = Column(Integer, default=None)
    problemas             = Column(Text, default=None)
    observaciones         = Column(Text, default=None)
    revisado_por          = Column(String(100), default=None)
    fecha_registro        = Column(TIMESTAMP, server_default=func.current_timestamp())

    colores      = relationship("FHistoriaTrabajoDecoracionColores", back_populates="cabecera")
    estaciones   = relationship("FHistoriaTrabajoDecoracionEstaciones", back_populates="cabecera")
    temperatura  = relationship("FHistoriaTrabajoDecoracionTemperatura", back_populates="cabecera")


class FHistoriaTrabajoDecoracionColores(Base):
    __tablename__ = "f_historia_trabajo_decoracion_colores"

    id_htd_color    = Column(Integer, primary_key=True, autoincrement=True)
    id_htd_cabecera = Column(Integer, ForeignKey("f_historia_trabajo_decoracion_cabecera.id_htd_cabecera"), nullable=False)
    numero_color    = Column(Integer, nullable=False)
    consumo_pintura = Column(String(50), default=None)
    codigo_pintura  = Column(String(50), default=None)

    cabecera = relationship("FHistoriaTrabajoDecoracionCabecera", back_populates="colores")


class FHistoriaTrabajoDecoracionEstaciones(Base):
    __tablename__ = "f_historia_trabajo_decoracion_estaciones"

    id_htd_estacion         = Column(Integer, primary_key=True, autoincrement=True)
    id_htd_cabecera         = Column(Integer, ForeignKey("f_historia_trabajo_decoracion_cabecera.id_htd_cabecera"), nullable=False)
    numero_estacion         = Column(Integer, nullable=False)
    cuerpo_presion_squeegees = Column(String(50), default=None)
    cuerpo_nro_marco        = Column(String(50), default=None)
    cuerpo_tipo_malla       = Column(String(50), default=None)
    cuello_presion_squeegees = Column(String(50), default=None)
    cuello_nro_marco        = Column(String(50), default=None)
    cuello_tipo_malla       = Column(String(50), default=None)

    cabecera = relationship("FHistoriaTrabajoDecoracionCabecera", back_populates="estaciones")


class FHistoriaTrabajoDecoracionTemperatura(Base):
    __tablename__ = "f_historia_trabajo_decoracion_temperatura"

    id_htd_temperatura = Column(Integer, primary_key=True, autoincrement=True)
    id_htd_cabecera    = Column(Integer, ForeignKey("f_historia_trabajo_decoracion_cabecera.id_htd_cabecera"), nullable=False)
    numero_zona        = Column(Integer, nullable=False)
    set_point          = Column(String(50), default=None)
    lado_izq           = Column(String(50), default=None)
    lado_der           = Column(String(50), default=None)

    cabecera = relationship("FHistoriaTrabajoDecoracionCabecera", back_populates="temperatura")