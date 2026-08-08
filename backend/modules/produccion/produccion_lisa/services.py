from sqlalchemy.orm import Session
from .models import InventarioProduccionLisa, RegistroProduccionLisa, SalidaProduccionLisa
from .schemas import RegistroCrear, SalidaCrear
from datetime import date
from typing import Optional

#INVENTARIO

def obtener_inventario(db: Session):
    try:
        inventario = db.query(InventarioProduccionLisa).filter(
            InventarioProduccionLisa.estado == 1
        ).all()
        return {"status": "success", "data": inventario}
    except Exception as e:
        return {"status": "error", "message": str(e)}


#REGISTRO

def registrar_produccion(db: Session, datos: RegistroCrear):
    try:
        #caso nuevo modelo
        if datos.nuevo_modelo and not datos.id_inventariopl:
            nuevo_modelo = InventarioProduccionLisa(
                modelo          = datos.nuevo_modelo,
                cantidad_actual = datos.cantidad_registrada
            )
            db.add(nuevo_modelo)
            db.flush()
            id_inventariopl = nuevo_modelo.id_inventariopl

        #caso modelo existente
        elif datos.id_inventariopl:
            modelo = db.query(InventarioProduccionLisa).filter(
                InventarioProduccionLisa.id_inventariopl == datos.id_inventariopl,
                InventarioProduccionLisa.estado == 1
            ).first()

            if not modelo:
                return {"status": "error", "message": "El modelo seleccionado no existe o está desactivado"}

            modelo.cantidad_actual += datos.cantidad_registrada
            id_inventariopl         = datos.id_inventariopl

        else:
            return {"status": "error", "message": "Debe seleccionar un modelo o ingresar uno nuevo"}

        #crear registro
        nuevo_registro = RegistroProduccionLisa(
            fecha_registro      = datos.fecha_registro,
            id_inventariopl     = id_inventariopl,
            cantidad_registrada = datos.cantidad_registrada
        )
        db.add(nuevo_registro)
        db.commit()
        db.refresh(nuevo_registro)

        return {"status": "Registro insertado con éxito", "id": nuevo_registro.id_registro}

    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}


#SALIDA

def registrar_salida(db: Session, datos: SalidaCrear):
    try:
        modelo = db.query(InventarioProduccionLisa).filter(
            InventarioProduccionLisa.id_inventariopl == datos.id_inventariopl,
            InventarioProduccionLisa.estado == 1
        ).first()

        if not modelo:
            return {"status": "error", "message": "El modelo seleccionado no existe o está desactivado"}

        #validacion de stock
        if modelo.cantidad_actual < datos.cantidad_sacada:
            return {
                "status": "error",
                "message": f"Stock insuficiente. Disponible: {modelo.cantidad_actual} unidades"
            }

        modelo.cantidad_actual -= datos.cantidad_sacada

        nueva_salida = SalidaProduccionLisa(
            fecha_salida    = datos.fecha_salida,
            id_inventariopl = datos.id_inventariopl,
            cantidad_sacada = datos.cantidad_sacada
        )
        db.add(nueva_salida)
        db.commit()
        db.refresh(nueva_salida)

        return {"status": "Operacion exitosa", "id": nueva_salida.id_salida}

    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}


#HISTORIAL
def obtener_historial(db: Session, from_date: Optional[date] = None, to_date: Optional[date] = None):
    try:
        query_registros = db.query(RegistroProduccionLisa)
        query_salidas   = db.query(SalidaProduccionLisa)

        if from_date and to_date:
            registros = query_registros.filter(
                RegistroProduccionLisa.fecha_registro.between(from_date, to_date)
            ).all()
            salidas = query_salidas.filter(
                SalidaProduccionLisa.fecha_salida.between(from_date, to_date)
            ).all()
        else:
            registros = query_registros.order_by(RegistroProduccionLisa.id_registro.desc()).limit(10).all()
            salidas   = query_salidas.order_by(SalidaProduccionLisa.id_salida.desc()).limit(10).all()

            combinados = (
                [{"tipo": "registro", "fecha": r.fecha_registro, "obj": r} for r in registros] +
                [{"tipo": "salida",   "fecha": s.fecha_salida,   "obj": s} for s in salidas]
            )
            combinados.sort(key=lambda x: x["fecha"], reverse=True)
            combinados = combinados[:10]

            registros = [c["obj"] for c in combinados if c["tipo"] == "registro"]
            salidas   = [c["obj"] for c in combinados if c["tipo"] == "salida"]

        return {
            "status": "success",
            "data": {
                "registros": [
                    {
                        "id_registro":         r.id_registro,
                        "fecha_registro":      r.fecha_registro,
                        "modelo":              r.inventario.modelo,
                        "cantidad_registrada": r.cantidad_registrada
                    } for r in registros
                ],
                "salidas": [
                    {
                        "id_salida":       s.id_salida,
                        "fecha_salida":    s.fecha_salida,
                        "modelo":          s.inventario.modelo,
                        "cantidad_sacada": s.cantidad_sacada
                    } for s in salidas
                ]
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}