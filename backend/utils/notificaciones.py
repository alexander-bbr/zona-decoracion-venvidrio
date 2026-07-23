# utils/notificaciones.py
import smtplib
import os
from email.message import EmailMessage
from dotenv import load_dotenv  # <--- AGREGA ESTO

load_dotenv()  # <--- AGREGA ESTO para leer el archivo .env

def enviar_correo_alerta(destinatario: str, asunto: str, cuerpo: str):
    remitente = os.environ.get("EMAIL_REMITENTE")
    password = os.environ.get("EMAIL_PASSWORD")

    msg = EmailMessage()
    msg['Subject'] = asunto
    msg['From'] = remitente
    msg['To'] = destinatario
    msg.set_content(cuerpo)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(remitente, password)
            smtp.send_message(msg)
    except Exception as e:
        print(f"Error al enviar correo de notificación: {e}")