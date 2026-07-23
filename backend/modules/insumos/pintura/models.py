# Importamos los tipos de datos exactos que necesita SQLAlchemy, añadiendo ForeignKey
from sqlalchemy import Column, Integer, String, Date, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship

from backend.database.conexion import Base

# TABLA MAESTRA: INVENTARIO DE PINTURA
class PinturaInventario(Base):
    __tablename__ = "pintura_inventario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    color = Column(String(50), nullable=False)
    cantidad_actual = Column(Numeric(10, 2), nullable=False, default=0.00)
    cantidad_minima_alerta = Column(Numeric(10, 2), nullable=False, default=5.00)

    registros = relationship("PinturaRegistro", back_populates="inventario")
    consumos = relationship("PinturaConsumo", back_populates="inventario")


# TABLA DE ENTRADAS: REGISTRO DE PINTURA
class PinturaRegistro(Base):
    __tablename__ = "pintura_registro"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_pintura_inventario = Column(Integer, ForeignKey("pintura_inventario.id", ondelete="CASCADE"), nullable=False)
    
    proveedor = Column(String(100), nullable=False)
    fecha_registro = Column(Date, nullable=False)
    unidad_medida = Column(String(50), nullable=False)
    cantidad_registrada = Column(Numeric(10, 2), nullable=False)
    registrado_por = Column(String(100), nullable=False)
    observaciones = Column(Text, nullable=True)

    inventario = relationship("PinturaInventario", back_populates="registros")


# TABLA DE SALIDAS: CONSUMO DE PINTURA
class PinturaConsumo(Base):
    __tablename__ = "formato_pintura_consumo"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_pintura_inventario = Column(Integer, ForeignKey("pintura_inventario.id", ondelete="CASCADE"), nullable=False)
    
    proveedor = Column(String(100), nullable=False)
    fecha_inicio_consumo = Column(Date, nullable=False)
    numero_lote = Column(String(50), nullable=False)
    unidad_medida = Column(String(50), nullable=False)
    cantidad_consumida = Column(Numeric(10, 2), nullable=False)
    fecha_finalizacion_consumo = Column(Date, nullable=False)
    revisado_por = Column(String(100), nullable=False)
    observaciones = Column(Text, nullable=True)

    inventario = relationship("PinturaInventario", back_populates="consumos")


'''
# ---------------------------------------------------------
# CÓDIGO DE PRUEBA LOCAL (Solo para verificar los modelos)
# ---------------------------------------------------------
if __name__ == "__main__":
    from backend.database.conexion import SessionLocal

    db = SessionLocal()
    
    try:
        cant_inv = db.query(PinturaInventario).count()
        cant_reg = db.query(PinturaRegistro).count()
        cant_con = db.query(PinturaConsumo).count()
        
        print("¡Éxito! Los 3 modelos están enlazados a la base de datos.")
        print(f"- Inventario: {cant_inv} registros.")
        print(f"- Registros: {cant_reg} registros.")
        print(f"- Consumos: {cant_con} registros.")
        
    except Exception as e:
        print(f"Error al probar el modelo: {e}")
        
    finally:
        db.close()
'''