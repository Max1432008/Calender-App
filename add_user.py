# add_user.py
from models import engine, User, Event
from sqlalchemy.orm import sessionmaker
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError







# Session erstellen
Session = sessionmaker(bind=engine)

def create_user(username, email, password):
    session = Session()
    try:
        if not email:
            return {"ok": False, "error": "E-Mail fehlt"}

        # Prüfen, ob User schon existiert
        if session.query(User).filter_by(username=username).first():
            print(f"✗ Benutzer '{username}' existiert bereits.")
            return {"ok": False, "error": "Benutzername existiert bereits"}

        if session.query(User).filter_by(email=email).first():
            print(f"✗ E-Mail '{email}' existiert bereits.")
            return {"ok": False, "error": "E-Mail existiert bereits"}

        new_user = User(
            username=username,
            name=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        session.add(new_user)
        session.commit()
        # Werte vor dem Session-Close in ein simples Dict kopieren
        user_data = {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
        }
        print(f"✓ Benutzer '{username}' erstellt.")
        return {"ok": True, "user": user_data}
    except IntegrityError:
        session.rollback()
        return {"ok": False, "error": "Benutzername oder E-Mail existiert bereits"}
    except Exception:
        session.rollback()
        return {"ok": False, "error": "Serverfehler bei Registrierung"}

    finally:
        session.close()
