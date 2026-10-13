# backend/modules/rendimiento/models.py  (o metas/models.py)

from sqlalchemy import Column, Integer, String, Numeric, Boolean
from backend.database.conexion import Base


class MetaRendimiento(Base):
    __tablename__ = "metas_rendimiento"

    id_meta = Column(Integer, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False)
    mes = Column(String(20), nullable=False)
    deficiencia = Column(Numeric(5, 2), nullable=False)
    estado = Column(Boolean, nullable=False, default=False)
