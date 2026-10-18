# backend/modules/gestion_productiva/moldes/schemas.py

from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal


class MoldeCrear(BaseModel):
    item: str = Field(alias="item")
    nombre: str = Field(alias="nombre")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")
    numero_camadas: int = Field(alias="numeroCamadas")
    numero_envases: int = Field(alias="numeroEnvases")
    numero_gruesas: Decimal = Field(alias="numeroGruesas")
    estado: bool = Field(default=True, alias="estado")

    class Config:
        allow_population_by_field_name = True


class MoldeResponde(BaseModel):
    item: str = Field(alias="item")
    nombre: str = Field(alias="nombre")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")
    numero_camadas: int = Field(alias="numeroCamadas")
    numero_envases: int = Field(alias="numeroEnvases")
    numero_gruesas: Decimal = Field(alias="numeroGruesas")
    estado: bool = Field(alias="estado")

    class Config:
        orm_mode                       = True
        allow_population_by_field_name = True