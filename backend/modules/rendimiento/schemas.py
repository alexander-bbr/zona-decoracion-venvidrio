# backend/modules/rendimiento/schemas.py  (parte de metas)

from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal


class MetaCrear(BaseModel):
    anio: int = Field(..., alias="anio")
    mes: str = Field(..., alias="mes")
    deficiencia: Decimal = Field(..., alias="deficiencia")
    estado: bool = Field(default=False, alias="estado")

    class Config:
        allow_population_by_field_name = True


class MetaResponde(BaseModel):
    id_meta: int = Field(..., alias="idMeta")
    anio: int = Field(..., alias="anio")
    mes: str = Field(..., alias="mes")
    deficiencia: Decimal = Field(..., alias="deficiencia")
    estado: bool = Field(..., alias="estado")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True