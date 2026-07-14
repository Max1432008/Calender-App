from flask import Blueprint
from models import User, engine
from sqlalchemy.orm import sessionmaker

import smtplib
from email.message import EmailMessage


send_mail = Blueprint("send_mail", __name__)
Session = sessionmaker(bind=engine)


@send_mail.route("/confirm/<token>")
def confirm_email(token):
    session = Session()
    user = session.query(User).filter_by(confirmation_token=token).first()
    if not user:
        return "Ungültiger Bestätigungslink", 400
    user.email_confirmed = True
    user.is_active = True
    user.confirmation_token = None

    session.commit()
    session.close()
    return "E-Mail bestätigt! Du kannst dich jetzt anmelden."


def send_confirmation_email(email, token):
    msg = EmailMessage()
    msg["Subject"] = "Bestätige deine E-Mail-Adresse"
    msg["To"] = email

    link = f"http://localhost:5001/confirm/{token}"
    msg.set_content(f"""
Hallo {email},
um deine E-Mail-Adresse zu bestätigen, klicke bitte auf folgenden Link:
{link}
Viele Grüße,
Dein Blog-Team Max.Oldehus""")

with smtplib.SMTP("smtp.gmail.com", 465) as smtp:
    smtp.starttls()
    smtp.login("max.oldehus@online.de", "your_app_password_here")  # Use app password for Gmail
    smtp.send_message(msg)