# backend/modules/pintura/services.py

from sqlalchemy.orm import Session
from fastapi import BackgroundTasks # <--- IMPORTANTE PARA LAS NOTIFICACIONES
from .models import PinturaInventario, PinturaRegistro, PinturaConsumo
from .schemas import RegistroCrear, ConsumoCrear
from backend.utils.notificaciones import enviar_correo_alerta # importa la funcion de utils
from backend.utils.db_funciones import obtener_inventario_generico # importa la funcion de utils

# LÓGICA DE REGISTROS (ENTRADAS DE INSUMO)

def registrar_registro_pintura(db: Session, datos: RegistroCrear):
    """
    Registra una entrada de pintura (registro) y suma automáticamente al inventario.
    """
    # 1. Obtenemos el registro de inventario base
    inventario = db.query(PinturaInventario).filter(PinturaInventario.id == datos.id_pintura_inventario).first()
    
    if not inventario:
        return {"status": "error", "message": "Insumo no encontrado en inventario"}

    try:
        # 2. Actualizamos el stock
        inventario.cantidad_actual += datos.cantidad_registrada

        # 3. Guardamos el formato de registro
        nuevo_registro = PinturaRegistro(**datos.model_dump(by_alias=False))
        db.add(nuevo_registro)

        # 4. Confirmamos la transacción
        db.commit()
        db.refresh(nuevo_registro)
        return {"status": "success", "id": nuevo_registro.id}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}


# LÓGICA DE CONSUMOS (SALIDAS DE INSUMO Y ALERTAS)

def registrar_consumo_pintura(db: Session, datos: ConsumoCrear, background_tasks: BackgroundTasks):
    """
    Registra el consumo, resta del inventario y dispara alerta si llega al mínimo.
    """
    inventario = db.query(PinturaInventario).filter(PinturaInventario.id == datos.id_pintura_inventario).first()
    
    if not inventario:
        return {"status": "error", "message": "Insumo no encontrado"}

    # Validación de stock
    if inventario.cantidad_actual < datos.cantidad_consumida:
        return {
            "status": "error", 
            "message": f"Stock insuficiente. Disponible: {inventario.cantidad_actual}"
        }

    try:
        # 1. Restamos del stock
        inventario.cantidad_actual -= datos.cantidad_consumida

        # 2. VALIDACIÓN PARA DISPARAR ALERTA (Notificación)
        # Si el stock cae al límite o menos, enviamos correo
        
        if inventario.cantidad_actual == 0:
            # Alerta crítica: Stock en cero
            background_tasks.add_task(
                enviar_correo_alerta, 
                "d30670857@gmail.com, dragobonco@gmail.com", 
                f"ALERTA CRÍTICA: Pintura color - {inventario.color} AGOTADA", 
                f"El insumo pintura de color {inventario.color} se ha agotado por completo (0 Litros en inventario). "
                f"Es necesario realizar un reabastecimiento urgente de este material."
            )
        
        
        elif inventario.cantidad_actual <= inventario.cantidad_minima_alerta:
            background_tasks.add_task(
                enviar_correo_alerta, 
                "d30670857@gmail.com, dragobonco@gmail.com", 
                f"ALERTA: Bajas cantidades de pintura color - {inventario.color} en el inventario,", 
                f"Actualmente, cuarto de pantalla cuenta con {inventario.cantidad_actual} Litros de Pintura color  {inventario.color}, lo cual representa niveles bajo de este insumo. Se recomienda hacer una nueva solicitud del material y actualizar la cantidad antes de que se agote."
            )


        # 3. Guardamos el formato de consumo
        nuevo_consumo = PinturaConsumo(**datos.model_dump(by_alias=False))
        db.add(nuevo_consumo)

        db.commit()
        db.refresh(nuevo_consumo)
        return {"status": "success", "id": nuevo_consumo.id}
    
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}


# LÓGICA DE CONSULTAS (LISTADOS)

def listar_registros(db: Session):
    return obtener_inventario_generico(db, PinturaRegistro)

def listar_consumos(db: Session):
    return obtener_inventario_generico(db, PinturaConsumo)

def obtener_inventario(db: Session):
    """Retorna todos los registros del inventario de pintura."""
    return obtener_inventario_generico(db, PinturaInventario)  # Llamada a la función genérica