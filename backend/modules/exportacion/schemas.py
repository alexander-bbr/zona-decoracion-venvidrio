from pydantic import BaseModel
from datetime import date
from typing import Optional
from decimal import Decimal


class FiltroFechas(BaseModel):
    fechaDesde: date
    fechaHasta: date


class FiltroProduccion(FiltroFechas):
    tecnico: Optional[str] = None
    turno: Optional[int] = None
    totalGruesas: Optional[Decimal] = None
    totalGruesasLisas: Optional[Decimal] = None
    totalGruesasDecoradas: Optional[Decimal] = None
    eficiencia: Optional[Decimal] = None
    item: Optional[str] = None