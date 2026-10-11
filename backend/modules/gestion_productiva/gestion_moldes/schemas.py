# backend/modules/gestion_productiva/moldes/schemas.py

from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal


class MoldeCrear(BaseModel):
    nombre: str = Field(alias="nombre")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")
    numero_camadas: int = Field(alias="numeroCamadas")
    numero_envases: int = Field(alias="numeroEnvases")
    numero_gruesas: Decimal = Field(alias="numeroGruesas")

    class Config:
        allow_population_by_field_name = True


class MoldeResponde(BaseModel):
    id_molde: int = Field(alias="idMolde")
    nombre: str = Field(alias="nombre")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")
    numero_camadas: int = Field(alias="numeroCamadas")
    numero_envases: int = Field(alias="numeroEnvases")
    numero_gruesas: Decimal = Field(alias="numeroGruesas")

    class Config:
        orm_mode                       = True
        allow_population_by_field_name = True