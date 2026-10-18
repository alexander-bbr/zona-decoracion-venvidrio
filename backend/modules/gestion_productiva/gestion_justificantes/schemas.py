# backend/modules/gestion_productiva/gestion_justificantes/schemas.py

from pydantic import BaseModel, Field
from typing import Optional


class JustificanteCrear(BaseModel):
    etiqueta: str = Field(alias="etiqueta")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")
    estado: bool = Field(default=True, alias="estado")

    class Config:
        allow_population_by_field_name = True


class JustificanteResponde(BaseModel):
    id_justificante: int = Field(alias="idJustificante")
    etiqueta: str = Field(alias="etiqueta")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")
    estado: bool = Field(alias="estado")
    
    class Config:
        orm_mode                       = True
        allow_population_by_field_name = True