from flask import Blueprint, request, jsonify, session as flask_session
from models import Session, Calender_typ, Event, User
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
            user_id=user_id,
            titel=kalender_data["name"],
            color=kalender_data["color"]
        )

    email = kalender_data.get("shared_with")

    if email:
        shared_user = db_session.query(User).filter_by(email=email).first()
        if shared_user:
            neuer_kalender.shared_with.append(shared_user)
    else:
        return jsonify({
            "success": False,
            "error": "Die Email ist nicht hinterlegt"
        })




    db_session.add(neuer_kalender)
    db_session.commit()
    db_session.close()


    return jsonify({
        "success": True,
        "message": "Kalender gespeichert"
    })




@kalender.route("/update-kalender", methods=["PUT"])
def update_kalender():
    user_id = flask_session.get("user_id")
    db_session = Session()

    data = request.get_json(silent=True) or {}
    kalender_data = data.get("kalender_data")

    if not kalender_data:
        db_session.close()
        return jsonify({"success": False, "error": "Keine Kalenderdaten"})

    kalender = db_session.query(Calender_typ).filter_by(
        id=kalender_data["id"],
        user_id=user_id
    ).first()

    if not kalender:
        db_session.close()
        return jsonify({"success": False, "error": "Kalender nicht gefunden"})

    kalender.titel = kalender_data["name"]
    kalender.color = kalender_data["color"]

    emails = [
        e.strip()
        for e in (kalender_data.get("shared_with") or "").split(",")
        if e.strip()
    ]

    neue_shared_user = db_session.query(User).filter(
        User.email.in_(emails)
    ).all() if emails else []

    kalender.shared_with = neue_shared_user
    db_session.commit()
    db_session.close()

    return jsonify({"success": True, "message": "Kalender aktualisiert"})





@kalender.route("/share-kalender", methods=["POST"])
def share_kalender():
    user_id = flask_session.get("user_id")
    db_session = Session()

    data = request.get_json(silent=True) or {}

    kalender_id = data.get("kalender_id")
    other_user_email = data.get("email")

    if not kalender_id:
        db_session.close()
        return jsonify({"success": False, "error": "Keine Kalender-ID"})

    kalender = db_session.query(Calender_typ).filter_by(id=kalender_id, user_id=user_id).first()
    shared_user = db_session.query(User).filter_by(email=other_user_email).first()

    if kalender and shared_user:
        kalender.shared_with.append(shared_user)
        db_session.commit()
        db_session.close()
        return jsonify({"success": True, "message": "Kalender geteilt"})

    db_session.close()
    return jsonify({
        "success": False,
        "error": "Kalender oder User nicht gefunden",
        "message": "Kalender oder User nicht gefunden"
    })





@kalender.route("/get-kalneder-typen")
def get_kaender():
    user_id = flask_session.get("user_id")
    db_session = Session()

    eigene_kalender = db_session.query(Calender_typ).filter_by(
        user_id=user_id
    ).all()

    daten = []

    for k in eigene_kalender:
        daten.append({
            "id": k.id,
            "titel": k.titel,
            "color": k.color,
            "shared_with": [
                {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
                for user in k.shared_with
            ]
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
        repeat=event_data["repeat"],
        calender_typ_id=event_data["calender_typ_id"],
    )


    db_session.add(neues_event)
    db_session.commit()
    db_session.close()


    return jsonify({
        "success": True,
        "message": "Event gespeichert"
    })




@kalender.route("/update_event_data", methods=["POST"])
def update_event_data():
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

    event = db_session.query(Event).filter_by(
    id=event_data["eventId"],
    user_id=user_id
    ).first()

    event.title = event_data["title"]
    event.place = event_data["place"]
    event.hole_day = event_data["hole_day"]
    event.day_start = day_start
    event.day_end=day_end
    event.content=event_data["content"]
    event.repeat=event_data["repeat"]
    event.calender_typ_id=event_data["calender_typ_id"]
    


    db_session.add(event)
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

    user = db_session.query(User).filter_by(id=user_id).first()
    eigene_kalender = db_session.query(Calender_typ).filter_by(user_id=user_id).all()
    geteilte_kalender = user.kalender_typen

    alle_ids = [k.id for k in eigene_kalender] + [k.id for k in geteilte_kalender]

    events = db_session.query(Event).filter(Event.calender_typ_id.in_(alle_ids)).all()

    daten = []

    for k in events:
        daten.append({
            "id": k.id,
            "title": k.title,
            "place": k.place,
            "hole_day": k.hole_day,
            "day_start": k.day_start.isoformat(),
            "day_end": k.day_end.isoformat(),
            "calender_typ_id": k.calender_typ_id,
            "content": k.content,
            "repeat": k.repeat,
            "color": k.calender_typ.color if k.calender_typ else None,
        })    
    db_session.close()


    return jsonify({
        "success": True,
        "message": daten
    })










@kalender.route("/delete-event", methods=["POST"])
def delete_event():
    user_id = flask_session.get("user_id")
    db_session = Session()

    data = request.get_json(silent=True) or {}

    print("REGISTER:", data)

    event_id = data.get("eventId")

    if not event_id:
        db_session.close()
        return jsonify({
            "success": False,
            "error": "Keine Event-ID"
        })

    event = db_session.query(Event).filter_by(
        id=event_id,
        user_id=user_id
    ).first()

    if not event:
        db_session.close()
        return jsonify({
            "success": False,
            "error": "Event nicht gefunden"
        })

    db_session.delete(event)
    db_session.commit()
    db_session.close()

    return jsonify({
        "success": True,
        "message": "Event gelöscht"
    })







