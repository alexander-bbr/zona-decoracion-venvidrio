from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


# ESQUEMAS PARA REGISTRO DE PRODUCCIÓN LISA (Lotes)
class RegistroProduccionLisaBase(BaseModel):
    nro_lote: str = Field(alias="nroLote")
    fecha_registro: date = Field(alias="fechaRegistro")
    modelo: str = Field(alias="modelo")
    cantidad_registrada: int = Field(alias="cantidadRegistrada")
    stock_disponible: int = Field(alias="stockDisponible")

    class Config:
        populate_by_name = True

class RegistroProduccionLisaCrear(RegistroProduccionLisaBase):
    pass

class RegistroProduccionLisaResponde(RegistroProduccionLisaBase):
    id: int

    class Config:
        from_attributes = True


# ESQUEMAS PARA SALIDA DE PRODUCCIÓN LISA
class SalidaProduccionLisaBase(BaseModel):
    nro_lote: str = Field(alias="nroLote")
    fecha_salida: date = Field(alias="fechaSalida")
    cantidad_sacada: int = Field(alias="cantidadSacada")

    class Config:
        populate_by_name = True

class SalidaProduccionLisaCrear(SalidaProduccionLisaBase):
    pass

class SalidaProduccionLisaResponde(SalidaProduccionLisaBase):
    id: int
    # Opcionalmente podemos incluir los datos del registro al que pertenece la salida
    registro: Optional[RegistroProduccionLisaResponde] = None

    class Config:
        from_attributes = True

'''
# ESQUEMAS ESPECÍFICOS PARA PETICIONES HTTP

# Esquema para el "Historial de Salida" requerido por el Front-End
class HistorialSalidaFrontendResponde(BaseModel):
    nro_lote: str = Field(alias="nroLote")
    fecha_salida: date = Field(alias="fechaSalida")
    cantidad_sacada: int = Field(alias="cantidadSacada")
    # Nota: Omitimos explícitamente el 'id' aquí para cumplir con los requerimientos del frontend
    
    class Config:
        from_attributes = True
        populate_by_name = True
'''