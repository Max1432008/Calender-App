from flask import Blueprint, request, jsonify, session as flask_session
from models import Session, User

profil = Blueprint("profil", __name__)


@profil.route("/get-user-data")
def get_user_data_header():
    user_id = flask_session.get("user_id")
    db_session = Session()
    profil_data = db_session.query(User).filter_by(id=user_id).first()

    if profil_data is None:
        return jsonify({
            "success": False,
            "error": "Benutzer nicht gefunden"
        })

    return jsonify({
        "success": True,
        "data": {
            "name": profil_data.name,
            "profil_cover": profil_data.profil_cover,
            "email": profil_data.email,
        }
    })


@profil.route("/update_Prfil_data", methods=["POST"])
def update_Prfil_data():
    user_id = flask_session.get("user_id")
    db_session = Session()

    data = request.get_json(silent=True) or {}

    name = data.get("name")
    email = data.get("email")
    background_color = data.get("background_color")
    color_theme = data.get("color_theme")


    user = db_session.query(User).filter_by(
    id=user_id
    ).first()

    if User is None:
        db_session.close()
        return jsonify({"success": False, "error": "User nicht gefunden"})

    try:

        user.name = name
        user.email = email
        user.background_color = background_color
        user.color_theme = color_theme
        db_session.commit()

        return jsonify({
            "success": True,
            "message": "Profil erfolgreich aktualisiert"
        })
    except Exception as error:
        db_session.rollback()
        print("hier ist der Fehelr")
        return jsonify({
            "success": False,
            "error": str(error)
        }), 500
    finally:
        db_session.close()


