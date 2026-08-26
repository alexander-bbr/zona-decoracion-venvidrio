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
        populate_by_name = True
        from_attributes = True

# ESQUEMAS PARA EFICIENCIA PRODUCTIVA SALIDA (Detalle de modelos)
class SalidaBase(BaseModel):
    modelo_molde: int = Field(alias="modeloMolde")
    total_paletas: Decimal = Field(default=Decimal("0.00"), alias="totalPaletas")
    
    cant_paletas_lisas: Decimal = Field(default=Decimal("0.00"), alias="cantPaletasLisas")
    cant_camadas_lisas: Decimal = Field(default=Decimal("0.00"), alias="cantCamadasLisas")
    cant_envases_lisas: Decimal = Field(default=Decimal("0.00"), alias="cantEnvasesLisas")
    cant_gruesas_lisas: Decimal = Field(default=Decimal("0.00"), alias="cantGruesasLisas")
    
    cant_paletas_decoradas: Decimal = Field(default=Decimal("0.00"), alias="cantPaletasDecoradas")
    cant_camadas_decoradas: Decimal = Field(default=Decimal("0.00"), alias="cantCamadasDecoradas")
    cant_envases_decoradas: Decimal = Field(default=Decimal("0.00"), alias="cantEnvasesDecoradas")
    cant_gruesas_decoradas: Decimal = Field(default=Decimal("0.00"), alias="cantGruesasDecoradas")

    class Config:
        populate_by_name = True

class SalidaCrear(SalidaBase):
    pass

class SalidaResponde(SalidaBase):
    id_eficiencia: int = Field(alias="idEficiencia")
    id_produccion: int = Field(alias="idProduccion")

    class Config:
        from_attributes = True


# ESQUEMAS PARA GESTION PRODUCTIVA RESULTADO (Consolidado)
class ResultadoBase(BaseModel):
    total_gruesas_lisas: Decimal = Field(default=Decimal("0.00"), alias="totalGruesasLisas")
    total_gruesas_decoradas: Decimal = Field(default=Decimal("0.00"), alias="totalGruesasDecoradas")
    eficiencia_productiva: Decimal = Field(default=Decimal("0.00"), alias="eficienciaProductiva")
    deficiencia_productiva: Decimal = Field(default=Decimal("0.00"), alias="deficienciaProductiva")
    observaciones: Optional[str] = Field(default=None, alias="observaciones")  

    class Config:
        populate_by_name = True

class ResultadoCrear(ResultadoBase):
    pass

class ResultadoResponde(ResultadoBase):
    id_produccion: int = Field(alias="idProduccion")

    class Config:
        from_attributes = True


# ESQUEMAS PARA GESTION PRODUCTIVA ENTRADA (Cabecera, Creación y Edición)
class ProduccionCrear(BaseModel):
    fecha: date = Field(alias="fecha")
    turno: str = Field(alias="turno")
    tecnico: str = Field(alias="tecnico")
    
    cant_envases_d1: Decimal = Field(default=Decimal("0.00"), alias="cantEnvasesD1")
    cant_envases_d2: Decimal = Field(default=Decimal("0.00"), alias="cantEnvasesD2")
    cant_envases_d3: Decimal = Field(default=Decimal("0.00"), alias="cantEnvasesD3")
    cant_envases_d4: Decimal = Field(default=Decimal("0.00"), alias="cantEnvasesD4")
    
    total_envases: Decimal = Field(default=Decimal("0.00"), alias="totalEnvases")
    total_gruesas: Decimal = Field(default=Decimal("0.00"), alias="totalGruesas")
    
    salidas: List[SalidaCrear] = Field(default=[], alias="salidas")
    resultado: ResultadoCrear = Field(alias="resultado")

    class Config:
        populate_by_name = True


# ESQUEMA DE RESPUESTA COMPLETA (Para VER y EDITAR un registro)
class ProduccionResponde(BaseModel):
    id_produccion: int = Field(alias="idProduccion")
    fecha: date = Field(alias="fecha")
    turno: str = Field(alias="turno")
    tecnico: str = Field(alias="tecnico")
    
    cant_envases_d1: Decimal = Field(default=Decimal("0.00"), alias="cantEnvasesD1")
    cant_envases_d2: Decimal = Field(default=Decimal("0.00"), alias="cantEnvasesD2")
    cant_envases_d3: Decimal = Field(default=Decimal("0.00"), alias="cantEnvasesD3")
    cant_envases_d4: Decimal = Field(default=Decimal("0.00"), alias="cantEnvasesD4")
    
    total_envases: Decimal = Field(default=Decimal("0.00"), alias="totalEnvases")
    total_gruesas: Decimal = Field(default=Decimal("0.00"), alias="totalGruesas")
    
    salidas: List[SalidaResponde] = Field(default=[], alias="salidas")
    resultado: Optional[ResultadoResponde] = Field(default=None, alias="resultado")

    class Config:
        from_attributes = True
        populate_by_name = True


# ESQUEMA PARA LA VISTA PRINCIPAL (Listado paginado de 50 en 50)
class ProduccionListaResponde(BaseModel):
    id_produccion: int = Field(alias="idProduccion")
    fecha: date = Field(alias="fecha")
    turno: str = Field(alias="turno")
    tecnico: str = Field(alias="tecnico")
    total_gruesas: Decimal = Field(alias="totalGruesas")
    total_gruesas_lisas: Optional[Decimal] = Field(default=Decimal("0.00"), alias="totalGruesasLisas")
    total_gruesas_decoradas: Optional[Decimal] = Field(default=Decimal("0.00"), alias="totalGruesasDecoradas")
    eficiencia_productiva: Optional[Decimal] = Field(default=Decimal("0.00"), alias="eficienciaProductiva")
    deficiencia_productiva: Optional[Decimal] = Field(default=Decimal("0.00"), alias="deficienciaProductiva")

    class Config:
        from_attributes = True
        populate_by_name = True


class ProduccionListaPaginadaResponde(BaseModel):
    data: List[ProduccionListaResponde]
    total: int