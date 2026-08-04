from flask import Blueprint, request, jsonify
from models import session, Calender_typ

kalender = Blueprint("kalender", __name__)


@kalender.route("/save-new-kalender", methods=["POST"])
def save_new_kalender():
    data = request.get_json(silent=True) or {}

    print("REGISTER:", data)

    kalender_data = data.get("kalender_data")

    if not kalender_data:
        return jsonify({
            "success": False,
            "error": "Keine Kalenderdaten"
        })


    neuer_kalender = Calender_typ(
        titel=kalender_data["name"],
        color=kalender_data["color"],
        #shared_with=kalender_data["shared_with"]
    )


    session.add(neuer_kalender)
    session.commit()


    return jsonify({
        "success": True,
        "message": "Kalender gespeichert"
    })

@kalender.route("/get-kalneder-typen")
def get_kaender():
    kalender = session.query(Calender_typ).all()

    daten = []

    for k in kalender:
        daten.append({
            "id": k.id,
            "titel": k.titel,
            "color": k.color
        })

    return jsonify({
        "success": True,
        "message": daten
    })