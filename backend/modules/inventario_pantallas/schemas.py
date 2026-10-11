# backend/modules/inventario/inventario_pantallas/schemas.py

from pydantic import BaseModel, Field


# ─── PANTALLA ─────────────────────────────────────────────────────────────────

class PantallaCrear(BaseModel):
    nombre:      str  = Field(alias="nombre")
    descripcion: str  = Field(alias="descripcion")
    tipo:        str  = Field(alias="tipo")
    estado:      bool = Field(alias="estado")

    class Config:
        allow_population_by_field_name = True


class PantallaEditar(BaseModel):
    nombre:      str  = Field(alias="nombre")
    descripcion: str  = Field(alias="descripcion")
    tipo:        str  = Field(alias="tipo")
    estado:      bool = Field(alias="estado")

    class Config:
        allow_population_by_field_name = True


class PantallaResponde(BaseModel):
    id_pantalla: int  = Field(alias="idPantalla")
    nombre:      str  = Field(alias="nombre")
    descripcion: str  = Field(alias="descripcion")
    tipo:        str  = Field(alias="tipo")
    estado:      bool = Field(alias="estado")

    class Config:
        orm_mode                       = True
        allow_population_by_field_name = True


class PantallaListaResponde(BaseModel):
    id_pantalla:     int = Field(alias="idPantalla")
    nombre:          str = Field(alias="nombre")
    descripcion:     str = Field(alias="descripcion")
    tipo:            str = Field(alias="tipo")
    cantidad_actual: int = Field(alias="cantidad")

    class Config:
        orm_mode                       = True
        allow_population_by_field_name = True


# ─── MOVIMIENTOS ──────────────────────────────────────────────────────────────

class MovimientoEntradaCrear(BaseModel):
    id_pantalla: int = Field(alias="idPantalla")
    encargado:   str = Field(alias="encargado")
    turno:       str = Field(alias="turno")
    grupo:       str = Field(alias="grupo")
    cantidad:    int = Field(alias="cantidad")

    class Config:
        allow_population_by_field_name = True


class MovimientoSalidaCrear(BaseModel):
    id_pantalla: int = Field(alias="idPantalla")
    encargado:   str = Field(alias="encargado")
    turno:       str = Field(alias="turno")
    grupo:       str = Field(alias="grupo")
    cantidad:    int = Field(alias="cantidad")

    class Config:
        allow_population_by_field_name = True


# ─── HISTORIAL ────────────────────────────────────────────────────────────────

class HistorialEntradaResponde(BaseModel):
    id_inventario_entrada: int = Field(alias="idInventarioEntrada")
    nombre:                str = Field(alias="nombre")
    descripcion:           str = Field(alias="descripcion")
    tipo:                  str = Field(alias="tipo")
    fecha:                 str = Field(alias="fecha")
    encargado:             str = Field(alias="encargado")
    turno:                 str = Field(alias="turno")
    grupo:                 str = Field(alias="grupo")
    cantidad:              int = Field(alias="cantidad")

    class Config:
        orm_mode                       = True
        allow_population_by_field_name = True


class HistorialSalidaResponde(BaseModel):
    id_inventario_salida: int = Field(alias="idInventarioSalida")
    nombre:               str = Field(alias="nombre")
    descripcion:          str = Field(alias="descripcion")
    tipo:                 str = Field(alias="tipo")
    fecha:                str = Field(alias="fecha")
    encargado:            str = Field(alias="encargado")
    turno:                str = Field(alias="turno")
    grupo:                str = Field(alias="grupo")
    cantidad:             int = Field(alias="cantidad")

    class Config:
        orm_mode                       = True
        allow_population_by_field_name = True