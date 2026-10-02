from flask import Blueprint, request, jsonify, session as flask_session
from models import Session, Calender_typ, Event, User
from datetime import datetime, date
import json


import requests
ai_chat = Blueprint("ai_chat", __name__)

import ollama

def kalender_text_verarbeiten(text):
    heute = date.today().isoformat()

    result = ollama.generate(
        model="llama3.1",
        system="""
        Du bist ein Parser für Kalendertermine.

        Deine Aufgabe ist es, einen natürlichen deutschen Text zu analysieren
        und daraus die Informationen für einen Kalendertermin zu extrahieren.

        Du sollst NICHT:
        - ein konkretes Datum berechnen
        - relative Datumsangaben selbst berechnen
        - erklären, was du machst
        - Fragen beantworten
        - zusätzliche Informationen erfinden

        Gib IMMER ausschließlich dieses JSON-Objekt zurück:

        {
        "title": "string oder null",
        "place": "string oder null",
        "weekday": "Montag | Dienstag | Mittwoch | Donnerstag | Freitag | Samstag | Sonntag | null",
        "start_time": "HH:MM oder null",
        "end_time": "HH:MM oder null",
        "repeat": "Nie | Täglich | Wöchentlich | Monatlich | Jährlich",
        "hole_day": true oder false,
        "content": "string oder null"
        }

        REGELN:

        1. title:
            Der Name des Termins.

        2. place:
            Der Ort, an dem der Termin stattfindet.
            Wenn kein Ort genannt wird, null.

        3. weekday:
            Der Wochentag, an dem der Termin stattfindet.
            Wenn kein Wochentag genannt wird, null.
            Schreibe nur den Namen des Wochentags.

        4. start_time:
            Die Startzeit des Termins im Format HH:MM.
            Beispiel: "19 Uhr" → "19:00".

        5. end_time:
            Die Endzeit des Termins im Format HH:MM.
            Beispiel: "bis 20 Uhr" → "20:00".
            Wenn keine Endzeit genannt wird, null.

        6. repeat:
            Erkenne, ob sich der Termin wiederholt.
            
            "jede Woche", "wöchentlich" → "Wöchentlich"
            "jeden Tag", "täglich" → "Täglich"
            "jeden Monat", "monatlich" → "Monatlich"
            "jedes Jahr", "jährlich" → "Jährlich"
            Wenn der Termin einmalig ist → "Nie"

        7. hole_day:
            true, wenn der Termin als ganztägiger Termin beschrieben wird.
            Ansonsten false.

        8. content:
            Zusätzliche Informationen aus dem Text, die nicht zu title,
            place, weekday, start_time, end_time oder repeat gehören.
            Wenn keine zusätzlichen Informationen vorhanden sind, null.

       9. Personen:
        Wenn im Text eine oder mehrere Personen ausdrücklich genannt werden, müssen diese Informationen erhalten bleiben.

        * Wenn die Person direkt zum Termin gehört, füge den Namen in title ein, zum Beispiel: "Zahnarzt (Mutter)".
        * Wenn die Person nur eine zusätzliche Information ist, füge sie in content ein, zum Beispiel: "Termin für meine Mutter".
        * Personen dürfen NICHT weggelassen werden.
        * Erfinde keine Person und ändere keinen genannten Namen.
        * Erkenne auch Personenbezeichnungen wie "meine Mutter", "mein Vater", "meine Freundin", "Max", "Herr Müller" oder "Lisa".
        * Wenn keine Person genannt wird, bleibt content null, sofern keine anderen zusätzlichen Informationen vorhanden sind.

        WICHTIG:
            Du sollst NIEMALS ein Datum erzeugen oder berechnen.

            Wenn der Benutzer beispielsweise schreibt:

            "Ich hab jede Woche Karate und das am Mittwoch von 19 Uhr bis 20 Uhr in Heide"

            dann lautet die Ausgabe:

            {
            "title": "Karate",
            "place": "Heide",
            "weekday": "Mittwoch",
            "start_time": "19:00",
            "end_time": "20:00",
            "day_start": null,
            "day_end": null,
            "repeat": "Wöchentlich",
            "hole_day": false,
            "content": null
            }
            Gib ausschließlich das JSON-Objekt zurück.
            Keine Erklärung.
            Keinen zusätzlichen Text.
        """,
    prompt=text,
    format="json"
)
    return result["response"]




@ai_chat.route("/ai-event", methods=["POST"])
def ai_event():
    data = request.get_json(silent=True) or {}
    text = data.get("text")
    #text = "Zahnarzt morgen um 15 Uhr"

    if not text:
        return jsonify({"success": False, "error": "Kein Text"}), 400

    antwort = kalender_text_verarbeiten(text)

    try:
        antwort = json.loads(antwort)
    except json.JSONDecodeError:
        return jsonify({"success": False, "error": "Ungültige Antwort", "ai_response": antwort}), 500

    print (antwort)
    return jsonify({"success": True, "message": antwort,})
