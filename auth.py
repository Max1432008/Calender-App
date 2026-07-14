from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash
from models import User, engine
from sqlalchemy.orm import sessionmaker


from add_user import create_user
#! Email bestätigung ist noch nicht implementiert, daher wird die Funktion hier auskommentiert
#from send_mail import send_confirmation_email

auth = Blueprint("auth", __name__)

Session = sessionmaker(bind=engine)



def benutzer_abfragen(username, password, eMail):
    session = Session()

    try:
        user = session.query(User).filter_by(username=username).first()

        if not user:
            return {"ok": False, "error": "Benutzer nicht gefunden"}
        
        if user.email != eMail:
           return {"ok": False, "error": "Email nicht gefunden"}


        if not check_password_hash(user.password_hash, password):
            return {"ok": False, "error": "Falsches Passwort oder Benutzername"}
        
        return {
            "ok": True,
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    finally:
        session.close()


def Registrierungsprozess(password, password_Confirm, eMail, username):
    if password != password_Confirm:
        print("✗ Fehler: Passwörter stimmen nicht überein")
        return {"ok": False, "error": "Passwörter stimmen nicht überein"}


    created = create_user(username, eMail, password)
    if not created["ok"]:
        return {"ok": False, "error": created["error"]}
    user = created["user"]

    #! Email bestätigung ist noch nicht implementiert, daher wird die Funktion hier auskommentiert
    #send_confirmation_email(user.email, user.confirmation_token)

    return {
        "ok": True,
        "message": "Registrierung erfolgreich",
        "user_id": user["id"],
        "username": user["username"],
        "email": user["email"],
    }



def Anmeldeprozess(username, password, eMail):
    print(f"Anmeldeprozess: {username}, {eMail}")
    result = benutzer_abfragen(username, password, eMail)
    if result["ok"]:
        print(f"✓ Anmeldung erfolgreich für {username}")
        return {"ok": True, "message": "Anmeldung erfolgreich", "user": result}

    return result



def Statusüberprüfung(Status, password, password_Confirm, eMail, username):
    print("Statusüberprüfung ausgeführt:", Status)
    if Status and Status.lower() == "registrieren":
        result = Registrierungsprozess(password, password_Confirm, eMail, username)
        if not result["ok"]:
            print("✗ Registrierung fehlgeschlagen:", result["error"])
        return result
    else:
        return Anmeldeprozess(username, password, eMail)


@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    print("REGISTER:", data)

    username = data.get("username")
    password = data.get("password")
    password_Confirm = data.get("password_Confirm")
    Status = data.get("Status") or data.get("Stutus")
    eMail = data.get("eMail")
    is_register = (Status or "").lower() == "registrieren"

    if not username or not password:
        return jsonify(error="Fehlende Daten, Füllen sie bitte alle Felder aus"), 400

    if is_register and not password_Confirm:
        return jsonify(error="Passwort-Bestätigung fehlt"), 400

    if is_register and not eMail:
        return jsonify(error="E-Mail fehlt"), 400

    if is_register and password != password_Confirm:
        kommentar = f"Passwörter stimmen nicht überein, verseuchen sie es erneut"
        return jsonify(error="Passwörter stimmen nicht überein", kommentar=kommentar), 400
    
    print(f"✓ Registrierung OK: {username} - {Status}")
    result = Statusüberprüfung(Status, password, password_Confirm, eMail, username)
    if not result["ok"]:
        return jsonify(error=result["error"]), 400

    

    # Login-Status in Flask-Session speichern, damit geschützte Routen funktionieren
    user_data = result.get("user") or {}
    user_id = user_data.get("id") or result.get("user_id")
    user_name = user_data.get("username") or result.get("username") or username
    if user_id:
        session["user_id"] = user_id
        session["username"] = user_name

    return jsonify(success=True, message=result.get("message", "OK"), data=result)


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username")
    password = data.get("password")
    eMail = data.get("eMail")

    if not username or not password:
        return jsonify(error="Fehlende Daten"), 400

    result = Anmeldeprozess(username, password, eMail)
    if not result["ok"]:
        return jsonify(error=result["error"]), 400

    user = result["user"]
    session["user_id"] = user["id"]
    session["username"] = user["username"]

    return jsonify(success=True, message=result["message"])

