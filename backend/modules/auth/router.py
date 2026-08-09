# backend/modules/auth/router.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.database.conexion import get_db

from .services import login_usuario
from .schemas import LoginRequest, TokenResponse

router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticación"]
)


#COMENTARIO: ENDPOINT LOGIN
@router.post("/login", response_model=TokenResponse)
def login_endpoint(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    datos = LoginRequest(
        carnet_usuario=form_data.username,
        contrasena=form_data.password
    )

    resultado = login_usuario(db, datos)

    if resultado.get("status") == "error":
        raise HTTPException(status_code=401, detail=resultado.get("message"))

    return {
        "access_token": resultado.get("access_token"),
        "token_type": "bearer",
        "rol": resultado.get("rol"),
        "nombres": resultado.get("nombres"),
        "apellidos": resultado.get("apellidos"),
        "permisos": resultado.get("permisos")
    }