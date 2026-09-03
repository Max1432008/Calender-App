async function get_color(calendarId) {
  const response = await fetch("/get-kalneder-typen");

  if (!response.ok) {
    console.error("Fehler beim Laden der Kalender:", response.status);
    return null;
  }

  const data = await response.json();
  console.log(calendarId, "Kalender ID");
  const kalender = data.message.find(
    (kalender) => String(kalender.id) === String(calendarId),
  );
  console.log("Gefundener Kalender:", kalender);

  return kalender;
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

async function createEvent(container, Events) {
  const content = container.querySelector(".content");

  const template = document.getElementById("Event");
  //! template klon
  const klon = template.content.cloneNode(true);

  const eventColorElement = klon.querySelector(".event-color");
  const eventTitleElement = klon.querySelector(".event-content");
  const eventTimeElement = klon.querySelector(".event-time");
  const event = klon.querySelector(".event");

  event.dataset.eventId = Events.id;
  eventTitleElement.textContent = Events.title ?? "Ohne Titel";

  eventTimeElement.textContent = Events.day_start
    ? new Date(Events.day_start).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Keine Zeit";

  const farbe = calendarColors.find(
    (color) => color.name.trim() === (Events.color ?? "").trim(),
  );

  if (farbe) {
    eventColorElement.style.background = `var(${farbe.var})`;
  }

  create_More(klon, container, Events);
  content.appendChild(klon);
}

async function renderEventsForDay(container, year, month, day, Events) {
  if (!Array.isArray(Events)) {
    console.error("Events ist kein Array:", Events);
    return;
  }

  for (let i = 0; i < Events.length; i++) {
    const eventStart = new Date(Events[i].day_start);
    const eventEnd = new Date(Events[i].day_end);
    const currentDay = new Date(year, month - 1, day);

    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);

    if (currentDay >= eventStart && currentDay <= eventEnd) {
      createEvent(container, Events[i]);
    }
  }
}
