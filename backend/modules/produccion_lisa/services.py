# backend/modules/produccion_lisa/services.py

from sqlalchemy.orm import Session
from typing import Optional
from .models import RegistroProduccionLisa, SalidaProduccionLisa
from .schemas import RegistroProduccionLisaCrear, SalidaProduccionLisaCrear

# LÓGICA DE CONSULTAS (LISTADOS CON FILTROS PARA EL FRONTEND)

def obtener_inventario_lisa(db: Session, from_date: Optional[str], to_date: Optional[str], modelo: Optional[str]):
    """Filtra el inventario según los parámetros del frontend."""
    query = db.query(RegistroProduccionLisa)
    
    if from_date:
        query = query.filter(RegistroProduccionLisa.fecha_registro >= from_date)
    if to_date:
        query = query.filter(RegistroProduccionLisa.fecha_registro <= to_date)
    if modelo:
        query = query.filter(RegistroProduccionLisa.modelo == modelo)
        
    return {"status": "success", "data": query.all()}


def listar_historial_salidas(db: Session, from_date: Optional[str], to_date: Optional[str], modelo: Optional[str]):
    """Filtra el historial de salidas cruzando datos con el modelo de la tabla registros."""
    # Hacemos un JOIN para poder filtrar por el 'modelo' que está en la tabla de registro
    query = db.query(SalidaProduccionLisa).join(
        RegistroProduccionLisa, SalidaProduccionLisa.nro_lote == RegistroProduccionLisa.nro_lote
    )
    
    if from_date:
        query = query.filter(SalidaProduccionLisa.fecha_salida >= from_date)
    if to_date:
        query = query.filter(SalidaProduccionLisa.fecha_salida <= to_date)
    if modelo:
        query = query.filter(RegistroProduccionLisa.modelo == modelo)
        
    return {"status": "success", "data": query.all()}


# LÓGICA DE ESCRITURA (OPERACIONES TRANSACCIONALES PROPIAS)

def registrar_produccion_lisa(db: Session, datos: RegistroProduccionLisaCrear):
    """
    Registra un nuevo lote de producción lisa.
    Asegura que el stock inicial disponible sea igual a la cantidad registrada.
    """
    try:
        # Verificamos si el número de lote ya existe para evitar errores de duplicado
        lote_existente = db.query(RegistroProduccionLisa).filter(
            RegistroProduccionLisa.nro_lote == datos.nro_lote
        ).first()
        
        if lote_existente:
            return {"status": "error", "message": f"El número de lote '{datos.nro_lote}' ya se encuentra registrado"}

        # Convertimos el esquema a diccionario para instanciar el modelo
        datos_dict = datos.model_dump(by_alias=False)
        
        # Regla de negocio básica: Al crearse, el stock disponible es igual a la cantidad ingresada
        datos_dict["stock_disponible"] = datos_dict["cantidad_registrada"]

        nuevo_registro = RegistroProduccionLisa(**datos_dict)
        db.add(nuevo_registro)
        db.commit()
        db.refresh(nuevo_registro)
        
        return {"status": "success", "id": nuevo_registro.id}
        
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}


def registrar_salida_lisa(db: Session, datos: SalidaProduccionLisaCrear):
    """
    Registra la salida de material de un lote, validando y restando del stock disponible.
    """
    # 1. Buscamos el lote al que se le quiere dar salida
    lote = db.query(RegistroProduccionLisa).filter(
        RegistroProduccionLisa.nro_lote == datos.nro_lote
    ).first()
    
    if not lote:
        return {"status": "error", "message": f"El lote '{datos.nro_lote}' no existe en el inventario"}

    # 2. Validación crítica de Stock disponible
    if lote.stock_disponible < datos.cantidad_sacada:
        return {
            "status": "error", 
            "message": f"Stock insuficiente para el lote {datos.nro_lote}. Disponible: {lote.stock_disponible} unidades."
        }

    try:
        # 3. Restamos del stock disponible del lote primario
        lote.stock_disponible -= datos.cantidad_sacada

        # 4. Guardamos el registro en el historial de salidas
        nueva_salida = SalidaProduccionLisa(**datos.model_dump(by_alias=False))
        db.add(nueva_salida)
        
        db.commit()
        db.refresh(nueva_salida)
        return {"status": "success", "id": nueva_salida.id}
        
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}


def eliminar_registro_lisa(db: Session, id_registro: int):
    """
    Elimina un lote de producción por su ID. 
    Gracias a 'ondelete=CASCADE' en la BD, las salidas asociadas se borran automáticamente.
    """
    lote = db.query(RegistroProduccionLisa).filter(RegistroProduccionLisa.id == id_registro).first()
    
    if not lote:
        return {"status": "error", "message": "El registro de producción seleccionado no existe"}

    try:
        db.delete(lote)
        db.commit()
        return {"status": "success", "message": "Registro de lote y su historial de salidas eliminados correctamente"}
        
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}