# backend/modules/auth/schemas.py
from pydantic import BaseModel, Field


# SE USA EN: recibir carnet y contraseña cuando el usuario intenta ingresar
class LoginRequest(BaseModel):
    carnet_usuario: str = Field(alias="carnetUsuario")
    contrasena: str = Field(alias="contrasena")

    class Config:
        populate_by_name = True


# SE USA EN: respuesta al login exitoso, lo que recibe el frontend para guardar y usar en futuras peticiones
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    rol: str
    nombres: str
    apellidos: str