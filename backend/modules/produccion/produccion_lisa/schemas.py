from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date


#INVENTARIO
class InventarioResponde(BaseModel):
    id_inventariopl: int
    modelo:          str
    cantidad_actual: int

    class Config:
        from_attributes = True


#REGISTRO
class RegistroCrear(BaseModel):
    fecha_registro:      date
    id_inventariopl:     Optional[int] = None
    cantidad_registrada: int
    nuevo_modelo:        Optional[str] = None

    @field_validator("id_inventariopl", mode="before")
    @classmethod
    def vacio_a_none(cls, v):
        if v == "" or v == 0:
            return None
        return v

    @field_validator("cantidad_registrada")
    @classmethod
    def cantidad_positiva(cls, v):
        if v <= 0:
            raise ValueError("La cantidad debe ser mayor a 0")
        return v
class RegistroResponde(BaseModel):
    id_registro:         int
    fecha_registro:      date
    id_inventariopl:     int
    cantidad_registrada: int

    class Config:
        from_attributes = True


#SALIDA
class SalidaCrear(BaseModel):
    fecha_salida:    date
    id_inventariopl: int
    cantidad_sacada: int

    @field_validator("cantidad_sacada")
    @classmethod
    def cantidad_positiva(cls, v):
        if v <= 0:
            raise ValueError("La cantidad debe ser mayor a 0")
        return v

class SalidaResponde(BaseModel):
    id_salida:       int
    fecha_salida:    date
    id_inventariopl: int
    cantidad_sacada: int

    class Config:
        from_attributes = True


#HISTORIAL
class HistorialRegistroItem(BaseModel):
    tipo:                str = "registro"
    fecha:               date
    modelo:              str
    cantidad_registrada: int

    class Config:
        from_attributes = True

class HistorialSalidaItem(BaseModel):
    tipo:            str = "salida"
    fecha:           date
    modelo:          str
    cantidad_sacada: int

    class Config:
        from_attributes = True