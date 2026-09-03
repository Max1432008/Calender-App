// =====================================================
// DIESE DATEI: Event-Update speichern + im DOM live
// aktualisieren (ohne Reload).
// =====================================================

// "2026-08-14" + "16:30" -> "2026-08-14T16:30:00"
function combineDateAndTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  return `${dateStr}T${timeStr}:00`;
}

// Liest die Formular-Werte aus dem Popup.
// eventData = das ORIGINAL-Event (für die ID).
function Update_Event_GET_Data(popup, eventData) {
  const titleInput = popup.querySelector(".title-input");
  const placeInput = popup.querySelector(".place-input");
  const holeDayCheckbox = popup.querySelector(".hole-day-checkbox");
  const dayStartInput = popup.querySelector(".day-start-input");
  const dayEndInput = popup.querySelector(".day-end-input");
  const timeStartInput = popup.querySelector(".time-start-input");
  const timeEndInput = popup.querySelector(".time-end-input");
  const contentTextarea = popup.querySelector(".textarea-more");

  return {
    eventId: eventData.id,
    title: titleInput.value,
    place: placeInput.value,
    hole_day: holeDayCheckbox.checked,
    day_start: dayStartInput.value,
    day_end: dayEndInput.value,
    time_start: timeStartInput.value,
    time_end: timeEndInput.value,
    // draftCalendar = die aktuell im Popup ausgewählte Farbe/Kalender
    // (kommt aus nav.js, wird beim Öffnen des Popups in event-render.js
    // schon mit den bestehenden Werten des Events befüllt)
    calender_typ_id: draftCalendar.calendarTypeId,
    color: draftCalendar.color,
    content: contentTextarea.value,
  };
}

// Speichert das Event auf dem Server.
// Gibt ein Promise zurück, das die gesendeten Daten (payload) liefert,
// damit man danach das DOM aktualisieren kann.
function Update_Event_Data(popup, eventData) {
  const payload = Update_Event_GET_Data(popup, eventData);

  return fetch("/update_event_data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Serverfehler: ${response.status} ${response.statusText}`,
        );
      }
      return response.json();
    })
    .then((result) => {
      console.log("Erfolgreich gespeichert:", result);
      return payload;
    })
    .catch((error) => {
      console.error("Fehler beim Speichern:", error);
      return null;
    });
}

// Ersetzt das alte Event-Element im Grid durch ein neues
// mit den aktualisierten Werten (Titel, Zeit, Farbe).
function update_Event(container, payload, eventData) {
  const content = container.querySelector(".content");

  const oldEvent = container.querySelector(
    `.event[data-event-id="${eventData.id}"]`,
  );
  if (oldEvent) oldEvent.remove();

  const template = document.getElementById("Event");
  const klon = template.content.cloneNode(true);

  const eventColorElement = klon.querySelector(".event-color");
  const eventTitleElement = klon.querySelector(".event-content");
  const eventTimeElement = klon.querySelector(".event-time");
  const eventElement = klon.querySelector(".event");

  eventElement.dataset.eventId = eventData.id;
  eventTitleElement.textContent = payload.title ?? "Ohne Titel";

  const combinedStart = combineDateAndTime(
    payload.day_start,
    payload.time_start,
  );

  eventTimeElement.textContent = combinedStart
    ? new Date(combinedStart).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Keine Zeit";

  const farbe = calendarColors.find(
    (color) => color.name.trim() === (payload.color ?? "").trim(),
  );
  if (farbe) {
    eventColorElement.style.background = `var(${farbe.var})`;
  }

  // eventData für das nächste Öffnen des Popups aktualisieren
  const updatedEventData = {
    ...eventData,
    title: payload.title,
    place: payload.place,
    hole_day: payload.hole_day,
    day_start: combineDateAndTime(payload.day_start, payload.time_start),
    day_end: combineDateAndTime(payload.day_end, payload.time_end),
    calender_typ_id: payload.calender_typ_id,
    content: payload.content,
    color: payload.color,
  };

  create_More(klon, container, updatedEventData);
  content.appendChild(klon);
}

function updateEventInDOM(container, payload, eventData) {
  update_Event(container, payload, eventData);
}
