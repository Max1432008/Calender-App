from flask import Blueprint
from flask import Flask, render_template, url_for, session, redirect

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
    user.confirmation_token = True

    session.commit()
    session.close()
    return render_template("confirm.html")


def send_confirmation_email(email, token):
    msg = EmailMessage()
    msg["Subject"] = "Bestätige deine E-Mail-Adresse"
    msg["To"] = email
    msg["From"] = "Max.Oldehus@icloud.com"

    link = f"http://localhost:5001/confirm/{token}"
    msg.set_content(f"""
Hallo {email},
um deine E-Mail-Adresse zu bestätigen, klicke bitte auf folgenden Link:
{link}
Viele Grüße,
Deine Kalender-Team Max.Oldehus""")
    msg.add_alternative(f"""
<html>
  <body style="font-family: Arial, sans-serif; background: #f4f7fb; padding: 30px;">
    <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; margin: auto;">
      <h1 style="color: #4f46e5;">Willkommen!</h1>
      <p>Bestätige deine E-Mail-Adresse mit einem Klick:</p>
      <a href="{link}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 10px; display: inline-block;">
        E-Mail bestätigen
      </a>
    </div>
  </body>
</html>
""", subtype="html")

    with smtplib.SMTP("smtp.mail.me.com", 587) as smtp:        
        smtp.starttls()
        smtp.login("Max.Oldehus@icloud.com", "uvex-dbpe-lvph-xojg")
        smtp.send_message(msg)