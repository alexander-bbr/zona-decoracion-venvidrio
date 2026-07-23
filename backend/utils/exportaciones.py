# utils/exportaciones.py

# =====================================================================
# GUÍA DE USO:
# - Ambas funciones se usarán en los "routers" (ej. rutas.py) de tus 
#   módulos, justo antes de retornar la respuesta al compañero de frontend.
# - Se combinan con StreamingResponse de FastAPI para enviar el archivo
#   directamente a React sin tener que guardarlo permanentemente en el 
#   disco del servidor.
# =====================================================================
"""
import io
import pandas as pd
from fpdf import FPDF

def generar_excel_reporte(datos: list, nombre_hoja: str = "Reporte"):
    
    #Recibe una lista de diccionarios (resultados del ORM) y 
    #devuelve un archivo Excel en memoria (BytesIO) listo para descargarse.
    
    try:
        # Manejo de listas vacías
        if not datos:
            df = pd.DataFrame([{"Mensaje": "No hay datos para exportar"}])
        else:
            df = pd.DataFrame(datos)
            
        # Usamos un buffer en memoria
        buffer = io.BytesIO()
        
        # Escribimos el DataFrame usando openpyxl
        with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name=nombre_hoja)
        
        buffer.seek(0)
        return {"status": "success", "file": buffer}
        
    except Exception as e:
        return {"status": "error", "message": f"Error al generar Excel: {str(e)}"}


def generar_pdf_reporte(datos: list, titulo_reporte: str):
    
    #Genera un PDF estilo tabla básica con FPDF a partir de una lista de diccionarios.
    #Devuelve el PDF en memoria (BytesIO) para retornar directo en la petición HTTP.
    
    try:
        pdf = FPDF(orientation="P", unit="mm", format="A4")
        pdf.add_page()
        
        # Título del reporte
        pdf.set_font("Arial", style="B", size=16)
        pdf.cell(200, 10, txt=titulo_reporte, ln=True, align="C")
        pdf.ln(5) # Espaciado
        
        if not datos:
            pdf.set_font("Arial", size=12)
            pdf.cell(200, 10, txt="No hay datos disponibles.", ln=True, align="C")
        else:
            # Extraemos dinámicamente las llaves para las columnas
            cabeceras = list(datos[0].keys())
            
            # Ancho dinámico equitativo (190mm de ancho útil en A4)
            ancho_celda = 190 / len(cabeceras) if cabeceras else 190
            
            # Imprimir fila de cabeceras
            pdf.set_font("Arial", style="B", size=10)
            for cabecera in cabeceras:
                # Eliminamos guiones bajos y capitalizamos para mejor presentación
                texto_cabecera = str(cabecera).replace("_", " ").title()
                pdf.cell(ancho_celda, 10, txt=texto_cabecera, border=1, align="C")
            pdf.ln()
            
            # Imprimir datos fila por fila
            pdf.set_font("Arial", size=10)
            for fila in datos:
                for cabecera in cabeceras:
                    valor = str(fila.get(cabecera, ""))
                    pdf.cell(ancho_celda, 10, txt=valor, border=1, align="C")
                pdf.ln()

        # Exportar a BytesIO (FPDF output dest="S" retorna un string latin1)
        salida_string = pdf.output(dest="S").encode("latin1")
        buffer = io.BytesIO(salida_string)
        buffer.seek(0)
        
        return {"status": "success", "file": buffer}
        
    except Exception as e:
        return {"status": "error", "message": f"Error al generar PDF: {str(e)}"}

"""