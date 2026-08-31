let Event_update = {
  title: "",
  place: "",
  eventId: "",
  hole_day: false,
  day_start: "",
  day_end: "",
  time_start: "",
  time_end: "",
  content: "",
  color: "",
};

function Update_Event_GET_Data(popup, alleEvents) {
  const titleInput = popup.querySelector(".title-input");
  const placeInput = popup.querySelector(".place-input");
  const holeDayCheckbox = popup.querySelector(".hole-day-checkbox");
  const dayStartInput = popup.querySelector(".day-start-input");
  const dayEndInput = popup.querySelector(".day-end-input");
  const timeStartInput = popup.querySelector(".time-start-input");
  const timeEndInput = popup.querySelector(".time-end-input");
  const contentTextarea = popup.querySelector(".textarea-more");

  Event_update.title = titleInput.value;
  Event_update.place = placeInput.value;
  Event_update.eventId = alleEvents.id;
  Event_update.hole_day = holeDayCheckbox.checked;
  Event_update.day_start = dayStartInput.value;
  Event_update.day_end = dayEndInput.value;
  Event_update.time_start = timeStartInput.value;
  Event_update.time_end = timeEndInput.value;
  Event_update.calender_typ_id = draftKalender_event.calender_typ_id;
  Event_update.content = contentTextarea.value;
  Event_update.color = draftKalender_event.name;

  return Event_update;
}

function Update_Event_Data(popup, alleEvents) {
  const data = Update_Event_GET_Data(popup, alleEvents);
  console.log("updaten bhier", data);
  fetch("/update_event_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Erfolgreich gespeichert:", data);
    })
    .catch((error) => {
      console.error("Fehler beim Speichern:", error);
    });
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

  if (spaceBottom < popup.offsetHeight && spaceTop > popup.offsetHeight) {
    popup.classList.add("up-popup");
  } else {
    popup.classList.remove("up-popup");
  }

  if (spaceRight < popup.offsetWidth && spaceLeft > popup.offsetWidth) {
    popup.classList.add("left-popup");
  } else {
    popup.classList.remove("left-popup");
  }

  if (
    spaceRight < popup.offsetWidth &&
    spaceLeft > popup.offsetWidth &&
    spaceBottom < popup.offsetHeight &&
    spaceTop > popup.offsetHeight
  ) {
    popup.classList.add("left-up-popup");
  } else {
    popup.classList.remove("left-up-popup");
  }
}

function setupPopup(popup, container) {
  document.addEventListener("click", function closePopup(event) {
    if (!popup.contains(event.target)) {
      popup.style.display = "none";
      popup.remove();

      container.classList.remove("active");

      openPopup = null;
      openContainer = null;

      document.removeEventListener("click", closePopup);
    }
  });
}

function get_time(day) {
  const date = new Date(day);
  const tag = date.toISOString().slice(0, 10);
  const uhrzeit = date.toTimeString().slice(0, 5);
  return [tag, uhrzeit];
}

let openPopup = null;
let openContainer = null;

function create_More(klon_event, container, alleEvents) {
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

    title.value = alleEvents.title ?? "";
    place.value = alleEvents.place ?? "";

    holeDayCheckbox.checked = alleEvents.hole_day ?? false;

    dayStartInput.value = get_time(alleEvents.day_start)[0] ?? "";
    timeStartInput.value = get_time(alleEvents.day_start)[1] ?? "";

    dayEndInput.value = get_time(alleEvents.day_end)[0] ?? "";
    timeEndInput.value = get_time(alleEvents.day_end)[1] ?? "";

    repeatSelect.value = alleEvents.repeat ?? "Nie";
    textareaMore.value = alleEvents.content ?? "";

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
      (color) => color.name.trim() === (alleEvents.color ?? "").trim(),
    );

    if (farbe) {
      selectButton.textContent = alleEvents.color;
      circle.style.backgroundColor = `var(${farbe.var})`;
    }

    closeSheetBtn.addEventListener("click", () => {
      popup.remove();
    });

    saveEventBtn.addEventListener("click", () => {
      Update_Event_Data(popup, alleEvents);
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

async function createEvent(container, alleEvents) {
  const content = container.querySelector(".content");

  const template = document.getElementById("Event");
  //! template klon
  const klon = template.content.cloneNode(true);

  const event_color = klon.querySelector(".event-color");
  const event_content = klon.querySelector(".event-content");
  const event_time = klon.querySelector(".event-time");

  event_content.textContent = alleEvents.title ?? "Ohne Titel";

  event_time.textContent = alleEvents.day_start
    ? new Date(alleEvents.day_start).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Keine Zeit";

  const farbe = calendarColors.find(
    (color) => color.name.trim() === (alleEvents.color ?? "").trim(),
  );

  if (farbe) {
    event_color.style.background = `var(${farbe.var})`;
  }

  create_More(klon, container, alleEvents);
  content.appendChild(klon);
}

async function renderEventsForDay(container, year, month, day, alleEvents) {
  if (!Array.isArray(alleEvents)) {
    console.error("alleEvents ist kein Array:", alleEvents);
    return;
  }

  for (let i = 0; i < alleEvents.length; i++) {
    const eventStart = new Date(alleEvents[i].day_start);
    const eventEnd = new Date(alleEvents[i].day_end);
    const currentDay = new Date(year, month - 1, day);

    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);

    if (currentDay >= eventStart && currentDay <= eventEnd) {
      createEvent(container, alleEvents[i]);
    }
  }
}
