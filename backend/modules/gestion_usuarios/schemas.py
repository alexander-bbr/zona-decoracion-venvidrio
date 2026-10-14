# backend/modules/gestion_usuarios/schemas.py
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime


# ESQUEMAS PARA USUARIO
# 1. Crear usuario (Recibe datos personales + permisos)
class UsuarioCrear(BaseModel):
    cedula: str = Field(alias="cedula")
    carnet_usuario: str = Field(alias="carnetUsuario")
    contrasena: str = Field(alias="contrasena")
    nombres: str = Field(alias="nombres")
    apellidos: str = Field(alias="apellidos")
    telefono: Optional[str] = Field(default=None, alias="telefono")
    correo: str = Field(alias="correo")
    rol: str = Field(alias="rol")
    activo_usuario: bool = Field(default=True, alias="activoUsuario")
    ids_permisos: List[int] = Field(default_factory=list, alias="idsPermisos")

    @validator("rol")
    @classmethod
    def normalizar_rol(cls, valor):
        return valor.lower()


    class Config:
        allow_population_by_field_name = True

# 2. Editar usuario (Recibe datos personales + estado + permisos)
class UsuarioEditar(BaseModel):
    cedula: str = Field(alias="cedula")
    carnet_usuario: str = Field(alias="carnetUsuario")
    contrasena: Optional[str] = Field(default=None, alias="contrasena")
    nombres: str = Field(alias="nombres")
    apellidos: str = Field(alias="apellidos")
    telefono: Optional[str] = Field(default=None, alias="telefono")
    correo: str = Field(alias="correo")
    rol: str = Field(alias="rol")
    activo_usuario: bool = Field(alias="activoUsuario")
    ids_permisos: List[int] = Field(default_factory=list, alias="idsPermisos")

    @validator("rol")
    @classmethod
    def normalizar_rol(cls, valor):
        return valor.lower()

    class Config:
        allow_population_by_field_name = True

# 3. Mostrar datos del usuario (Para la tabla principal y para prellenar datos)
class UsuarioResponde(BaseModel):
    id_usuario: int
    cedula: str
    carnet_usuario: str
    nombres: str
    apellidos: str
    telefono: Optional[str] = None
    correo: str
    rol: str
    activo_usuario: bool
    creado_en: datetime

    class Config:
        orm_mode = True



# ESQUEMAS PARA PERMISOS
# 4. Catálogo de permisos (Para mostrar las opciones disponibles en el frontend)
class PermisoModuloResponde(BaseModel):
    id_permisom: int
    modulo: str
    accion: str

    class Config:
        orm_mode = True



# ESQUEMA COMBINADO DE RESPUESTA
# 5. Obtener usuario para editar (Devuelve datos personales + permisos en un solo paquete)
class UsuarioCompletoResponde(BaseModel):
    usuario: UsuarioResponde
    permisos: List[PermisoModuloResponde]