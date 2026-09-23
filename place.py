from flask import Blueprint, request, jsonify, session as flask_session
from models import Session, Calender_typ, Event
from datetime import datetime

import requests
requests.packages.urllib3.util.connection.HAS_IPV6 = False

place = Blueprint("place", __name__)


@place.route("/search-place", methods=["POST"])
def search_place():
    data = request.get_json(silent=True) or {}
    place_data = data.get("kalender_data")

    if not place_data:
        return jsonify({
            "success": False,
            "error": "Keine Kalenderdaten"
        })

    params = {
        "q": place_data,
        "format": "json",
        "countrycodes": "de",
        "limit": 10,
        "addressdetails": 1
    }

    try:
        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params=params,
            timeout=5,
            headers={
                "User-Agent": "meine-kalender-app"
            }
        )

        response.raise_for_status()
        data = response.json()

    except requests.RequestException as error:
        print("Fehler bei Nominatim:", error)

        return jsonify({
            "success": False,
            "error": "Ortssuche momentan nicht erreichbar"
        }), 502

    except ValueError as error:
        print("Ungültige Antwort von Nominatim:", error)

        return jsonify({
            "success": False,
            "error": "Ungültige Antwort der Ortssuche"
        }), 502

    prioritaet = {
        "city": 1,
        "town": 2,
        "village": 3,
        "municipality": 4,
        "suburb": 5,
        "road": 6,
        "residential": 7,
        "house": 8,
    }

    data.sort(
        key=lambda x: prioritaet.get(
            x.get("type"),
            99
        )
    )

    place_list = []

    for ort in data:
        place_list.append({
            "name": ort.get("display_name", ""),
            "latitude": ort.get("lat"),
            "longitude": ort.get("lon")
        })

    return jsonify({
        "success": True,
        "message": place_list
    })
