#utils/notificaciones/alertas.py

import smtplib
import os
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

DESTINATARIOS = [d.strip() for d in os.environ.get("EMAIL_DESTINATARIOS", "").split(",")]


def _enviar_correo(asunto: str, cuerpo: str):
    remitente = os.environ.get("EMAIL_REMITENTE")
    password  = os.environ.get("EMAIL_PASSWORD")

    msg = EmailMessage()
    msg["Subject"] = asunto
    msg["From"]    = remitente
    msg["To"] = ", ".join(DESTINATARIOS)
    msg.set_content(cuerpo)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(remitente, password)
            smtp.send_message(msg)
    except Exception as e:
        print(f"Error al enviar correo de alerta: {e}")


def verificar_stock_insumo(articulo: str, cantidad_actual: float, cantidad_minima: float):
    if cantidad_actual <= 0:
        _enviar_correo(
            asunto=f"⛔ STOCK AGOTADO: {articulo}",
            cuerpo=(
                f"El insumo '{articulo}' se ha agotado completamente.\n\n"
                f"Cantidad actual: {cantidad_actual}\n"
                f"Cantidad mínima requerida: {cantidad_minima}\n\n"
                f"Se requiere reposición inmediata."
            )
        )
    elif cantidad_actual <= cantidad_minima:
        _enviar_correo(
            asunto=f"⚠️ STOCK MÍNIMO: {articulo}",
            cuerpo=(
                f"El insumo '{articulo}' ha alcanzado o bajado del nivel mínimo.\n\n"
                f"Cantidad actual: {cantidad_actual}\n"
                f"Cantidad mínima requerida: {cantidad_minima}\n\n"
                f"Se recomienda reponer el inventario."
            )
        )


def verificar_deficiencia_produccion(
    id_cabecera:    int,
    fecha:          str,
    turno:          int,
    grupo:          str,
    tecnico:        str,
    deficiencia:    float,
    total_gruesas:  float,
    justificantes:  list,
    meta_deficiencia: float,
    meta_periodo:   str,
):
    if deficiencia < meta_deficiencia:
        return

    detalle_justificantes = ""
    for item in justificantes:
        detalle_justificantes += f"\n  Molde: {item['molde']}\n"
        for j in item["justificaciones"]:
            detalle_justificantes += f"    - {j}\n"

    _enviar_correo(
        asunto=f"🚨 ALERTA DE PÉRDIDA EN PRODUCCIÓN — Turno {turno} | {fecha}",
        cuerpo=(
            f"Se ha detectado una deficiencia productiva igual o superior a la meta establecida.\n\n"
            f"{'='*20}\n"
            f"META ACTIVA\n"
            f"Período:          {meta_periodo}\n"
            f"Límite:            {meta_deficiencia}%\n\n"
            f"{'='*20}\n"
            f"DATOS DEL TURNO\n"
            f"Registro N°:      {id_cabecera}\n"
            f"Fecha:             {fecha}\n"
            f"Turno:             {turno}\n"
            f"Grupo:             {grupo}\n"
            f"Técnico:          {tecnico}\n\n"
            f"{'='*20}\n"
            f"MÉTRICAS DE PÉRDIDA\n"
            f"Total gruesas recibidas por maquinas decoradoras:     {round(total_gruesas, 2)}\n"
            f"Deficiencia de Producción:       {round(deficiencia, 2)}%\n"        
            f"{'='*20}\n"
            f"JUSTIFICANTES POR MOLDE\n"
            f"{detalle_justificantes}"
        )
    )