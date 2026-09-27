# backend/utils/excel.py
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from io import BytesIO


class EstilosExcel:
    #FUENTE DE CABECERA
    fuente_cabecera = Font(
        name="Arial",
        bold=True,
        color="FFFFFF",
        size=11
    )

    #RELLENO AZUL OSCURO PARA CABECERA
    relleno_cabecera = PatternFill(
        fill_type="solid",
        fgColor="1F4E79"
    )

    #ALINEACION CENTRADA
    alineacion_centro = Alignment(
        horizontal="center",
        vertical="center"
    )

    #BORDE FINO EN TODAS LAS CELDAS
    borde_fino = Border(
        left=Side(style="thin"),
        right=Side(style="thin"),
        top=Side(style="thin"),
        bottom=Side(style="thin")
    )

    #FUENTE NORMAL PARA DATOS
    fuente_datos = Font(
        name="Arial",
        size=10
    )


def escribir_cabecera(hoja, columnas: list[str]):
    #COLUMNAS ES UNA LISTA DE STRINGS CON LOS TITULOS
    #SE AGREGA N° COMO PRIMERA COLUMNA AUTOMATICAMENTE
    todas = ["N°"] + columnas
    for indice, titulo in enumerate(todas, start=1):
        celda = hoja.cell(row=1, column=indice, value=titulo)
        celda.font      = EstilosExcel.fuente_cabecera
        celda.fill      = EstilosExcel.relleno_cabecera
        celda.alignment = EstilosExcel.alineacion_centro
        celda.border    = EstilosExcel.borde_fino

        letra = get_column_letter(indice)
        hoja.column_dimensions[letra].width = max(len(titulo) + 6, 14)


def escribir_filas(hoja, filas: list[dict], columnas: list[str]):
    #FILAS ES UNA LISTA DE DICTS, COLUMNAS DEFINE EL ORDEN DE LAS CLAVES
    #LA PRIMERA COLUMNA ES SIEMPRE EL NUMERO CORRELATIVO
    for fila_num, fila in enumerate(filas, start=2):
        numero = hoja.cell(row=fila_num, column=1, value=fila_num - 1)
        numero.font      = EstilosExcel.fuente_datos
        numero.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        numero.border    = EstilosExcel.borde_fino

        for col_num, clave in enumerate(columnas, start=2):
            celda = hoja.cell(row=fila_num, column=col_num, value=fila.get(clave))
            celda.font      = EstilosExcel.fuente_datos
            celda.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            celda.border    = EstilosExcel.borde_fino


def crear_libro(nombre_hoja: str):
    #CREA EL WORKBOOK Y RENOMBRA LA HOJA ACTIVA
    libro = Workbook()
    hoja  = libro.active
    hoja.title = nombre_hoja
    return libro, hoja


def libro_a_bytes(libro: Workbook) -> bytes:
    #CONVIERTE EL LIBRO A BYTES SIN GUARDAR EN DISCO
    buffer = BytesIO()
    libro.save(buffer)
    buffer.seek(0)
    return buffer.getvalue()