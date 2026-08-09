# backend/modules/insumos/pintura/router.py
from backend.modules.gestion_usuarios.dependencies import require_permiso

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from backend.database.conexion import get_db

from .services import (
    registrar_registro_pintura,
    registrar_consumo_pintura,
    listar_registros,
    listar_consumos,
    obtener_inventario
)

from .schemas import RegistroCrear, ConsumoCrear

router = APIRouter(
    prefix="/api/pintura",
    tags=["Insumo de Pintura"]
)


# ENDPOINT: CREAR REGISTRO (ENTRADAS DE INSUMO)
@router.post("/registro", response_model=dict)
def crear_registro(
    datos: RegistroCrear,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("insumo_pintura", "crear_registro"))
):

    # --- AGREGA ESTA LÍNEA AQUÍ ---
    print(f"DEBUG: Datos recibidos en el router: {datos}")
    # ------------------------------
    """
    Recibe los datos de un registro de pintura (entrada al inventario),
    actualiza el stock y guarda el registro en pintura_registro.
    """
    resultado = registrar_registro_pintura(db, datos)

    if resultado.get("status") == "error":
        raise HTTPException(status_code=400, detail=resultado.get("message"))

    return {
        "mensaje": "Registro ingresado con éxito",
        "id": resultado.get("id")
    }


# ENDPOINT: CREAR CONSUMO (SALIDAS DE INSUMO Y ALERTAS)
@router.post("/consumo", response_model=dict)
def crear_consumo(
    datos: ConsumoCrear,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("insumo_pintura", "crear_consumo"))
):
    """
    Recibe los datos de un consumo de pintura (salida),
    valida stock, resta del inventario, envía alertas si aplica 
    y guarda en formato_pintura_consumo.
    """
    resultado = registrar_consumo_pintura(db, datos, background_tasks)

    if resultado.get("status") == "error":
        raise HTTPException(status_code=400, detail=resultado.get("message"))

    return {
        "mensaje": "Consumo ingresado con éxito",
        "id": resultado.get("id")
    }


# ENDPOINT: LISTAR REGISTROS (HISTORIAL DE ENTRADAS)
@router.get("/registros")
def listar_registros_endpoint(
    db: Session = Depends(get_db),
    ##_=Depends(require_permiso("insumo_pintura", "ver_historial_registro"))
):
    """
    Devuelve todos los registros de pintura con los datos del inventario anidados.
    """
    print("======> ¡HACIENDO GET A REGISTROS! <======")
    registros = listar_registros(db)
    return {"data": jsonable_encoder(registros)}


# ENDPOINT: LISTAR CONSUMOS (HISTORIAL DE SALIDAS)
@router.get("/consumos")
def listar_consumos_endpoint(
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("insumo_pintura", "ver_historial_consumo"))
):
    """
    Devuelve todos los consumos de pintura con los datos del inventario anidados.
    """
    print("======> ¡HACIENDO GET A CONSUMOS! <======")
    consumos = listar_consumos(db)
    return {"data": jsonable_encoder(consumos)}


# ENDPOINT: LISTAR INVENTARIO (STOCK ACTUAL)
@router.get("/inventario")
def listar_inventario_endpoint(
    db: Session = Depends(get_db),
    #_=Depends(require_permiso("insumo_pintura", "ver_inventario"))
):
    """
    Devuelve todos los registros de inventario de pintura.
    """
    print("======> ¡HACIENDO GET A INVENTARIO! <======")
    respuesta = obtener_inventario(db) 
    return jsonable_encoder(respuesta)# Lo pasamos por el encoder y lo retornamos directo al frontend