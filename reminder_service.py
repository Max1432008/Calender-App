"""Lokaler Erinnerungsdienst für den Kalender."""

import subprocess, time
from datetime import datetime, timedelta
from models import Session, Event



def sende_testmitteilung(event, differenz):
    print (event)
    title = event["title"].replace("\\", "\\\\").replace('"', '\\"')
    script = f'display notification "in unter {differenz.total_seconds() // 60} Min." with title "📅   {title}"'
    subprocess.run(["osascript", "-e", script], check=True)


def lese_termine():
    jetzt = datetime.now()
    with Session() as session:
        termin = (
            session.query(Event)
            .filter(Event.day_start > jetzt)
            .order_by(Event.day_start.asc())
            .first()
        )
        if termin is None:
            return None
        
        return {"id": termin.id, "title": termin.title, "start": termin.day_start}

def time_event_vergleich(jetzt, event):
    event_start = event["start"] if event else None
    if event_start is None:
        print("Keine Termine gefunden.")
        return

    differenz = event_start - jetzt

    if differenz <= timedelta(minutes=15) and differenz > timedelta(0):
        print("Erinnerung: Dein Termin beginnt in weniger als 15 Minuten!")
        sende_testmitteilung(event, differenz)

    elif differenz <= timedelta(0):
        print("Der Termin hat bereits begonnen.")

    else:
        print("Noch mehr als 15 Minuten bis zum Termin.")


def main():
    print("Sende eine Test-Mitteilung an macOS ...")
    lese_termine()

    print("macOS hat den Mitteilungsbefehl erfolgreich ausgeführt.")

    while True:
        jetzt = datetime.now()

        print(jetzt.strftime("%H:%M:%S"))
        time_event_vergleich(jetzt, lese_termine())


        time.sleep(60)



if __name__ == "__main__":
    main()