# Importamos los tipos de datos exactos que necesita SQLAlchemy, añadiendo ForeignKey
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from backend.database.conexion import Base

# TABLA DE ENTRADAS: REGISTRO DE PRODUCCIÓN LISA
class RegistroProduccionLisa(Base):
    __tablename__ = "produccion_lisa_registro"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nro_lote = Column(String(50), unique=True, nullable=False)
    fecha_registro = Column(Date, nullable=False)
    modelo = Column(String(100), nullable=False)
    cantidad_registrada = Column(Integer, nullable=False)
    stock_disponible = Column(Integer, nullable=False)

    # Relación con las salidas (vinculado por el campo único nro_lote)
    salidas = relationship("SalidaProduccionLisa", back_populates="registro")


# TABLA DE SALIDAS: SALIDA DE PRODUCCIÓN LISA
class SalidaProduccionLisa(Base):
    __tablename__ = "produccion_lisa_historial_salida"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Importante: El ForeignKey apunta a produccion_lisa_registro.nro_lote, no al id
    nro_lote = Column(
        String(50), 
        ForeignKey("produccion_lisa_registro.nro_lote", ondelete="CASCADE", onupdate="CASCADE"), 
        nullable=False
    )
    fecha_salida = Column(Date, nullable=False)
    cantidad_sacada = Column(Integer, nullable=False)

    # Relación inversa con el registro
    registro = relationship("RegistroProduccionLisa", back_populates="salidas")

'''
# ---------------------------------------------------------
# CÓDIGO DE PRUEBA LOCAL (Solo para verificar los modelos)
# ---------------------------------------------------------
if __name__ == "__main__":
    from backend.database.conexion import SessionLocal

    db = SessionLocal()
    
    try:
        cant_reg = db.query(RegistroProduccionLisa).count()
        cant_sal = db.query(SalidaProduccionLisa).count()
        
        print("¡Éxito! Los 2 modelos de Producción Lisa están enlazados a la base de datos.")
        print(f"- Registros (Lotes): {cant_reg} registros.")
        print(f"- Salidas: {cant_sal} registros.")
        
    except Exception as e:
        print(f"Error al probar el modelo: {e}")
        
    finally:
        db.close()
        
'''