# backend/modules/exportacion/schemas.py
from pydantic import BaseModel
from datetime import date


class FiltroFechas(BaseModel):
    fechaDesde: date
    fechaHasta: date