from flask import Blueprint, request, jsonify, session as flask_session
from models import Session, Calender_typ, Event
from datetime import datetime

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


@kalender.route("/save-event", methods=["POST"])
def save_event():
    user_id = flask_session.get("user_id")
    db_session = Session()


    data = request.get_json(silent=True) or {}

    print("REGISTER:", data)

    event_data = data

    if not event_data:
        return jsonify({
            "success": False,
            "error": "Keine Eventdaten"
        })

    date_str = event_data["day_start"]   # "2026-07-15"
    time_str = event_data["time_start"]  # "15:30"

    day_start = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")

    date_str_end = event_data["day_end"]   # "2026-07-15"
    time_str_end = event_data["time_end"]  # "15:30"

    day_end = datetime.strptime(f"{date_str_end} {time_str_end}", "%Y-%m-%d %H:%M")
    

    neues_event = Event(
        user_id = user_id,
        title=event_data["title"],
        place=event_data["place"],
        hole_day=event_data["hole_day"],
        day_start=day_start,
        day_end=day_end,
        content=event_data["content"],
        calender_typ_id=event_data["calender_typ_id"],
    )


    db_session.add(neues_event)
    db_session.commit()
    db_session.close()


    return jsonify({
        "success": True,
        "message": "Event gespeichert"
    })

@kalender.route("/get-event-typen")
def get_events():
    user_id = flask_session.get("user_id")
    db_session = Session()
    events = db_session.query(Event).filter_by(user_id=user_id).all()

    daten = []

    for k in events:
        daten.append({
            "id": k.id,
            "title": k.title,
            "place": k.place,
            "hole_day": k.hole_day,
            "day_start": k.day_start,
            "day_end": k.day_end,
            "calender_typ_id": k.calender_typ_id,
            "content": k.content,

        })

    db_session.close()


    return jsonify({
        "success": True,
        "message": daten
    })




