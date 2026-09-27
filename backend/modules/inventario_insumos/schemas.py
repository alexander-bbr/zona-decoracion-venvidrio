# backend/modules/inventario/inventario_insumos/schemas.py

from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal


# ─── INSUMO ───────────────────────────────────────────────────────────────────

class InsumoCrear(BaseModel):
    tipo:            str            = Field(alias="tipo")
    articulo:        str            = Field(alias="articulo")
    unidad:          str            = Field(alias="unidad")
    cantidad_minima: Decimal        = Field(alias="cantidadMinima")
    estado:          bool           = Field(alias="estado")

    class Config:
        populate_by_name = True


class InsumoEditar(BaseModel):
    tipo:            str            = Field(alias="tipo")
    articulo:        str            = Field(alias="articulo")
    unidad:          str            = Field(alias="unidad")
    cantidad_minima: Decimal        = Field(alias="cantidadMinima")
    estado:          bool           = Field(alias="estado")

    class Config:
        populate_by_name = True


class InsumoResponde(BaseModel):
    id_insumo:       int            = Field(alias="idInsumo")
    tipo:            str            = Field(alias="tipo")
    articulo:        str            = Field(alias="articulo")
    unidad:          str            = Field(alias="unidad")
    cantidad_minima: Decimal        = Field(alias="cantidadMinima")
    estado:          bool           = Field(alias="estado")

    class Config:
        from_attributes  = True
        populate_by_name = True


class InsumoListaResponde(BaseModel):
    id_insumo:       int            = Field(alias="idInsumo")
    tipo:            str            = Field(alias="tipo")
    articulo:        str            = Field(alias="articulo")
    unidad:          str            = Field(alias="unidad")
    cantidad_actual: Decimal        = Field(alias="cantidadActual")
    cantidad_minima: Decimal        = Field(alias="cantidadMinima")

    class Config:
        from_attributes  = True
        populate_by_name = True


# ─── MOVIMIENTOS ──────────────────────────────────────────────────────────────

class MovimientoEntradaCrear(BaseModel):
    id_insumo: int     = Field(alias="idInsumo")
    encargado: str     = Field(alias="encargado")
    turno:     str     = Field(alias="turno")
    grupo:     str     = Field(alias="grupo")
    cantidad:  Decimal = Field(alias="cantidad")

    class Config:
        populate_by_name = True


class MovimientoSalidaCrear(BaseModel):
    id_insumo: int     = Field(alias="idInsumo")
    encargado: str     = Field(alias="encargado")
    turno:     str     = Field(alias="turno")
    grupo:     str     = Field(alias="grupo")
    cantidad:  Decimal = Field(alias="cantidad")

    class Config:
        populate_by_name = True


# ─── Historial ──────────────────────────────────────────────────────────────


class HistorialEntradaResponde(BaseModel):
    id_inventario_entrada: int     = Field(alias="idInventarioEntrada")
    tipo_insumo: str     = Field(alias="tipoInsumo")
    articulo:    str     = Field(alias="articulo")
    fecha:                 str     = Field(alias="fecha")
    encargado:             str     = Field(alias="encargado")
    turno:                 str     = Field(alias="turno")
    grupo:                 str     = Field(alias="grupo")
    cantidad:              Decimal = Field(alias="cantidad")

    class Config:
        from_attributes  = True
        populate_by_name = True


class HistorialSalidaResponde(BaseModel):
    id_inventario_salida: int     = Field(alias="idInventarioSalida")
    tipo_insumo:          str     = Field(alias="tipoInsumo")
    articulo:             str     = Field(alias="articulo")
    fecha:                str     = Field(alias="fecha")
    encargado:            str     = Field(alias="encargado")
    turno:                str     = Field(alias="turno")
    grupo:                str     = Field(alias="grupo")
    cantidad:             Decimal  = Field(alias="cantidad")

    class Config:
        from_attributes  = True
        populate_by_name = True