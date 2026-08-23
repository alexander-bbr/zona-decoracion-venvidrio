# schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import date


#COLORES
class ColorCrear(BaseModel):
    numero_color:    int
    consumo_pintura: Optional[str] = None
    codigo_pintura:  Optional[str] = None

class ColorResponde(BaseModel):
    id_htd_color:    int
    numero_color:    int
    consumo_pintura: Optional[str] = None
    codigo_pintura:  Optional[str] = None

    class Config:
        from_attributes = True


#ESTACIONES
class EstacionCrear(BaseModel):
    numero_estacion:          int
    cuerpo_presion_squeegees: Optional[str] = None
    cuerpo_nro_marco:         Optional[str] = None
    cuerpo_tipo_malla:        Optional[str] = None
    cuello_presion_squeegees: Optional[str] = None
    cuello_nro_marco:         Optional[str] = None
    cuello_tipo_malla:        Optional[str] = None

class EstacionResponde(BaseModel):
    id_htd_estacion:          int
    numero_estacion:          int
    cuerpo_presion_squeegees: Optional[str] = None
    cuerpo_nro_marco:         Optional[str] = None
    cuerpo_tipo_malla:        Optional[str] = None
    cuello_presion_squeegees: Optional[str] = None
    cuello_nro_marco:         Optional[str] = None
    cuello_tipo_malla:        Optional[str] = None

    class Config:
        from_attributes = True


#TEMPERATURA
class TemperaturaCrear(BaseModel):
    numero_zona: int
    set_point:   Optional[str] = None
    lado_izq:    Optional[str] = None
    lado_der:    Optional[str] = None

class TemperaturaResponde(BaseModel):
    id_htd_temperatura: int
    numero_zona:        int
    set_point:          Optional[str] = None
    lado_izq:           Optional[str] = None
    lado_der:           Optional[str] = None

    class Config:
        from_attributes = True


#CABECERA
class CabeceraCrear(BaseModel):
    fecha_elaboracion:     date
    molde:                 str
    no_plano:              Optional[str] = None
    identificador_maquina: str
    tipo_decorado:         Optional[str] = None
    no_archa:              Optional[str] = None
    cant_ranuras:          Optional[int] = None
    no_tazas:              Optional[int] = None
    velocidad_bpm:         Optional[int] = None
    tiempo_malla_seg:      Optional[int] = None
    problemas:             Optional[str] = None
    observaciones:         Optional[str] = None
    revisado_por:          Optional[str] = None
    colores:               List[ColorCrear]
    estaciones:            List[EstacionCrear]
    temperatura:           List[TemperaturaCrear]

class CabeceraResponde(BaseModel):
    id_htd_cabecera:       int
    fecha_elaboracion:     date
    molde:                 str
    no_plano:              Optional[str] = None
    identificador_maquina: str
    tipo_decorado:         Optional[str] = None
    no_archa:              Optional[str] = None
    cant_ranuras:          Optional[int] = None
    no_tazas:              Optional[int] = None
    velocidad_bpm:         Optional[int] = None
    tiempo_malla_seg:      Optional[int] = None
    problemas:             Optional[str] = None
    observaciones:         Optional[str] = None
    revisado_por:          Optional[str] = None
    colores:               List[ColorResponde]
    estaciones:            List[EstacionResponde]
    temperatura:           List[TemperaturaResponde]

    class Config:
        from_attributes = True


#LISTADO
class CabeceraListado(BaseModel):
    id_htd_cabecera:       int
    fecha_elaboracion:     date
    molde:                 str
    identificador_maquina: str
    tipo_decorado:         Optional[str] = None
    revisado_por:          Optional[str] = None

    class Config:
        from_attributes = True