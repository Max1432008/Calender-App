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

  console.log("Events vom Server:", data_event);
  let data = sortEventsByTime(data_event.message);
  return data || [];
}

async function save_event_() {}

function updatePopupPosition(popup, event) {
  const rect = event.getBoundingClientRect();

  // Platz unter dem Event
  const spaceBottom = window.innerHeight - rect.bottom;
  const spaceRight = window.innerWidth - rect.right;

  // Platz über dem Event
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
  const append_more = klon_event.querySelector(".append-more");
  const event = klon_event.querySelector(".event");

  event.addEventListener("click", (e) => {
    e.stopPropagation();

    // Falls schon ein Popup offen ist

    const vorhandenePopups = document.querySelectorAll("#more-calender-day");
    console.log("Anzahl:", vorhandenePopups.length);
    vorhandenePopups.forEach((popup) => {
      popup.remove();
    });

    container.classList.add("active");

    const template = document.getElementById("More-Envent-Info");
    const klon = template.content.cloneNode(true);

    const title = klon.querySelector(".title-input");
    const place = klon.querySelector(".place-input");

    const selectContainer = klon.querySelector(".select-container");
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

    selectButton.addEventListener("click", (event) => {
      event.stopPropagation();

      selectAppend.style.display = "block";
      selectAppend.style.top = -15 + "px";
      selectAppend.style.opacity = 1;

      upload_kalender_color(popup, selectAppend);
    });

    const farbe = calendarColors.find(
      (color) => color.name.trim() === (alleEvents.color ?? "").trim(),
    );

    if (farbe) {
      selectButton.textContent = alleEvents.color;
      circle.style.backgroundColor = `var(${farbe.var})`;
    }

    const popup = klon.querySelector("#more-calender-day");

    closeSheetBtn.addEventListener("click", () => {
      popup.remove();
    });

    saveEventBtn.addEventListener("click", () => {
      console.log("speichern");
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

    // Aktuelles Popup merken
    openPopup = popup;
    openContainer = container;

    setupPopup(popup, container);
  });
}
async function createEvent(container, alleEvents) {
  const content = container.querySelector(".content");

  const template = document.getElementById("Event");
  const klon = template.content.cloneNode(true);

  const event = klon.querySelector(".event");
  const event_color = klon.querySelector(".event-color");
  const event_content = klon.querySelector(".event-content");
  const event_time = klon.querySelector(".event-time");
  const append_more = klon.querySelector(".append-more");

  console.log(alleEvents);
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

  console.log(alleEvents.length);
  for (let i = 0; i < alleEvents.length; i++) {
    const eventDate = new Date(alleEvents[i].day_start);

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
