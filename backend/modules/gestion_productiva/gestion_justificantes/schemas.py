# backend/modules/gestion_productiva/gestion_justificantes/schemas.py

from pydantic import BaseModel, Field
from typing import Optional


class JustificanteCrear(BaseModel):
    etiqueta: str = Field(alias="etiqueta")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")

    class Config:
        populate_by_name = True


class JustificanteResponde(BaseModel):
    id_justificante: int = Field(alias="idJustificante")
    etiqueta: str = Field(alias="etiqueta")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")

    class Config:
        from_attributes = True
        populate_by_name = True