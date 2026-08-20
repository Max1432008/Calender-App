from flask import Blueprint, request, jsonify, session as flask_session
from models import Session, User

profil = Blueprint("profil", __name__)


@profil.route("/get-user-data-header")
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
            "profil_cover": profil_data.profil_cover
        }
    })
