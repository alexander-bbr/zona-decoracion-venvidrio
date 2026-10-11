# backend/modules/gestion_productiva/produccion/schemas.py

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from decimal import Decimal


# ESQUEMA PARA MOLDES (Vista completa para el select)
class MoldeResponde(BaseModel):
    id_molde: int = Field(alias="idMolde")
    nombre: str = Field(alias="nombre")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")
    numero_camadas: int = Field(alias="numeroCamadas")
    numero_envases: int = Field(alias="numeroEnvases")
    numero_gruesas: Decimal = Field(alias="numeroGruesas")

    class Config:
        allow_population_by_field_name = True
        from_attributes = True


# ESQUEMA PARA JUSTIFICANTES (Vista para el select)
class JustificanteResponde(BaseModel):
    id_justificante: int = Field(alias="idJustificante")
    etiqueta: str = Field(alias="etiqueta")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")

    class Config:
        allow_population_by_field_name = True
        from_attributes = True


# ESQUEMAS PARA GESTION_PRODUCTIVA_ENTRADA (Detalle por máquina y molde)
class EntradaDetalleBase(BaseModel):
    id_molde: int = Field(alias="idMolde")
    cant_envases: int = Field(alias="cantEnvases")
    hora_entrada: Optional[str] = Field(default=None, alias="horaEntrada")  # NUEVO

    class Config:
        allow_population_by_field_name = True

class EntradaDetalleCrear(EntradaDetalleBase):
    pass

class EntradaDetalleResponde(EntradaDetalleBase):

    class Config:
        from_attributes = True


# ESQUEMAS PARA EFICIENCIA PRODUCTIVA SALIDA (Detalle de modelos)
class SalidaBase(BaseModel):
    modelo_molde: int = Field(alias="modeloMolde")
    total_paletas_molde: int = Field(default=0, alias="totalPaletasMolde")  # RENOMBRADO

    cant_paletas_lisas: int = Field(default=0, alias="cantPaletasLisas")
    cant_camadas_lisas: int = Field(default=0, alias="cantCamadasLisas")
    cant_envases_lisas: int = Field(default=0, alias="cantEnvasesLisas")
    cant_gruesas_lisas: Decimal = Field(default=Decimal("0.00"), alias="cantGruesasLisas")

    cant_paletas_decoradas: int = Field(default=0, alias="cantPaletasDecoradas")
    cant_camadas_decoradas: int = Field(default=0, alias="cantCamadasDecoradas")
    cant_envases_decoradas: int = Field(default=0, alias="cantEnvasesDecoradas")
    cant_gruesas_decoradas: Decimal = Field(default=Decimal("0.00"), alias="cantGruesasDecoradas")

    class Config:
        allow_population_by_field_name = True

class SalidaCrear(SalidaBase):
    pass

class SalidaResponde(SalidaBase):
    id_eficiencia: int = Field(alias="idEficiencia")

    class Config:
        from_attributes = True


# ESQUEMA PARA JUSTIFICANTES POR MOLDE
class JustificantePorMoldeCrear(BaseModel):
    modelo_molde: int = Field(alias="modeloMolde")              # NUEVO
    justificaciones: List[int] = Field(alias="justificaciones") # NUEVO

    class Config:
        allow_population_by_field_name = True

class JustificantePorMoldeResponde(BaseModel):
    modelo_molde: int = Field(alias="modeloMolde")              # NUEVO
    justificaciones: List[int] = Field(alias="justificaciones") # NUEVO

    class Config:
        allow_population_by_field_name = True


# ESQUEMAS PARA GESTION_PRODUCTIVA_RESULTADO (Consolidado)
class ResultadoBase(BaseModel):
    total_envases_lisos: int = Field(default=0, alias="totalEnvasesLisos")                          # NUEVO
    total_gruesas_lisas: Decimal = Field(default=Decimal("0.00"), alias="totalGruesasLisas")
    total_envases_decorados: int = Field(default=0, alias="totalEnvasesDecorados")                  # NUEVO
    total_gruesas_decoradas: Decimal = Field(default=Decimal("0.00"), alias="totalGruesasDecoradas")
    total_envases_perdidos: int = Field(default=0, alias="totalEnvasesPerdidos")                    # NUEVO
    total_gruesas_perdidas: Decimal = Field(default=Decimal("0.00"), alias="totalGruesasPerdidas")  # NUEVO
    eficiencia_productiva: Decimal = Field(default=Decimal("0.00"), alias="eficienciaProductiva")
    deficiencia_productiva: Decimal = Field(default=Decimal("0.00"), alias="deficienciaProductiva")
    observaciones: Optional[str] = Field(default=None, alias="observaciones")

    class Config:
        allow_population_by_field_name = True

class ResultadoCrear(ResultadoBase):
    pass

class ResultadoResponde(ResultadoBase):

    class Config:
        from_attributes = True


# ESQUEMAS PARA GESTION_PRODUCTIVA_CABECERA (Creación)
class ProduccionCrear(BaseModel):
    fecha: date = Field(alias="fecha")
    tipo_turno: Optional[str] = Field(default=None, alias="tipoTurno")
    turno: int = Field(alias="turno")
    grupo: Optional[str] = Field(default=None, alias="grupo")  # NUEVO
    tecnico: str = Field(alias="tecnico")

    maquina1: List[EntradaDetalleCrear] = Field(default=[], alias="maquina1")
    maquina2: List[EntradaDetalleCrear] = Field(default=[], alias="maquina2")
    maquina3: List[EntradaDetalleCrear] = Field(default=[], alias="maquina3")
    maquina4: List[EntradaDetalleCrear] = Field(default=[], alias="maquina4")

    cant_envases_d1: int = Field(default=0, alias="cantEnvasesD1")
    cant_envases_d2: int = Field(default=0, alias="cantEnvasesD2")
    cant_envases_d3: int = Field(default=0, alias="cantEnvasesD3")
    cant_envases_d4: int = Field(default=0, alias="cantEnvasesD4")
    total_envases: int = Field(default=0, alias="totalEnvases")
    total_gruesas: Decimal = Field(default=Decimal("0.00"), alias="totalGruesas")

    salidas: List[SalidaCrear] = Field(default=[], alias="salidas")
    resultado: ResultadoCrear = Field(alias="resultado")
    justificantes: List[JustificantePorMoldeCrear] = Field(default=[], alias="justificantes")  # CAMBIADO

    class Config:
        allow_population_by_field_name = True


# ESQUEMA DE RESPUESTA COMPLETA (Para VER y EDITAR un registro)
class ProduccionResponde(BaseModel):
    id_cabecera: int = Field(alias="idCabecera")
    fecha: date = Field(alias="fecha")
    tipo_turno: Optional[str] = Field(default=None, alias="tipoTurno") 
    turno: int = Field(alias="turno")                      
    grupo: Optional[str] = Field(default=None, alias="grupo")
    tecnico: str = Field(alias="tecnico")

    maquina1: List[EntradaDetalleResponde] = Field(default=[], alias="maquina1")
    maquina2: List[EntradaDetalleResponde] = Field(default=[], alias="maquina2")
    maquina3: List[EntradaDetalleResponde] = Field(default=[], alias="maquina3")
    maquina4: List[EntradaDetalleResponde] = Field(default=[], alias="maquina4")

    cant_envases_d1: int = Field(default=0, alias="cantEnvasesD1")
    cant_envases_d2: int = Field(default=0, alias="cantEnvasesD2")
    cant_envases_d3: int = Field(default=0, alias="cantEnvasesD3")
    cant_envases_d4: int = Field(default=0, alias="cantEnvasesD4")
    total_envases: int = Field(default=0, alias="totalEnvases")
    total_gruesas: Decimal = Field(default=Decimal("0.00"), alias="totalGruesas")

    salidas: List[SalidaResponde] = Field(default=[], alias="salidas")
    resultado: Optional[ResultadoResponde] = Field(default=None, alias="resultado")
    justificantes: List[JustificantePorMoldeResponde] = Field(default=[], alias="justificantes")  # CAMBIADO

    class Config:
        orm_mode                       = True
        allow_population_by_field_name = True


# ESQUEMA PARA LA VISTA PRINCIPAL (Listado paginado de 50 en 50)
class ProduccionListaResponde(BaseModel):
    id_cabecera: int = Field(alias="idCabecera")
    fecha: date = Field(alias="fecha")
    tipo_turno: Optional[str] = Field(default=None, alias="tipoTurno") 
    turno: int = Field(alias="turno")
    grupo: Optional[str] = Field(default=None, alias="grupo")
    tecnico: str = Field(alias="tecnico")
    total_gruesas: Decimal = Field(alias="totalGruesas")
    total_gruesas_lisas: Optional[Decimal] = Field(default=Decimal("0.00"), alias="totalGruesasLisas")
    total_gruesas_decoradas: Optional[Decimal] = Field(default=Decimal("0.00"), alias="totalGruesasDecoradas")
    eficiencia_productiva: Optional[Decimal] = Field(default=Decimal("0.00"), alias="eficienciaProductiva")
    deficiencia_productiva: Optional[Decimal] = Field(default=Decimal("0.00"), alias="deficienciaProductiva")

    class Config:
        orm_mode                       = True
        allow_population_by_field_name = True


class ProduccionActualizadaResponde(BaseModel):
    status: str
    id: int

    class Config:
        from_attributes = True