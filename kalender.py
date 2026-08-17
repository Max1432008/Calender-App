from flask import Blueprint, request, jsonify, session as flask_session
from models import Session, Calender_typ

kalender = Blueprint("kalender", __name__)


@kalender.route("/save-new-kalender", methods=["POST"])
def save_new_kalender():
    user_id = flask_session.get("user_id")
    db_session = Session()


    data = request.get_json(silent=True) or {}

    print("REGISTER:", data)

    kalender_data = data.get("kalender_data")

    if not kalender_data:
        return jsonify({
            "success": False,
            "error": "Keine Kalenderdaten"
        })


    neuer_kalender = Calender_typ(
        user_id = user_id, 
        titel=kalender_data["name"],
        color=kalender_data["color"],
        #shared_with=kalender_data["shared_with"]
    )


    db_session.add(neuer_kalender)
    db_session.commit()
    db_session.close()


    return jsonify({
        "success": True,
        "message": "Kalender gespeichert"
    })

@kalender.route("/get-kalneder-typen")
def get_kaender():
    user_id = flask_session.get("user_id")
    db_session = Session()
    kalender = db_session.query(Calender_typ).filter_by(user_id=user_id).all()

    daten = []

    for k in kalender:
        daten.append({
            "id": k.id,
            "titel": k.titel,
            "color": k.color
        })

    db_session.close()

    
    return jsonify({
        "success": True,
        "message": daten
    })
