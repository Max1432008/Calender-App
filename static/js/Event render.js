// =====================================================
// DIESE DATEI: Events im Kalender-Grid anzeigen
// und das Bearbeiten-Popup öffnen (create_More).
// =====================================================

async function get_color(calendarTypeId) {
  const response = await fetch("/get-kalneder-typen");

  if (!response.ok) {
    console.error("Fehler beim Laden der Kalender:", response.status);
    return null;
  }

  const data = await response.json();
  return data.message.find((kalender) => kalender.id === calendarTypeId);
}

function sortEventsByTime(events) {
  return events.sort((a, b) => new Date(a.day_start) - new Date(b.day_start));
}

async function upload_kalender_typen() {
  const response = await fetch("/get-event-typen");

  if (!response.ok) {
    console.error("Fehler beim Laden der Events:", response.status);
    return [];
  }

  const data_event = await response.json();
  return sortEventsByTime(data_event.message) || [];
}

function updatePopupPosition(popup, event) {
  const rect = event.getBoundingClientRect();

  const spaceBottom = window.innerHeight - rect.bottom;
  const spaceRight = window.innerWidth - rect.right;
  const spaceTop = rect.top;
  const spaceLeft = rect.left;

  popup.classList.toggle(
    "up-popup",
    spaceBottom < popup.offsetHeight && spaceTop > popup.offsetHeight,
  );
  popup.classList.toggle(
    "left-popup",
    spaceRight < popup.offsetWidth && spaceLeft > popup.offsetWidth,
  );
  popup.classList.toggle(
    "left-up-popup",
    spaceRight < popup.offsetWidth &&
      spaceLeft > popup.offsetWidth &&
      spaceBottom < popup.offsetHeight &&
      spaceTop > popup.offsetHeight,
  );
}

function setupPopup(popup, container) {
  document.addEventListener("click", function closePopup(event) {
    if (!popup.contains(event.target)) {
      popup.remove();
      container.classList.remove("active");
      openPopup = null;
      openContainer = null;
      document.removeEventListener("click", closePopup);
    }
  });
}

// "2026-08-14T16:30:00" -> ["2026-08-14", "16:30"]
function get_time(day) {
  const date = new Date(day);
  const tag = date.toISOString().slice(0, 10);
  const uhrzeit = date.toTimeString().slice(0, 5);
  return [tag, uhrzeit];
}

let openPopup = null;
let openContainer = null;

// Öffnet das Bearbeiten-Popup für ein Event.
// eventData = das komplette Event-Objekt vom Server.
function create_More(klon_event, container, eventData) {
  const event = klon_event.querySelector(".event");

  event.addEventListener("click", (e) => {
    e.stopPropagation();

    document
      .querySelectorAll("#more-calender-day")
      .forEach((popup) => popup.remove());

    container.classList.add("active");

    const template = document.getElementById("More-Envent-Info");
    const klon = template.content.cloneNode(true);

    const title = klon.querySelector(".title-input");
    const place = klon.querySelector(".place-input");
    const selectButton = klon.querySelector(".select-button");
    const selectAppend = klon.querySelector(".select-append");
    const circle = klon.querySelector(".circle");
    const holeDayCheckbox = klon.querySelector(".hole-day-checkbox");
    const dayStartInput = klon.querySelector(".day-start-input");
    const timeStartInput = klon.querySelector(".time-start-input");
    const dayEndInput = klon.querySelector(".day-end-input");
    const timeEndInput = klon.querySelector(".time-end-input");
    const repeatSelect = klon.querySelector(".repeat-select");
    const textareaMore = klon.querySelector(".textarea-more");
    const closeSheetBtn = klon.querySelector(".close-sheet-btn");
    const saveEventBtn = klon.querySelector(".save-event-btn");

    title.value = eventData.title ?? "";
    place.value = eventData.place ?? "";
    holeDayCheckbox.checked = eventData.hole_day ?? false;

    dayStartInput.value = get_time(eventData.day_start)[0] ?? "";
    timeStartInput.value = get_time(eventData.day_start)[1] ?? "";
    dayEndInput.value = get_time(eventData.day_end)[0] ?? "";
    timeEndInput.value = get_time(eventData.day_end)[1] ?? "";

    repeatSelect.value = eventData.repeat ?? "Nie";
    textareaMore.value = eventData.content ?? "";

    const popup = klon.querySelector("#more-calender-day");

    function closeColorPicker(ev) {
      if (!selectAppend.contains(ev.target) && ev.target !== selectButton) {
        selectAppend.style.display = "none";
      }
    }

    selectButton.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (selectAppend.parentElement !== document.body) {
        document.body.appendChild(selectAppend);
      }
      const rect = selectButton.getBoundingClientRect();
      selectAppend.style.position = "fixed";
      selectAppend.style.left = rect.left - 120 + "px";
      selectAppend.style.top = rect.bottom - 100 + "px";
      selectAppend.style.display = "block";
      selectAppend.style.opacity = "1";
      selectAppend.style.zIndex = "99999";
      upload_kalender_color(popup, selectAppend);
    });

    document.addEventListener("click", closeColorPicker);

    const farbe = calendarColors.find(
      (color) => color.name.trim() === (eventData.color ?? "").trim(),
    );
    if (farbe) {
      circle.style.backgroundColor = `var(${farbe.var})`;
    }

    // WICHTIG: draftCalendar sofort mit den Werten DIESES Events
    // befüllen. Sonst wird beim Speichern die falsche Farbe geschickt,
    // falls der Nutzer keine neue Farbe anklickt.
    get_color(eventData.calender_typ_id).then((kalender) => {
      if (kalender) {
        selectButton.textContent = kalender.titel;
        draftCalendar.calendarTypeId = kalender.id;
        draftCalendar.color = kalender.color;
        draftCalendar.calendarTitle = kalender.titel;
      }
    });

    closeSheetBtn.addEventListener("click", () => popup.remove());

    saveEventBtn.addEventListener("click", () => {
      Update_Event_Data(popup, eventData).then((payload) => {
        if (!payload) return;
        updateEventInDOM(container, payload, eventData);
      });
    });

    const delete_event = document.createElement("button");
    delete_event.classList.add("delete-event-btn");
    delete_event.innerText = "Löschen";
    popup.appendChild(delete_event);

    document.body.appendChild(popup);

    const rect = e.currentTarget.getBoundingClientRect();
    popup.style.left = rect.left + "px";
    popup.style.top = rect.bottom + "px";
    updatePopupPosition(popup, event);

    openPopup = popup;
    openContainer = container;
    setupPopup(popup, container);
  });
}

// Baut den Event-Button im Grid (Farbe, Titel, Zeit).
function createEvent(container, eventData) {
  const content = container.querySelector(".content");
  const template = document.getElementById("Event");
  const klon = template.content.cloneNode(true);

  const eventColorElement = klon.querySelector(".event-color");
  const eventTitleElement = klon.querySelector(".event-content");
  const eventTimeElement = klon.querySelector(".event-time");
  const eventElement = klon.querySelector(".event");

  eventElement.dataset.eventId = eventData.id;
  eventTitleElement.textContent = eventData.title ?? "Ohne Titel";

  eventTimeElement.textContent = eventData.day_start
    ? new Date(eventData.day_start).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Keine Zeit";

  const farbe = calendarColors.find(
    (color) => color.name.trim() === (eventData.color ?? "").trim(),
  );
  if (farbe) {
    eventColorElement.style.background = `var(${farbe.var})`;
  }

  create_More(klon, container, eventData);
  content.appendChild(klon);
}

function renderEventsForDay(container, year, month, day, eventList) {
  if (!Array.isArray(eventList)) {
    console.error("eventList ist kein Array:", eventList);
    return;
  }

  for (let i = 0; i < eventList.length; i++) {
    const eventStart = new Date(eventList[i].day_start);
    const eventEnd = new Date(eventList[i].day_end);
    const currentDay = new Date(year, month - 1, day);

    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);

    if (currentDay >= eventStart && currentDay <= eventEnd) {
      createEvent(container, eventList[i]);
    }
  }
}
