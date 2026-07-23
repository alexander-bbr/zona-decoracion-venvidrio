# backend/modules/pintura/schemas.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from decimal import Decimal

# ESQUEMAS PARA INVENTARIO DE PINTURA
class InventarioBase(BaseModel):
    color: str = Field(alias="color")
    cantidad_actual: Decimal = Field(default=0.00, alias="cantidadActual")
    cantidad_minima_alerta: Decimal = Field(default=5.00, alias="cantidadMinimaAlerta")

    class Config:
        populate_by_name = True

class InventarioCrear(InventarioBase):
    pass

class InventarioResponde(InventarioBase):
    id: int
    class Config:
        from_attributes = True


# ESQUEMAS PARA REGISTRO (entrada)
class RegistroCrear(BaseModel):
    id_pintura_inventario: int = Field(alias="idPinturaInventario")
    proveedor: str = Field(alias="proveedor")
    fecha_registro: date = Field(alias="fechaRegistro")
    unidad_medida: str = Field(alias="unidadDeMedida")
    cantidad_registrada: Decimal = Field(alias="cantidadRegistrada")
    registrado_por: str = Field(alias="registradoPor")
    observaciones: Optional[str] = Field(default=None, alias="observaciones")

    class Config:
        populate_by_name = True

class RegistroResponde(BaseModel):
    id: int
    id_pintura_inventario: int
    proveedor: str
    fecha_registro: date
    cantidad_registrada: Decimal
    registrado_por: str
    observaciones: Optional[str] = None
    inventario: Optional[InventarioResponde] = None

    class Config:
        from_attributes = True


# ESQUEMAS PARA CONSUMO (salida)
class ConsumoCrear(BaseModel):
    id_pintura_inventario: int = Field(alias="idPinturaInventario")
    proveedor: str = Field(alias="proveedor")
    fecha_inicio_consumo: date = Field(alias="fechaInicio")
    numero_lote: str = Field(alias="numeroDeLote")
    unidad_medida: str = Field(alias="unidadDeMedida")
    cantidad_consumida: Decimal = Field(alias="cantidadConsumida")
    fecha_finalizacion_consumo: date = Field(alias="fechaDeFinalizacion")
    revisado_por: str = Field(alias="revisadoPor")
    observaciones: Optional[str] = Field(default=None, alias="observaciones")

    class Config:
        populate_by_name = True

class ConsumoResponde(BaseModel):
    id: int
    id_pintura_inventario: int
    proveedor: str
    fecha_inicio_consumo: date
    numero_lote: str
    cantidad_consumida: Decimal
    fecha_finalizacion_consumo: date
    revisado_por: str
    observaciones: Optional[str] = None
    inventario: Optional[InventarioResponde] = None

    class Config:
        from_attributes = True