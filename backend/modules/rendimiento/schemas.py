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


class RendimientoMoldeResponde(BaseModel):
    item: str = Field(alias="item")
    nombre: str = Field(alias="nombre")
    descripcion: Optional[str] = Field(default=None, alias="descripcion")
    entradas_gruesas: float = Field(alias="entradasGruesas")
    gruesas_lisas: float = Field(alias="gruesasLisas")
    gruesas_decoradas: float = Field(alias="gruesasDecoradas")
    gruesas_defectuosas: float = Field(alias="gruesasDefectuosas")
    eficiencia: float = Field(alias="eficiencia")
    deficiencia: float = Field(alias="deficiencia")

    class Config:
        allow_population_by_field_name = True